"use client";

import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { questions, SURVEY_SUBTITLE, SURVEY_TITLE } from "@/lib/questions";
import type { SurveyAnswers } from "@/lib/types";
import { QuestionCard } from "./QuestionCard";
import { SurveySkeleton } from "./SkeletonCard";

type Status = "loading" | "ready" | "submitting" | "success" | "error";

export function SurveyForm() {
  const [status, setStatus] = useState<Status>("loading");
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statsCount, setStatsCount] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (!cancelled) {
          setStatsCount(data.count ?? 0);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("ready");
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const setAnswer = (id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    for (const q of questions) {
      if (!q.required) continue;
      const v = answers[q.id];
      const empty =
        v == null ||
        (typeof v === "string" && !v.trim()) ||
        (Array.isArray(v) && v.length === 0);
      if (empty) {
        next[q.id] =
          q.type === "text" || q.type === "number"
            ? "Iltimos, maydonni to‘ldiring"
            : "Iltimos, javob tanlang";
        continue;
      }
      if (q.type === "number" && typeof v === "string") {
        const n = Number(v);
        if (!Number.isFinite(n) || n < 10 || n > 80) {
          next[q.id] = "Yosh 10–80 oralig‘ida bo‘lishi kerak";
        }
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setMessage("Ba’zi majburiy savollar to‘ldirilmagan");
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xatolik");
      startTransition(() => {
        setStatus("success");
        setStatsCount((c) => (c == null ? 1 : c + 1));
      });
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Yuborishda xatolik");
    }
  };

  if (status === "loading") {
    return <SurveySkeleton />;
  }

  return (
    <div className="relative z-10">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="overflow-hidden rounded-3xl bg-ink-950 p-8 text-center text-sand-muted shadow-card sm:p-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 16, delay: 0.1 }}
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl text-white"
            >
              ✓
            </motion.div>
            <h2 className="font-display text-2xl text-white sm:text-3xl">
              Rahmat!
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-300">
              Javobingiz saqlandi. Telegram botga bildirishnoma yuborildi —
              hisobot bo‘limida barcha natijalarni ko‘rish mumkin.
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setAnswers({});
                setOtherTexts({});
                setErrors({});
                setStatus("ready");
              }}
              className="mt-8 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-soft"
            >
              Yana bir marta to‘ldirish
            </motion.button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-3xl bg-ink-950 text-white shadow-card"
            >
              <div
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, rgba(45,212,191,0.35), transparent 40%), radial-gradient(circle at 80% 20%, rgba(13,148,136,0.4), transparent 35%), linear-gradient(135deg, #0f1720 0%, #1a2e32 50%, #0d1a1c 100%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />
              <div className="relative px-6 pb-8 pt-8 sm:px-10 sm:pb-10 sm:pt-10">
                <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-accent-glow/90">
                  <span>So‘rovnoma</span>
                  {statsCount != null && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 normal-case tracking-normal text-ink-200">
                      {statsCount} ta javob
                    </span>
                  )}
                </div>
                <h1 className="max-w-2xl font-display text-3xl leading-[1.15] tracking-tight text-balance sm:text-4xl md:text-[2.75rem]">
                  {SURVEY_TITLE}
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-300 sm:text-base">
                  {SURVEY_SUBTITLE}
                </p>
              </div>
            </motion.header>

            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                value={answers[q.id]}
                otherText={otherTexts[q.id] ?? ""}
                onChange={(v) => setAnswer(q.id, v)}
                onOtherChange={(t) =>
                  setOtherTexts((prev) => ({ ...prev, [q.id]: t }))
                }
                error={errors[q.id]}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="sticky bottom-4 z-20"
            >
              <div className="flex flex-col gap-3 rounded-2xl border border-ink-100/80 bg-white/90 p-4 shadow-card backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-sm text-ink-500">
                  {message ? (
                    <span className="text-red-600">{message}</span>
                  ) : (
                    "Javoblar Telegram botga yuboriladi"
                  )}
                </p>
                <motion.button
                  type="submit"
                  disabled={status === "submitting"}
                  whileHover={{ scale: status === "submitting" ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative inline-flex min-w-[160px] items-center justify-center overflow-hidden rounded-xl bg-ink-950 px-6 py-3 text-sm font-medium text-white disabled:opacity-70"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {status === "submitting" ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-2"
                      >
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Yuborilmoqda…
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                      >
                        Yuborish
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
