import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, Loader2 } from "lucide-react";
import { generateIdeas, type IdeaResult } from "@/lib/ideas.functions";
import { saveBlueprints } from "@/lib/blueprint-store";
import { SiteShell, PageHeader, Reveal, NextLink } from "@/components/site-shell";
import { AnimatedSelect } from "@/components/animated-select";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Generate a Project Prototype — AI Guru Idea Engine" },
      {
        name: "description",
        content:
          "Enter your interests, skills, domain and available time. AI Guru returns project prototypes with features, tech stack and build phases.",
      },
      { property: "og:title", content: "Generate a Project Prototype — AI Guru Idea Engine" },
      {
        property: "og:description",
        content:
          "Scoped project prototypes with core features, layered tech stack, ordered build phases and pitfalls to avoid.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Generate,
});

const domains = [
  "Any domain",
  "Web / Full stack",
  "AI & Machine Learning",
  "Mobile apps",
  "IoT & Embedded",
  "Cybersecurity",
  "Data Science",
  "Cloud & DevOps",
];
const difficulties = ["Beginner friendly", "Moderate", "Ambitious"];
const durations = ["4 weeks", "2 months", "1 semester", "2 semesters"];

function Generate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    interests: "",
    skills: "",
    domain: "Any domain",
    difficulty: "Moderate",
    duration: "2 months",
  });

  const run = useServerFn(generateIdeas);
  const mutation = useMutation<IdeaResult, Error, typeof form>({
    mutationFn: (data) => run({ data }),
    onSuccess: (result, variables) => {
      saveBlueprints({ profile: variables, result, createdAt: new Date().toISOString() });
      navigate({ to: "/results" });
    },
  });

  const canSubmit = form.interests.trim().length > 2 && form.skills.trim().length > 1;

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24">
        <PageHeader
          eyebrow="Idea engine"
          title="Set your profile, get real prototypes"
          intro="Be honest about your skills — the prototypes are scoped to what you can actually finish."
        />

        <motion.form
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.1 }}
          className="surface mt-10 grid gap-5 p-6 md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) mutation.mutate(form);
          }}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold">What are you interested in?</span>
              <textarea
                required
                rows={3}
                value={form.interests}
                onChange={(e) => setForm({ ...form, interests: e.target.value })}
                placeholder="e.g. healthcare, sports analytics, helping farmers, music"
                className="resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold">What can you build with today?</span>
              <textarea
                required
                rows={3}
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="e.g. Python, React, basic SQL, a little Arduino"
                className="resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <AnimatedSelect
              label="Domain"
              value={form.domain}
              options={domains}
              onChange={(domain) => setForm({ ...form, domain })}
            />
            <AnimatedSelect
              label="Difficulty"
              value={form.difficulty}
              options={difficulties}
              onChange={(difficulty) => setForm({ ...form, difficulty })}
            />
            <AnimatedSelect
              label="Time available"
              value={form.duration}
              options={durations}
              onChange={(duration) => setForm({ ...form, duration })}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={!canSubmit || mutation.isPending}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Thinking it through…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Generate prototype
                </>
              )}
            </button>
            <span className="text-xs text-muted-foreground">
              Takes up to a minute, then opens your prototypes page.
            </span>
          </div>

          <AnimatePresence>
            {mutation.isError && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                {mutation.error.message || "The AI could not answer. Please try again."}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap gap-3">
            <NextLink to="/results" label="View my prototypes" />
            <NextLink to="/how-it-works" label="How it works" />
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
}
