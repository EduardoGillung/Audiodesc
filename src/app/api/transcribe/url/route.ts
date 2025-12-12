import { getGroqClient } from "@/lib/groq/client";
import { createClient } from "@/lib/database/server";
import { SecurityValidator, RateLimiter } from "@/lib/security/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!RateLimiter.checkLimit(`transcribe-url-${clientIP}`, 5, 60000)) {
      return NextResponse.json(
        { error: "Muitas requisições. Tente novamente em 1 minuto." },
        { status: 429 }
      );
    }

    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 });
    }

    // Validar URL de segurança
    const urlValidation = SecurityValidator.validateExternalUrl(url);
    if (!urlValidation.isValid) {
      console.warn(`Tentativa de acesso a URL suspeita: ${url} - ${urlValidation.error}`);
      return NextResponse.json(
        { error: `URL inválida: ${urlValidation.error}` },
        { status: 400 }
      );
    }

    // Fetch com timeout e headers de segurança
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const audioResponse = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'AudioDesc-Transcriber/1.0',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!audioResponse.ok) {
      return NextResponse.json(
        { error: "Falha ao baixar áudio da URL" },
        { status: 400 }
      );
    }

    // Verificar Content-Type
    const contentType = audioResponse.headers.get('content-type') || '';
    const allowedTypes = ['audio/', 'application/octet-stream'];
    if (!allowedTypes.some(type => contentType.startsWith(type))) {
      return NextResponse.json(
        { error: "URL não contém um arquivo de áudio válido" },
        { status: 400 }
      );
    }

    const blob = await audioResponse.blob();
    
    // Verificar tamanho do arquivo
    if (blob.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande (máximo 25MB)" },
        { status: 400 }
      );
    }

    const file = new File([blob], "audio.ogg", { type: blob.type });

    const groq = getGroqClient();
    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3-turbo",
      response_format: "json",
      language: "pt",
    });

    // Tenta salvar no histórico, mas não falha se der erro
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("transcriptions").insert({
          user_id: user.id,
          title: "Transcrição de URL",
          audio_url: SecurityValidator.sanitizeText(url),
          transcription_text: SecurityValidator.sanitizeText(transcription.text),
          status: "completed",
        });
      }
    } catch (dbError) {
      console.warn("Failed to save transcription to history:", dbError);
    }

    return NextResponse.json({
      text: transcription.text,
    });
  } catch (error: any) {
    console.error("URL transcription error:", error);
    
    // Log de segurança para tentativas suspeitas
    if (error.name === 'AbortError') {
      const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
      console.warn(`Timeout na requisição de URL: ${clientIP}`);
      return NextResponse.json(
        { error: "Timeout ao processar URL" },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Falha ao transcrever áudio da URL" },
      { status: 500 }
    );
  }
}