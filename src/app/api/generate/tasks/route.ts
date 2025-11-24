import { getGroqClient } from "@/lib/groq/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), { status: 400 });
    }

    const groq = getGroqClient();
    const stream = await groq.chat.completions.create({
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
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Tasks generation error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate tasks" }), { status: 500 });
  }
}
