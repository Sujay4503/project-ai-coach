import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const Input = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(40),
});

const SYSTEM = `You are AI Guru, a warm, practical mentor for final-year engineering students.
You answer questions about choosing project ideas, features, technology choices, development steps,
debugging, documentation, and demo/viva preparation.
Be concrete and brief: short paragraphs or bullet lists, no fluff, no buzzwords.
If a question is outside academic projects and engineering learning, say so politely and steer back.`;

export const askGuru = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => Input.parse(raw))
  .handler(async ({ data }): Promise<{ reply: string }> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured yet.");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const result = await generateText({
      model: gateway("google/gemini-3.7-flash"),
      system: SYSTEM,
      messages: data.messages,
    });

    return { reply: result.text };
  });
