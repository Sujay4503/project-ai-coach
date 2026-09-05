import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Loader2, UserPlus, LogIn, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usernameToEmail, useAuth } from "@/lib/use-auth";
import { SiteShell, PageHeader } from "@/components/site-shell";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Create Your AI Guru ID — Sign Up or Sign In" },
      {
        name: "description",
        content:
          "Create an AI Guru profile with just a unique ID and a password. No email, no phone number, no personal details required.",
      },
      { property: "og:title", content: "Create Your AI Guru ID — Sign Up or Sign In" },
      {
        property: "og:description",
        content: "A private profile for your project blueprints — unique ID and password only.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage;
});

function AuthPage() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { username } = useAuth();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const clean = id.trim().toLowerCase();
    if (!/^[a-z0-9._-]{3,24}$/.test(clean)) {
      setError("Your unique ID can use 3-24 letters, numbers, dots, dashes or underscores.");
      return;
    }
    if (password.length < 6) {
      setError("Use a password of at least 6 characters.");
      return;
    }
    setBusy(true);
    const email = usernameToEmail(clean);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username: clean } },
        });
        if (err) throw err;
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) throw signInErr;
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
      navigate({ to: "/generate" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(
        /already registered|already exists/i.test(msg)
          ? "That ID is taken. Try another one."
          : /invalid login/i.test(msg)
            ? "Wrong ID or password."
            : msg,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-2xl px-6 pt-16 pb-24 md:pt-24">
        <PageHeader
          eyebrow="Your AI Guru ID"
          title={mode === "signup" ? "Create your profile" : "Welcome back"}
          intro="Pick a unique ID and a password. That's it — no email, no phone, no personal details."
        />

        {username ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface mt-10 p-8"
          >
            <p className="text-sm">
              You are signed in as <span className="font-bold">{username}</span>.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/generate"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Generate prototype
              </Link>
              <button
                type="button"
                onClick={() => supabase.auth.signOut()}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                Sign out
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.1 }}
            className="surface mt-10 grid gap-5 p-6 md:p-8"
          >
            <div className="flex gap-2 rounded-full bg-secondary p-1 text-sm font-semibold">
              {(["signup", "signin"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setError(null);
                  }}
                  className={`flex-1 rounded-full px-4 py-2 transition-colors ${
                    mode === m ? "bg-background shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {m === "signup" ? "Create ID" : "Sign in"}
                </button>
              ))}
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">Unique ID</span>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                autoComplete="username"
                placeholder="e.g. guru_sujay"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder="At least 6 characters"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
              />
            </label>

            {error && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : mode === "signup" ? (
                <UserPlus className="size-4" />
              ) : (
                <LogIn className="size-4" />
              )}
              {mode === "signup" ? "Create my profile" : "Sign in"}
            </button>

            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" /> Your ID is the only thing we store. Remember your
              password — there is no email to recover it with.
            </p>
          </motion.form>
        )}
      </section>
    </SiteShell>
  );
}
