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
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-16 pb-16 md:pt-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <PopIn>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <span className="size-2 rounded-full bg-primary" />
              AI mentor for final-year projects
            </span>
            <h1 className="mt-7 max-w-2xl text-[2.6rem] leading-[1.02] font-extrabold md:text-6xl">
              Your final-year project,{" "}
              <span className="gradient-text">mapped before you build it.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Tell AI Guru what you enjoy and what you already know. It finds a project worth
              building, then coaches you through it — feature by feature, week by week.
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
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                See how it works
              </Link>
            </div>
          </PopIn>
        </div>

        <div className="relative mx-auto h-[26rem] w-full max-w-md lg:h-[30rem]">
          {[
            {
              tag: "HEALTHTECH",
              title: "Patient Vitals Anomaly Tracker",
              body: "Flags abnormal wearable readings before they become emergencies.",
              score: 91,
              pos: "top-0 right-0 w-[19rem]",
              rotate: -3,
              delay: 0.1,
            },
            {
              tag: "AGRICULTURE",
              title: "Crop Stress Detector",
              body: "Spots leaf stress from drone photos and alerts farmers via SMS.",
              score: 87,
              pos: "top-40 right-4 w-[18rem]",
              rotate: 5,
              delay: 0.22,
            },
            {
              tag: "EDTECH",
              title: "Peer Doubt-Solving Bot",
              body: "Routes student questions to the right senior automatically.",
              score: 79,
              pos: "bottom-0 left-0 w-[18rem]",
              rotate: -2,
              delay: 0.34,
            },
          ].map((c) => (
            <motion.article
              key={c.title}
              className={`float-card absolute ${c.pos} p-5`}
              initial={{ opacity: 0, y: 40, scale: 0.9, rotate: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: c.rotate }}
              transition={{ delay: c.delay, type: "spring", stiffness: 180, damping: 20 }}
              whileHover={{ rotate: 0, y: -8, scale: 1.03, zIndex: 20 }}
            >
              <span className="rounded-md bg-primary/10 px-2 py-1 font-mono text-[10px] font-bold tracking-wider text-primary">
                {c.tag}
              </span>
              <h3 className="mt-3 text-lg font-bold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${c.score}%` }}
                    transition={{ delay: c.delay + 0.3, duration: 0.9, ease: "easeOut" }}
                  />
                </div>
                <span className="font-mono text-xs font-semibold text-primary">{c.score}%</span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">


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
