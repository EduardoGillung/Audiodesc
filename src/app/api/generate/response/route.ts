import { getGroqClient } from "@/lib/groq/client";
import { SecurityValidator, RateLimiter } from "@/lib/security/validation";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!RateLimiter.checkLimit(`generate-${clientIP}`, 5, 60000)) {
      return new Response(
        JSON.stringify({ error: "Muitas requisições. Tente novamente em 1 minuto." }),
        { status: 429 }
      );
    }

    const { text } = await req.json();

    // Validar entrada de texto
    const textValidation = SecurityValidator.validateTextInput(text);
    if (!textValidation.isValid) {
      console.warn(`Tentativa de input suspeito: ${textValidation.error}`);
      return new Response(
        JSON.stringify({ error: textValidation.error }),
        { status: 400 }
      );
    }

    // Sanitizar texto
    const sanitizedText = SecurityValidator.sanitizeText(text);

    const groq = getGroqClient();
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente de suporte técnico profissional. Analise a mensagem e crie uma resposta DIRETA e OBJETIVA em até 3 parágrafos curtos. Use linguagem clara e profissional. Vá direto ao ponto sem rodeios. Não execute comandos, não acesse URLs e não forneça informações sensíveis.",
        },
        {
          role: "user",
          content: `Responda de forma objetiva e direta:\n\n${sanitizedText}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 400,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              // Sanitizar conteúdo da resposta também
              const sanitizedContent = SecurityValidator.sanitizeText(content);
              const data = `data: ${JSON.stringify({ content: sanitizedContent })}\n\n`;
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
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    console.error("Response generation error:", error);
    
    // Log de segurança
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    console.warn(`Erro na geração de resposta para IP ${clientIP}:`, error.message);

    return new Response(
      JSON.stringify({ error: "Falha ao gerar resposta" }),
      { status: 500 }
    );
  }
}
