import { getGroqClient } from "@/lib/groq/client";
import { createClient } from "@/lib/database/server";
import { SecurityValidator, RateLimiter } from "@/lib/security/validation";
import { NextRequest, NextResponse } from "next/server";

function getFileExtensionFromUrl(url: string): string {
  const urlLower = url.toLowerCase();
  if (urlLower.includes('.mp3')) return 'mp3';
  if (urlLower.includes('.wav')) return 'wav';
  if (urlLower.includes('.ogg')) return 'ogg';
  if (urlLower.includes('.m4a')) return 'm4a';
  if (urlLower.includes('.flac')) return 'flac';
  if (urlLower.includes('.aac')) return 'aac';
  if (urlLower.includes('.webm')) return 'webm';
  return 'mp3'; // default
}

function getContentTypeFromExtension(extension: string): string {
  const types: Record<string, string> = {
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'm4a': 'audio/mp4',
    'flac': 'audio/flac',
    'aac': 'audio/aac',
    'webm': 'audio/webm'
  };
  return types[extension] || 'audio/mpeg';
}

export async function POST(req: NextRequest) {
  try {
<<<<<<< HEAD
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
=======
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL é obrigatória" },
>>>>>>> 00b36c4ce966d442ff31247db1480f88bdedf35a
        { status: 400 }
      );
    }

<<<<<<< HEAD
    const blob = await audioResponse.blob();
    
    // Verificar tamanho do arquivo
    if (blob.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande (máximo 25MB)" },
        { status: 400 }
      );
    }

    const file = new File([blob], "audio.ogg", { type: blob.type });
=======
    console.log('Attempting to transcribe URL:', url);
>>>>>>> 00b36c4ce966d442ff31247db1480f88bdedf35a

    // Detecta a extensão do arquivo
    const extension = getFileExtensionFromUrl(url);
    const contentType = getContentTypeFromExtension(extension);

    console.log('Detected extension:', extension, 'Content-Type:', contentType);

    // Baixa o áudio com timeout e headers apropriados
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos timeout

    let audioResponse;
    try {
      audioResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'audio/*,*/*',
        },
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { error: "Não foi possível acessar a URL. Verifique se o link está correto e acessível." },
        { status: 400 }
      );
    }

    clearTimeout(timeoutId);

    if (!audioResponse.ok) {
      console.error('Audio response not OK:', audioResponse.status, audioResponse.statusText);
      return NextResponse.json(
        { error: `Falha ao baixar o áudio: ${audioResponse.status} ${audioResponse.statusText}` },
        { status: 400 }
      );
    }

    // Verifica o tamanho do arquivo (limite de 25MB para Groq)
    const contentLength = audioResponse.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande. O limite é 25MB." },
        { status: 400 }
      );
    }

    console.log('Downloading audio...');
    const arrayBuffer = await audioResponse.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: contentType });
    
    console.log('Audio downloaded, size:', blob.size, 'bytes');

    if (blob.size === 0) {
      return NextResponse.json(
        { error: "O arquivo de áudio está vazio." },
        { status: 400 }
      );
    }

    // Cria o arquivo para o Groq
    const file = new File([blob], `audio.${extension}`, { type: contentType });

    console.log('Sending to Groq for transcription...');

    // Transcreve com Groq
    const groq = getGroqClient();
    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3-turbo",
      response_format: "json",
      language: "pt",
    });

    console.log('Transcription successful');

<<<<<<< HEAD
    if (user) {
      await supabase.from("transcriptions").insert({
        user_id: user.id,
        title: "Transcrição de URL",
        audio_url: SecurityValidator.sanitizeText(url),
        transcription_text: SecurityValidator.sanitizeText(transcription.text),
        status: "completed",
      });
=======
    // Tenta salvar no histórico, mas não falha se der erro
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("transcription_history").insert({
          user_id: user.id,
          title: "Transcrição de URL",
          transcription_text: transcription.text,
        });
      }
    } catch (dbError) {
      console.warn("Failed to save transcription to history:", dbError);
>>>>>>> 00b36c4ce966d442ff31247db1480f88bdedf35a
    }

    return NextResponse.json({
      text: transcription.text,
    });
  } catch (error: any) {
    console.error("URL transcription error:", error);
    
<<<<<<< HEAD
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
=======
    let errorMessage = "Falha ao transcrever áudio da URL";
    
    if (error instanceof Error) {
      if (error.message.includes('abort')) {
        errorMessage = "Tempo limite excedido ao baixar o áudio";
      } else if (error.message.includes('network')) {
        errorMessage = "Erro de rede ao acessar a URL";
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
>>>>>>> 00b36c4ce966d442ff31247db1480f88bdedf35a
      { status: 500 }
    );
  }
}
