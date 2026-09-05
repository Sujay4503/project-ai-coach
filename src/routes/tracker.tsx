import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Trash2, Wand2 } from "lucide-react";
import { SiteShell, PageHeader, NextLink } from "@/components/site-shell";
import { loadBlueprints } from "@/lib/blueprint-store";
import { loadTasks, newId, saveTasks, type Task } from "@/lib/workspace-store";

export const Route = createFileRoute("/tracker")({
  head: () => ({
    meta: [
      { title: "Project Tracker — Build Phases & Progress | AI Guru" },
      {
        name: "description",
        content:
          "Break your final-year project into tasks, import build phases from your generated prototype and track completion week by week.",
      },
      { property: "og:title", content: "Project Tracker — Build Phases & Progress | AI Guru" },
      {
        property: "og:description",
        content: "Checkable tasks, imported build phases and a live progress bar for your project.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tracker,
});

function Tracker() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTasks(loadTasks());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveTasks(tasks);
  }, [tasks, ready]);

  const done = tasks.filter((t) => t.done).length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const importPhases = () => {
    const data = loadBlueprints();
    const idea = data?.result.ideas[0];
    if (!idea) return;
    const imported: Task[] = idea.steps.map((s) => ({
      id: newId(),
      title: s.work,
      phase: s.phase,
      done: false,
    }));
    setTasks((t) => [...imported, ...t]);
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-24 md:pt-20">
        <PageHeader
          eyebrow="Tracker"
          title="Every phase, ticked off one by one"
          intro="Add your own tasks or pull the build phases straight from your generated prototype."
        />

        <div className="surface mt-10 p-6">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">
              {done} of {tasks.length} done
            </span>
            <span className="font-mono text-xs text-muted-foreground">{percent}%</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${percent}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
            />
          </div>
        </div>

        <form
          className="mt-8 flex flex-wrap gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const t = title.trim();
            if (!t) return;
            setTasks((prev) => [{ id: newId(), title: t, phase: "My tasks", done: false }, ...prev]);
            setTitle("");
          }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. finish the login screen"
            className="min-w-[14rem] flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <Plus className="size-4" /> Add task
          </button>
          <button
            type="button"
            onClick={importPhases}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            <Wand2 className="size-4" /> Import build phases
          </button>
        </form>

        <ul className="mt-8 grid gap-3">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className="surface flex items-start gap-3 p-4"
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() =>
                    setTasks((prev) =>
                      prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)),
                    )
                  }
                  className="mt-1 size-4 accent-current"
                />
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${task.done ? "text-muted-foreground line-through" : ""}`}
                  >
                    {task.title}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                    {task.phase}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Delete task"
                  onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {ready && tasks.length === 0 && (
          <p className="mt-8 text-sm text-muted-foreground">
            No tasks yet. Add one above, or import the build phases from your prototype.
          </p>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <NextLink to="/notes" label="Open notes" />
          <NextLink to="/dashboard" label="Back to dashboard" />
        </div>
      </section>
    </SiteShell>
  );
}
