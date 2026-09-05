import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { GuruChat } from "@/components/guru-chat";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/generate", label: "Generate" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tracker", label: "Tracker" },
  { to: "/notes", label: "Notes" },
  { to: "/pitch", label: "Pitch prep" },
  { to: "/results", label: "My prototypes" },
  { to: "/roadmap", label: "Roadmap" },
] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function PopIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.94, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const { username } = useAuth();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-base font-bold">
            <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            AI Guru
          </Link>
          <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {username ? (
              <>
                <span className="hidden text-sm font-semibold sm:inline">{username}</span>
                <button
                  type="button"
                  onClick={() => supabase.auth.signOut()}
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                Sign up
              </Link>
            )}
            <Link
              to="/generate"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Get my idea
            </Link>
          </div>
        </div>
      </header>

      <motion.main
        className="flex-1"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 text-sm text-muted-foreground md:flex-row md:justify-between">
          <span>AI Guru — final-year project mentor</span>
          <span className="font-mono text-xs">Powered by Lovable AI</span>
        </div>
      </footer>

      <GuruChat />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
}) {
  return (
    <PopIn>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 max-w-3xl text-3xl font-extrabold md:text-5xl">{title}</h1>
      {intro && <p className="mt-5 max-w-xl text-lg text-muted-foreground">{intro}</p>}
    </PopIn>
  );
}

export function NextLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
    >
      {label} <ArrowRight className="size-4" />
    </Link>
  );
}
