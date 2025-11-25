import { getGroqClient } from "@/lib/groq/client";
import { createClient } from "@/lib/database/server";
import { NextRequest, NextResponse } from "next/server";

async function extractAudioUrl(url: string): Promise<string> {
  // Se já é um link direto de áudio, retorna
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.webm'];
  if (audioExtensions.some(ext => url.toLowerCase().includes(ext))) {
    return url;
  }

  // Tenta buscar a página e extrair o link do áudio
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch page');
    }

    const html = await response.text();
    
    // Padrões para extrair URLs de áudio
    const patterns = [
      // Pixabay pattern
      /"url":"(https:\/\/[^"]*\.mp3[^"]*)"/,
      // Pattern genérico para tags audio
      /<audio[^>]*src="([^"]+)"/i,
      // Pattern para source dentro de audio
      /<source[^>]*src="([^"]+)"/i,
      // Pattern para data-src
      /data-src="([^"]*\.(mp3|wav|ogg|m4a)[^"]*)"/i,
      // Pattern para URLs diretas no HTML
      /(https?:\/\/[^\s"'<>]+\.(mp3|wav|ogg|m4a|flac|aac))/i
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        // Decodifica caracteres escapados
        let audioUrl = match[1].replace(/\\/g, '');
        return audioUrl;
      }
    }

    throw new Error('No audio URL found in page');
  } catch (error) {
    console.error('Error extracting audio URL:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 });
    }

    // Extrai a URL real do áudio
    let audioUrl: string;
    try {
      audioUrl = await extractAudioUrl(url);
      console.log('Audio URL extracted:', audioUrl);
    } catch (error) {
      return NextResponse.json(
        { error: "Não foi possível encontrar o áudio nesta URL. Use um link direto para arquivo de áudio." },
        { status: 400 }
      );
    }

    // Baixa o áudio
    const audioResponse = await fetch(audioUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!audioResponse.ok) {
      return NextResponse.json(
        { error: "Falha ao baixar o áudio da URL" },
        { status: 400 }
      );
    }

    const contentType = audioResponse.headers.get('content-type') || 'audio/mpeg';
    const blob = await audioResponse.blob();
    
    // Determina a extensão baseada no content-type
    let extension = 'mp3';
    if (contentType.includes('wav')) extension = 'wav';
    else if (contentType.includes('ogg')) extension = 'ogg';
    else if (contentType.includes('m4a') || contentType.includes('mp4')) extension = 'm4a';
    
    const file = new File([blob], `audio.${extension}`, { type: contentType });

    // Transcreve com Groq
    const groq = getGroqClient();
    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3-turbo",
      response_format: "json",
      language: "pt",
    });

    // Salva no banco se usuário estiver logado
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("transcriptions").insert({
        user_id: user.id,
        title: "Transcrição de URL",
        audio_url: url,
        transcription_text: transcription.text,
        status: "completed",
      });
    }

    return NextResponse.json({
      text: transcription.text,
    });
  } catch (error) {
    console.error("URL transcription error:", error);
    const errorMessage = error instanceof Error ? error.message : "Falha ao transcrever áudio da URL";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
