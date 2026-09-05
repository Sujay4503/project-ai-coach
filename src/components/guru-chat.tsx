import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { askGuru } from "@/lib/chat.functions";

type Msg = { role: "user" | "assistant"; content: string };

const starters = [
  "Which idea suits a 2-month timeline?",
  "How do I explain my project in a viva?",
  "Suggest a tech stack for a beginner",
];

export function GuruChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm AI Guru. Ask me anything about your final-year project — ideas, features, tech choices, or how to present it.",
    },
  ]);
  const run = useServerFn(askGuru);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    const next = [...messages, { role: "user" as const, content: clean }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const res = await run({ data: { messages: next.filter((m) => m.content) } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI Guru could not answer. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
        whileHover={{ y: -2 }}
        aria-label={open ? "Close AI Guru chat" : "Open AI Guru chat"}
        className="fixed right-5 bottom-5 z-[60] grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg"
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="surface fixed right-4 bottom-24 z-[60] flex max-h-[70vh] w-[min(92vw,380px)] flex-col overflow-hidden p-0"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
                <Bot className="size-4" />
              </span>
              <div>
                <p className="text-sm font-bold">AI Guru chat</p>
                <p className="text-[11px] text-muted-foreground">Project queries, solved</p>
              </div>
            </div>

            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                      : "mr-auto max-w-[90%] rounded-2xl rounded-bl-sm bg-secondary px-3 py-2 text-sm whitespace-pre-wrap"
                  }
                >
                  {m.content}
                </motion.div>
              ))}
              {busy && (
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" /> Thinking…
                </p>
              )}
              {error && <p className="text-xs text-destructive">{error}</p>}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {starters.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-border px-3 py-1 text-[11px] transition-colors hover:bg-secondary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI Guru…"
                className="flex-1 rounded-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
