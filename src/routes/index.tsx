import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ListChecks,
  Lock,
  MessageCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { SiteShell, PopIn, Reveal } from "@/components/site-shell";

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

function Home() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28">
        <PopIn>
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
        </PopIn>
        <PopIn delay={0.15}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
            >
              Generate prototype <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              See how it works
            </Link>
          </div>
        </PopIn>

        <div className="mt-12 flex flex-wrap gap-3">
          {[
            { icon: ShieldCheck, label: "No personal data collected" },
            { icon: Lock, label: "Notes stay on your device" },
            { icon: Zap, label: "Prototype in about a minute" },
            { icon: ListChecks, label: "Tracker, notes & pitch prep built in" },
            { icon: MessageCircle, label: "AI mentor chat on every page" },
          ].map((f, i) => (
            <motion.span
              key={f.label}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.09, type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ y: -4 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold"
            >
              <f.icon className="size-3.5 text-primary" />
              {f.label}
            </motion.span>
          ))}
        </div>

        <dl className="mt-14 grid gap-6 sm:grid-cols-3">
          {[
            ["3", "tailored ideas per run"],
            ["6", "blueprint sections each"],
            ["0", "generic buzzword projects"],
          ].map(([n, label], i) => (
            <Reveal key={label} delay={i * 0.08}>
              <div className="surface p-6">
                <dt className="font-display text-3xl font-bold text-primary">{n}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <div className="surface flex flex-col items-start gap-6 bg-foreground p-8 text-background md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                Stop staring at a blank project title.
              </h2>
              <p className="mt-2 text-sm opacity-80">
                One honest description of your skills is all AI Guru needs.
              </p>
            </div>
            <Link
              to="/generate"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Generate prototype <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
}
