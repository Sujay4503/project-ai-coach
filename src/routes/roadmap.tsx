import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader, Reveal, NextLink } from "@/components/site-shell";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Semester Roadmap — Plan Your Final-Year Project Week by Week" },
      {
        name: "description",
        content:
          "A week-by-week roadmap for your final-year project: lock the scope, build the skeleton, ship core features, then polish and document.",
      },
      { property: "og:title", content: "Semester Roadmap for Final-Year Projects" },
      {
        property: "og:description",
        content: "Four phases that take you from scope to viva demo without last-minute panic.",
      },
    ],
  }),
  component: Roadmap,
});

const roadmap = [
  {
    phase: "Week 1",
    title: "Lock the scope",
    body: "Pick one idea, write the problem statement, list only the features you can finish.",
  },
  {
    phase: "Week 2-3",
    title: "Build the skeleton",
    body: "Set up the repo, data model and one end-to-end flow that actually works.",
  },
  {
    phase: "Week 4-6",
    title: "Ship core features",
    body: "Finish the must-have features one at a time. Demo after each one.",
  },
  {
    phase: "Week 7-8",
    title: "Polish & document",
    body: "Add the standout improvement, write the report, rehearse the viva demo.",
  },
];

function Roadmap() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24">
        <PageHeader
          eyebrow="Roadmap"
          title="Start mapping your semester, not guessing it"
          intro="Use this as the backbone for whichever idea you pick. Every phase ends with something you can show."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {roadmap.map((r, i) => (
            <Reveal key={r.phase} delay={i * 0.08}>
              <div className="surface h-full p-6 transition-transform hover:-translate-y-1">
                <p className="font-mono text-xs text-primary">{r.phase}</p>
                <h2 className="mt-2 text-lg font-semibold">{r.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap gap-3">
            <NextLink to="/generate" label="Generate my blueprint" />
            <NextLink to="/how-it-works" label="How it works" />
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
}
