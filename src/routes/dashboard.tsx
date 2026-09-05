import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ListChecks, NotebookPen, Presentation, Sparkles } from "lucide-react";
import { SiteShell, PageHeader, Reveal } from "@/components/site-shell";
import { loadBlueprints, type StoredBlueprints } from "@/lib/blueprint-store";
import { loadNotes, loadTasks } from "@/lib/workspace-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Track Your Final-Year Project | AI Guru" },
      {
        name: "description",
        content:
          "One place to see your generated prototypes, build progress, saved notes and pitch preparation for your final-year project.",
      },
      { property: "og:title", content: "Dashboard — Track Your Final-Year Project | AI Guru" },
      {
        property: "og:description",
        content: "Prototypes, progress, notes and pitch prep in a single project workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [data, setData] = useState<StoredBlueprints | null>(null);
  const [counts, setCounts] = useState({ tasks: 0, done: 0, notes: 0 });

  useEffect(() => {
    setData(loadBlueprints());
    const tasks = loadTasks();
    setCounts({
      tasks: tasks.length,
      done: tasks.filter((t) => t.done).length,
      notes: loadNotes().length,
    });
  }, []);

  const percent = counts.tasks ? Math.round((counts.done / counts.tasks) * 100) : 0;

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-20">
        <PageHeader
          eyebrow="Dashboard"
          title="Your project workspace"
          intro="Everything you have generated and saved, in one view. Stored only on this device."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            ["Prototypes", data ? String(data.result.ideas.length) : "0"],
            ["Build progress", `${percent}%`],
            ["Notes saved", String(counts.notes)],
          ].map(([label, val], i) => (
            <Reveal key={label} delay={i * 0.08}>
              <div className="surface p-6">
                <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                  {label}
                </p>
                <p className="mt-2 font-display text-3xl font-bold text-primary">{val}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {data && (
          <Reveal delay={0.1}>
            <div className="surface mt-8 p-6">
              <p className="eyebrow">Latest run</p>
              <ul className="mt-4 grid gap-3">
                {data.result.ideas.map((idea, i) => (
                  <li key={idea.title + i} className="flex flex-wrap items-baseline gap-2 text-sm">
                    <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                    <span className="font-semibold">{idea.title}</span>
                    <span className="text-muted-foreground">— {idea.tagline}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Link
                  to="/results"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  Open my prototypes
                </Link>
              </div>
            </div>
          </Reveal>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            {
              to: "/generate" as const,
              icon: Sparkles,
              title: "Generate a prototype",
              copy: "Turn your interests and skills into a scoped project plan.",
            },
            {
              to: "/tracker" as const,
              icon: ListChecks,
              title: "Progress tracker",
              copy: "Turn build phases into checkable tasks and watch the bar fill.",
            },
            {
              to: "/notes" as const,
              icon: NotebookPen,
              title: "Notes",
              copy: "Keep meeting notes, doubts and references beside your project.",
            },
            {
              to: "/pitch" as const,
              icon: Presentation,
              title: "Pitch preparation",
              copy: "Practise the questions your panel will actually ask.",
            },
          ].map((card, i) => (
            <Reveal key={card.to} delay={i * 0.06}>
              <Link to={card.to} className="surface block p-6 transition-transform hover:-translate-y-1">
                <card.icon className="size-5 text-primary" />
                <h2 className="mt-3 text-lg font-bold">{card.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{card.copy}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
