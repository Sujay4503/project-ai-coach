import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Loader2, Sparkles } from "lucide-react";
import { askGuru } from "@/lib/chat.functions";
import { loadBlueprints } from "@/lib/blueprint-store";
import { SiteShell, PageHeader, Reveal, NextLink } from "@/components/site-shell";

export const Route = createFileRoute("/pitch")({
  head: () => ({
    meta: [
      { title: "Pitch Preparation — Viva & Demo Questions | AI Guru" },
      {
        name: "description",
        content:
          "Practise the questions panels ask about final-year projects, with an AI-drafted answer tailored to your own generated prototype.",
      },
      { property: "og:title", content: "Pitch Preparation — Viva & Demo Questions | AI Guru" },
      {
        property: "og:description",
        content: "Panel questions, a demo checklist and AI-drafted answers for your own project.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pitch,
});

const sections = [
  {
    heading: "The 60-second opening",
    questions: [
      "In one sentence, what problem does your project solve and for whom?",
      "Why does this problem matter enough for a semester of work?",
      "What exists already, and what do you do differently?",
    ],
  },
  {
    heading: "Technical depth",
    questions: [
      "Walk us through your architecture from user action to database.",
      "Why this technology stack and not the obvious alternative?",
      "Which part was hardest, and how did you debug it?",
      "How does your system behave when the input is bad or the network fails?",
    ],
  },
  {
    heading: "Results and evaluation",
    questions: [
      "How do you measure whether your project actually works?",
      "What are your accuracy, latency or usability numbers?",
      "What are the honest limitations of your current version?",
    ],
  },
  {
    heading: "Closing and future scope",
    questions: [
      "What would you build next with three more months?",
      "Who could deploy this in the real world, and what would it cost?",
      "What did you personally learn that a course could not teach?",
    ],
  },
];

const checklist = [
  "Rehearse the opening out loud until it fits in 60 seconds.",
  "Keep a recorded demo video ready in case live internet fails.",
  "Know one number for every claim you make.",
  "Prepare one slide of architecture you can draw from memory.",
  "Decide who speaks when, if you present as a team.",
];

function Pitch() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-24 md:pt-20">
        <PageHeader
          eyebrow="Pitch prep"
          title="Walk into the viva already knowing the questions"
          intro="Work through each block out loud. Tap a question to get an AI-drafted answer shaped around your own prototype."
        />

        <div className="mt-10 grid gap-6">
          {sections.map((section, i) => (
            <Reveal key={section.heading} delay={i * 0.06}>
              <div className="surface p-6">
                <p className="eyebrow">
                  0{i + 1} · {section.heading}
                </p>
                <div className="mt-4 grid gap-3">
                  {section.questions.map((q) => (
                    <QuestionRow key={q} question={q} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="surface mt-8 p-6">
            <p className="eyebrow">Demo-day checklist</p>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              {checklist.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-primary">—</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-3">
          <NextLink to="/tracker" label="Back to tracker" />
          <NextLink to="/dashboard" label="Dashboard" />
        </div>
      </section>
    </SiteShell>
  );
}

function QuestionRow({ question }: { question: string }) {
  const ask = useServerFn(askGuru);
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (!next || answer || loading) return;
    setLoading(true);
    setError(false);
    try {
      const data = loadBlueprints();
      const idea = data?.result.ideas[0];
      const context = idea
        ? `My project: ${idea.title} — ${idea.tagline}. Problem: ${idea.problem}. Stack: ${idea.techStack
            .map((t) => `${t.layer}: ${t.choice}`)
            .join(", ")}.`
        : "I have not generated a project yet, so answer generically for a final-year student.";
      const res = await ask({
        data: {
          messages: [
            {
              role: "user" as const,
              content: `${context}\nMy evaluation panel asks: "${question}". Draft a confident answer I can say in under 45 seconds, then add one follow-up question they might ask next.`,
            },
          ],
        },
      });
      setAnswer(res.reply);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-secondary"
      >
        {question}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
              {loading && (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Drafting your answer…
                </span>
              )}
              {error && <span>Could not draft an answer right now. Try again.</span>}
              {answer && <p className="whitespace-pre-wrap">{answer}</p>}
              {!loading && !error && !answer && (
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="size-4" /> Think it through first, then reopen for a draft.
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
