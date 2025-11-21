import { getGroqClient } from "@/lib/groq/client";
import { createClient } from "@/lib/database/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const audioResponse = await fetch(url);
    if (!audioResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch audio from URL" },
        { status: 400 }
      );
    }

    const blob = await audioResponse.blob();
    const file = new File([blob], "audio.ogg", { type: blob.type });

    const groq = getGroqClient();
    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3-turbo",
      response_format: "json",
      language: "pt",
    });

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
    return NextResponse.json(
      { error: "Failed to transcribe audio from URL" },
      { status: 500 }
    );
  }
}
