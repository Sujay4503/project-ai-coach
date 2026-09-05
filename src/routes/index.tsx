import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  Sparkles,
  Compass,
  Layers,
  Rocket,
  Wrench,
  AlertTriangle,
  ListChecks,
  Cpu,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { generateIdeas, type IdeaResult } from "@/lib/ideas.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Guru — Final-Year Project Idea Generator & Mentor" },
      {
        name: "description",
        content:
          "Tell AI Guru your interests and skills. Get three buildable final-year project ideas with features, technologies, development steps and improvements.",
      },
      { property: "og:title", content: "AI Guru — Final-Year Project Idea Generator & Mentor" },
      {
        property: "og:description",
        content:
          "From blank page to a full project blueprint: ideas, features, tech stack, build phases and evaluator-pleasing improvements.",
      },
    ],
  }),
  component: Home,
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

function Home() {
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
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2 font-display text-base font-bold">
            <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            AI Guru
          </a>
          <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#how">
              How it works
            </a>
            <a className="transition-colors hover:text-foreground" href="#generate">
              Generate
            </a>
            <a className="transition-colors hover:text-foreground" href="#roadmap">
              Roadmap
            </a>
          </nav>
          <a
            href="#generate"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get my idea
          </a>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28">
          <p className="eyebrow">Final-year project mentor</p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] font-extrabold md:text-6xl">
            Your final-year project,{" "}
            <span className="text-primary">planned by an AI that knows the syllabus grind.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Describe what you enjoy and what you can code. AI Guru returns three buildable project
            ideas — each with features, technologies, development steps and ways to make it stand
            out.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#generate"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
            >
              Generate my blueprint <ArrowRight className="size-4" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              See how it works
            </a>
          </div>
          <dl className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              ["3", "tailored ideas per run"],
              ["6", "blueprint sections each"],
              ["0", "generic buzzword projects"],
            ].map(([n, label]) => (
              <div key={label} className="surface p-6">
                <dt className="font-display text-3xl font-bold text-primary">{n}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-6 py-20">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            From “no idea” to a plan, in four steps
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="surface flex flex-col gap-3 p-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
                    <s.icon className="size-5" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="generate" className="mx-auto max-w-6xl px-6 py-20">
          <p className="eyebrow">Idea engine</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">Set your profile, get real ideas</h2>

          <form
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
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
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

            {mutation.isError && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {mutation.error.message || "The AI could not answer. Please try again."}
              </p>
            )}
          </form>

          {mutation.data && (
            <div className="mt-10 grid gap-8">
              {mutation.data.ideas.map((idea, i) => (
                <article key={idea.title + i} className="surface p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      Idea 0{i + 1}
                    </span>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                      {idea.difficulty}
                    </span>
                    <span className="rounded-full bg-accent/30 px-3 py-1 text-xs font-medium">
                      {idea.timeline}
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl font-bold">{idea.title}</h3>
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
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="roadmap" className="mx-auto max-w-6xl px-6 py-20">
          <p className="eyebrow">Roadmap</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Start mapping your semester, not guessing it
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {roadmap.map((r) => (
              <div key={r.phase} className="surface p-6">
                <p className="font-mono text-xs text-primary">{r.phase}</p>
                <h3 className="mt-2 text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="surface flex flex-col items-start gap-6 bg-foreground p-8 text-background md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                Stop staring at a blank project title.
              </h2>
              <p className="mt-2 text-sm opacity-80">
                One honest description of your skills is all AI Guru needs.
              </p>
            </div>
            <a
              href="#generate"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
            >
              Generate my blueprint <ArrowRight className="size-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 text-sm text-muted-foreground md:flex-row md:justify-between">
          <span>AI Guru — final-year project mentor</span>
          <span className="font-mono text-xs">Powered by Lovable AI</span>
        </div>
      </footer>
    </div>
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

function BlockTitle({
  icon: Icon,
  title,
}: {
  icon: typeof Sparkles;
  title: string;
}) {
  return (
    <h4 className="flex items-center gap-2 text-sm font-semibold">
      <Icon className="size-4 text-primary" /> {title}
    </h4>
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
