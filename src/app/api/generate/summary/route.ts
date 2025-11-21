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
            "Você é um assistente de resumo. Crie um resumo objetivo e conciso da mensagem, destacando os pontos principais e informações importantes. Seja direto e claro.",
        },
        {
          role: "user",
          content: `Resuma esta mensagem de forma objetiva:\n\n${text}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 256,
    });

    return NextResponse.json({
      summary: completion.choices[0]?.message?.content || "",
    });
  } catch (error) {
    console.error("Summary generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
