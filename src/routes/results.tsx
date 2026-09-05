import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, RotateCcw } from "lucide-react";
import { loadBlueprints, type StoredBlueprints } from "@/lib/blueprint-store";
import { IdeaCard } from "@/components/idea-card";
import { SiteShell, PageHeader, Reveal, NextLink } from "@/components/site-shell";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your Generated Prototypes — AI Guru Blueprints" },
      {
        name: "description",
        content:
          "Your AI-generated project prototypes, split into problem, features, technology stack, development steps and improvements.",
      },
      { property: "og:title", content: "Your Generated Prototypes — AI Guru Blueprints" },
      {
        property: "og:description",
        content: "Level-by-level project blueprints: problem, features, stack, steps, pitfalls.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Results,
});

function Results() {
  const [data, setData] = useState<StoredBlueprints | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setData(loadBlueprints());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-6xl px-6 py-24 text-sm text-muted-foreground">
          Loading your prototypes…
        </section>
      </SiteShell>
    );
  }

  if (!data) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-3xl px-6 pt-20 pb-24">
          <PageHeader
            eyebrow="Nothing here yet"
            title="No prototypes generated yet"
            intro="Fill in your interests and skills, and your prototypes will appear on this page."
          />
          <div className="mt-8">
            <NextLink to="/generate" label="Generate prototype" />
          </div>
        </section>
      </SiteShell>
    );
  }

  const { profile, result } = data;

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-24 md:pt-20">
        <PageHeader
          eyebrow="Your prototypes"
          title="Three prototypes, laid out level by level"
          intro="Each prototype is split into the problem, features, technology stack, ordered build steps and improvements."
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="surface mt-8 flex flex-wrap gap-x-8 gap-y-3 p-5 text-sm"
        >
          <Fact label="Interests" value={profile.interests} />
          <Fact label="Skills" value={profile.skills} />
          <Fact label="Domain" value={profile.domain} />
          <Fact label="Level" value={profile.difficulty} />
          <Fact label="Time" value={profile.duration} />
        </motion.div>

        <nav className="mt-6 flex flex-wrap gap-2">
          {result.ideas.map((idea, i) => (
            <a
              key={idea.title}
              href={`#idea-${i + 1}`}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-secondary"
            >
              0{i + 1} · {idea.title}
            </a>
          ))}
        </nav>

        <div className="mt-8 grid gap-8">
          {result.ideas.map((idea, i) => (
            <IdeaCard key={idea.title + i} idea={idea} index={i} />
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <RotateCcw className="size-4" /> Generate again
            </Link>
            <NextLink to="/roadmap" label="See the semester roadmap" />
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="size-3.5" /> Stuck on any step? Ask the AI Guru chat in the corner.
          </p>
        </Reveal>
      </section>
    </SiteShell>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[8rem]">
      <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}
