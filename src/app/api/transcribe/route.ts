import { getGroqClient } from "@/lib/groq/client";
import { createClient } from "@/lib/database/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Audio file is required" },
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
        await supabase.from("transcription_history").insert({
          user_id: user.id,
          title: file.name,
          transcription_text: transcription.text,
        });
      }
    } catch (dbError) {
      // Ignora erros do banco de dados para não bloquear a transcrição
      console.warn("Failed to save transcription to history:", dbError);
    }

    return NextResponse.json({
      text: transcription.text,
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
