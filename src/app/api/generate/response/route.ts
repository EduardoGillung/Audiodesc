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
            "Você é um assistente de suporte técnico profissional. Analise a mensagem e crie uma resposta DIRETA e OBJETIVA em até 3 parágrafos curtos. Use linguagem clara e profissional. Vá direto ao ponto sem rodeios.",
        },
        {
          role: "user",
          content: `Responda de forma objetiva e direta:\n\n${text}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 400,
    });

    return NextResponse.json({
      response: completion.choices[0]?.message?.content || "",
    });
  } catch (error) {
    console.error("Response generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
