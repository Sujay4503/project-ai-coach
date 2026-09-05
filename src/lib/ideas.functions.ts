import { createServerFn } from "@tanstack/react-start";
import { streamText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";

const Input = z.object({
  interests: z.string().min(1),
  skills: z.string().min(1),
  domain: z.string(),
  difficulty: z.string(),
  duration: z.string(),
});

const IdeaSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      tagline: z.string(),
      problem: z.string(),
      difficulty: z.string(),
      timeline: z.string(),
      coreFeatures: z.array(z.string()),
      bonusFeatures: z.array(z.string()),
      techStack: z.array(z.object({ layer: z.string(), choice: z.string() })),
      steps: z.array(z.object({ phase: z.string(), work: z.string() })),
      improvements: z.array(z.string()),
      pitfalls: z.array(z.string()),
    }),
  ),
});

export type IdeaResult = z.infer<typeof IdeaSchema>;

export const generateIdeas = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => Input.parse(raw))
  .handler(async ({ data }): Promise<IdeaResult> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured yet.");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const prompt = `You are AI Guru, a mentor for final-year engineering students.
Student interests: ${data.interests}
Student skills: ${data.skills}
Preferred domain: ${data.domain}
Target difficulty: ${data.difficulty}
Time available: ${data.duration}

Propose exactly 3 distinct, practical, buildable final-year project ideas.
Rules: no vague buzzword projects; each idea must be achievable by 1-3 students in the stated time using the stated skills (you may add at most one new technology to learn).
For each idea give: a specific title, a one-line tagline, the real problem it solves, difficulty, a realistic timeline, 4-6 core features, 2-3 bonus features, a tech stack broken down by layer (frontend, backend, database, AI/ML, deployment), 4-6 ordered development phases with concrete work in each, 3 improvement ideas that make it stand out to evaluators, and 2-3 common pitfalls.
Keep every sentence concise (under 30 words).`;

    try {
      const result = streamText({
        model: gateway("google/gemini-3.7-flash"),
        prompt,
        output: Output.object({ schema: IdeaSchema }),
      });
      return (await result.output) as IdeaResult;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error) && error.text) {
        const cleaned = error.text.replace(/^```json\s*|```$/g, "");
        return IdeaSchema.parse(JSON.parse(cleaned));
      }
      throw error;
    }
  });
