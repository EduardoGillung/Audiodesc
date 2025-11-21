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
            "Você é um assistente de suporte técnico profissional. Crie uma resposta clara, educada e objetiva para o cliente baseada na mensagem recebida. A resposta deve ser em português e resolver o problema do cliente.",
        },
        {
          role: "user",
          content: `Crie uma resposta profissional para esta mensagem:\n\n${text}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 512,
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
