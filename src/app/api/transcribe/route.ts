import { getGroqClient } from "@/lib/groq/client";
import { createClient } from "@/lib/database/server";
import { SecurityValidator, RateLimiter } from "@/lib/security/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!RateLimiter.checkLimit(`transcribe-${clientIP}`, 10, 60000)) {
      return NextResponse.json(
        { error: "Muitas requisições. Tente novamente em 1 minuto." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo de áudio é obrigatório" },
        { status: 400 }
      );
    }

    // Validar arquivo de áudio
    const fileValidation = SecurityValidator.validateAudioFile(file);
    if (!fileValidation.isValid) {
      console.warn(`Tentativa de upload de arquivo inválido: ${file.name} - ${fileValidation.error}`);
      return NextResponse.json(
        { error: fileValidation.error },
        { status: 400 }
      );
    }

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
          title: SecurityValidator.sanitizeText(file.name),
          audio_url: `file://${SecurityValidator.sanitizeText(file.name)}`,
          transcription_text: SecurityValidator.sanitizeText(transcription.text),
          status: "completed",
        });
      }
    } catch (dbError) {
      // Ignora erros do banco de dados para não bloquear a transcrição
      console.warn("Failed to save transcription to history:", dbError);
    }

    return NextResponse.json({
      text: transcription.text,
    });
  } catch (error: any) {
    console.error("Transcription error:", error);
    
    // Log de segurança
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    console.warn(`Erro na transcrição para IP ${clientIP}:`, error.message);

    return NextResponse.json(
      { error: "Falha ao transcrever áudio" },
      { status: 500 }
    );
  }
}
