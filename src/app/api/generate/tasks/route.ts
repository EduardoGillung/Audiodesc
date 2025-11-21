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
            "Você é um assistente de produtividade. Crie uma lista ENXUTA de tarefas numeradas (máximo 5-7 itens). Cada tarefa deve ser uma ação clara e específica. Use verbos de ação no início. Seja direto e prático, sem explicações longas.",
        },
        {
          role: "user",
          content: `Liste as tarefas principais para:\n\n${text}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 350,
    });

    return NextResponse.json({
      tasks: completion.choices[0]?.message?.content || "",
    });
  } catch (error) {
    console.error("Tasks generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate tasks" },
      { status: 500 }
    );
  }
}
