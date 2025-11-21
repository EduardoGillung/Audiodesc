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
            "Você é um assistente de produtividade. Crie uma lista de tarefas (to-do list) objetiva e numerada com passos claros para resolver o problema ou atender a solicitação do cliente. Seja específico e prático.",
        },
        {
          role: "user",
          content: `Crie uma lista de tarefas passo a passo para:\n\n${text}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 512,
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
