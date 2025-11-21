import { getGroqClient } from "@/lib/groq/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente que analisa transcrições de áudio e fornece resumos, insights e ações sugeridas em português.",
        },
        {
          role: "user",
          content: `Analise esta transcrição e forneça:\n1. Resumo\n2. Pontos principais\n3. Ações sugeridas\n\nTranscrição: ${text}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json({
      interpretation: completion.choices[0]?.message?.content || "",
    });
  } catch (error) {
    console.error("Interpretation error:", error);
    return NextResponse.json(
      { error: "Failed to interpret text" },
      { status: 500 }
    );
  }
}
