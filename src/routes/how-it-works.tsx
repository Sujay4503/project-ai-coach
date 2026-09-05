import { createFileRoute } from "@tanstack/react-router";
import { Compass, Sparkles, Layers, Rocket } from "lucide-react";
import { SiteShell, PageHeader, Reveal, NextLink } from "@/components/site-shell";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How AI Guru Works — Four Steps to a Project Plan" },
      {
        name: "description",
        content:
          "See how AI Guru turns your interests, skills and available time into three scoped final-year project blueprints with a build plan.",
      },
      { property: "og:title", content: "How AI Guru Works — Four Steps to a Project Plan" },
      {
        property: "og:description",
        content:
          "Share your profile, get three real ideas, see the blueprint, follow the build plan.",
      },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  {
    icon: Compass,
    title: "Tell us about you",
    body: "Your interests, the languages you actually know, and how much time you have.",
  },
  {
    icon: Sparkles,
    title: "Get three real ideas",
    body: "Specific, scoped projects that solve a real problem — no buzzword soup.",
  },
  {
    icon: Layers,
    title: "See the blueprint",
    body: "Core features, bonus features and the tech stack layer by layer.",
  },
  {
    icon: Rocket,
    title: "Follow the build plan",
    body: "Ordered phases, improvements that impress evaluators, and pitfalls to dodge.",
  },
];

function HowItWorks() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24">
        <PageHeader
          eyebrow="How it works"
          title={<>From “no idea” to a plan, in four steps</>}
          intro="AI Guru does the thinking a good mentor would do — scoping, sequencing and warning you about the traps."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="surface flex h-full flex-col gap-3 p-6 transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
                    <s.icon className="size-5" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                </div>
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap gap-3">
            <NextLink to="/generate" label="Generate prototype" />
            <NextLink to="/roadmap" label="See the semester roadmap" />
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
}
