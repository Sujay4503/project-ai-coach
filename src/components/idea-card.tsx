import { motion } from "motion/react";
import {
  Sparkles,
  Rocket,
  Wrench,
  AlertTriangle,
  ListChecks,

} from "lucide-react";
import type { IdeaResult } from "@/lib/ideas.functions";

type Idea = IdeaResult["ideas"][number];

export function IdeaCard({ idea, index }: { idea: Idea; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.96, y: 28 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 24, delay: index * 0.1 }}
      id={`idea-${index + 1}`}
      className="surface scroll-mt-28 p-6 md:p-8"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          Prototype 0{index + 1}
        </span>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
          {idea.difficulty}
        </span>
        <span className="rounded-full bg-accent/30 px-3 py-1 text-xs font-medium">
          {idea.timeline}
        </span>
      </div>

      <h2 className="mt-4 text-2xl font-bold">{idea.title}</h2>
      <p className="mt-1 text-primary">{idea.tagline}</p>

      <Section n="1" title="Problem it solves">
        <p className="max-w-2xl text-sm text-muted-foreground">{idea.problem}</p>
      </Section>

      <Section n="2" title="Features">
        <div className="grid gap-6 md:grid-cols-2">
          <Block icon={ListChecks} title="Core features" items={idea.coreFeatures} />
          <Block icon={Sparkles} title="Bonus features" items={idea.bonusFeatures} />
        </div>
      </Section>

      <Section n="3" title="Technology stack">
        <ul className="grid gap-2 text-sm md:grid-cols-2">
          {idea.techStack.map((t) => (
            <li key={t.layer} className="flex flex-wrap gap-2 rounded-lg bg-secondary/50 px-3 py-2">
              <span className="font-mono text-xs text-muted-foreground">{t.layer}</span>
              <span className="font-medium">{t.choice}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section n="4" title="Development steps">
        <ol className="grid gap-3 border-l border-border pl-4 text-sm">
          {idea.steps.map((s, i) => (
            <li key={s.phase}>
              <p className="font-semibold">
                <span className="font-mono text-xs text-primary">{i + 1}.</span> {s.phase}
              </p>
              <p className="text-muted-foreground">{s.work}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section n="5" title="Improvements & pitfalls">
        <div className="grid gap-6 md:grid-cols-2">
          <Block icon={Wrench} title="Make it stand out" items={idea.improvements} />
          <Block icon={AlertTriangle} title="Pitfalls to avoid" items={idea.pitfalls} />
        </div>
      </Section>

      <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
        <Rocket className="size-3.5" /> Ready to build — start with step 1.
      </div>
    </motion.article>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-7 border-t border-border pt-6">
      <h3 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
        <span className="grid size-5 place-items-center rounded bg-primary/10 font-mono text-[10px] text-primary">
          {n}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function BlockTitle({ icon: Icon, title }: { icon: typeof Sparkles; title: string }) {
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

