import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Trash2 } from "lucide-react";
import { SiteShell, PageHeader, NextLink } from "@/components/site-shell";
import { loadNotes, newId, saveNotes, type Note } from "@/lib/workspace-store";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Project Notes — Ideas, Doubts & References | AI Guru" },
      {
        name: "description",
        content:
          "Keep guide meeting notes, doubts, references and decisions for your final-year project in one private notebook on your device.",
      },
      { property: "og:title", content: "Project Notes — Ideas, Doubts & References | AI Guru" },
      {
        property: "og:description",
        content: "A private notebook for your project decisions, doubts and references.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Notes,
});

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "" });

  useEffect(() => {
    setNotes(loadNotes());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveNotes(notes);
  }, [notes, ready]);

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-24 md:pt-20">
        <PageHeader
          eyebrow="Notes"
          title="Write it down before you forget it"
          intro="Guide feedback, doubts, links, decisions — kept privately on this device."
        />

        <motion.form
          initial={{ opacity: 0, scale: 0.97, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.1 }}
          className="surface mt-10 grid gap-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.title.trim() && !draft.body.trim()) return;
            setNotes((prev) => [
              {
                id: newId(),
                title: draft.title.trim() || "Untitled note",
                body: draft.body.trim(),
                updatedAt: new Date().toISOString(),
              },
              ...prev,
            ]);
            setDraft({ title: "", body: "" });
          }}
        >
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Note title"
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm font-semibold outline-none focus:border-ring"
          />
          <textarea
            rows={4}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            placeholder="What did you learn, decide or get stuck on?"
            className="resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
          />
          <button
            type="submit"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <Plus className="size-4" /> Save note
          </button>
        </motion.form>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <AnimatePresence initial={false}>
            {notes.map((note) => (
              <motion.article
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className="surface p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-bold">{note.title}</h2>
                  <button
                    type="button"
                    aria-label="Delete note"
                    onClick={() => setNotes((prev) => prev.filter((n) => n.id !== note.id))}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                {note.body && (
                  <p className="mt-2 text-sm whitespace-pre-wrap text-muted-foreground">
                    {note.body}
                  </p>
                )}
                <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                  {new Date(note.updatedAt).toLocaleString()}
                </p>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {ready && notes.length === 0 && (
          <p className="mt-8 text-sm text-muted-foreground">No notes yet — write your first one.</p>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <NextLink to="/pitch" label="Prepare my pitch" />
          <NextLink to="/dashboard" label="Back to dashboard" />
        </div>
      </section>
    </SiteShell>
  );
}
