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
    console.error("Summary generation error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate summary" }), { status: 500 });
  }
}
