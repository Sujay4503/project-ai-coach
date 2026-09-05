import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Sparkles,
  Rocket,
  Wrench,
  AlertTriangle,
  ListChecks,
  Cpu,
  Loader2,
} from "lucide-react";
import { generateIdeas, type IdeaResult } from "@/lib/ideas.functions";
import { SiteShell, PageHeader, Reveal, NextLink } from "@/components/site-shell";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Generate Project Blueprints — AI Guru Idea Engine" },
      {
        name: "description",
        content:
          "Enter your interests, skills, domain and available time. AI Guru returns three final-year project blueprints with features, tech stack and build phases.",
      },
      { property: "og:title", content: "Generate Project Blueprints — AI Guru Idea Engine" },
      {
        property: "og:description",
        content:
          "Three scoped project ideas with core features, layered tech stack, ordered build phases and pitfalls to avoid.",
      },
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
  });

  const canSubmit = form.interests.trim().length > 2 && form.skills.trim().length > 1;

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24">
        <PageHeader
          eyebrow="Idea engine"
          title="Set your profile, get real ideas"
          intro="Be honest about your skills — the ideas are scoped to what you can actually finish."
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
            <Select
              label="Domain"
              value={form.domain}
              options={domains}
              onChange={(domain) => setForm({ ...form, domain })}
            />
            <Select
              label="Difficulty"
              value={form.difficulty}
              options={difficulties}
              onChange={(difficulty) => setForm({ ...form, difficulty })}
            />
            <Select
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
                  <Sparkles className="size-4" /> Generate 3 project blueprints
                </>
              )}
            </button>
            <span className="text-xs text-muted-foreground">
              Takes up to a minute. Nothing is saved.
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

        <AnimatePresence>
          {mutation.data && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-10 grid gap-8"
            >
              {mutation.data.ideas.map((idea, i) => (
                <motion.article
                  key={idea.title + i}
                  initial={{ opacity: 0, scale: 0.96, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 24, delay: i * 0.12 }}
                  className="surface p-6 md:p-8"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">Idea 0{i + 1}</span>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                      {idea.difficulty}
                    </span>
                    <span className="rounded-full bg-accent/30 px-3 py-1 text-xs font-medium">
                      {idea.timeline}
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold">{idea.title}</h2>
                  <p className="mt-1 text-primary">{idea.tagline}</p>
                  <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{idea.problem}</p>

                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <Block icon={ListChecks} title="Core features" items={idea.coreFeatures} />
                    <Block icon={Sparkles} title="Bonus features" items={idea.bonusFeatures} />
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <BlockTitle icon={Cpu} title="Tech stack" />
                      <ul className="mt-3 grid gap-2 text-sm">
                        {idea.techStack.map((t) => (
                          <li key={t.layer} className="flex gap-2">
                            <span className="font-mono text-xs text-muted-foreground">
                              {t.layer}
                            </span>
                            <span className="font-medium">{t.choice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <BlockTitle icon={Rocket} title="Development steps" />
                      <ol className="mt-3 grid gap-3 border-l border-border pl-4 text-sm">
                        {idea.steps.map((s) => (
                          <li key={s.phase}>
                            <p className="font-semibold">{s.phase}</p>
                            <p className="text-muted-foreground">{s.work}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <Block icon={Wrench} title="Make it stand out" items={idea.improvements} />
                    <Block icon={AlertTriangle} title="Pitfalls to avoid" items={idea.pitfalls} />
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap gap-3">
            <NextLink to="/roadmap" label="See the semester roadmap" />
            <NextLink to="/how-it-works" label="How it works" />
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function BlockTitle({ icon: Icon, title }: { icon: typeof Sparkles; title: string }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold">
      <Icon className="size-4 text-primary" /> {title}
    </h3>
  );
}

function Block({
  icon,
  title,
  items,
}: {
  icon: typeof Sparkles;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <BlockTitle icon={icon} title={title} />
      <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
