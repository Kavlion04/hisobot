"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Question } from "@/lib/types";

type Props = {
  question: Question;
  index: number;
  value: string | string[] | undefined;
  otherText?: string;
  onChange: (value: string | string[]) => void;
  onOtherChange?: (text: string) => void;
  error?: string;
};

export function QuestionCard({
  question,
  index,
  value,
  otherText = "",
  onChange,
  onOtherChange,
  error,
}: Props) {
  const selected = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

  const textValue = typeof value === "string" ? value : "";

  const toggleMultiple = (optionId: string) => {
    const set = new Set(selected.filter((s) => !s.startsWith("other:")));
    if (set.has(optionId)) set.delete(optionId);
    else set.add(optionId);
    const next = [...set];
    if (otherText.trim()) next.push(`other:${otherText.trim()}`);
    onChange(next);
  };

  const selectSingle = (optionId: string) => {
    onChange(optionId);
  };

  const isChecked = (optionId: string) => selected.includes(optionId);

  const isInput = question.type === "text" || question.type === "number";

  const hint =
    question.hint ??
    (question.type === "multiple"
      ? "Bir nechtasini tanlash mumkin"
      : isInput
        ? "Javobingizni yozing"
        : "Bitta javob tanlang");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        delay: 0.05 + index * 0.05,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="card-glow"
    >
      <article className="card-glow__inner p-6 sm:p-7">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-60"
        aria-hidden
      />

      <div className="mb-5 flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink-950 text-[11px] font-semibold tracking-wide text-sand-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h2 className="font-display text-lg leading-snug tracking-tight text-ink-950 sm:text-xl">
            {question.title}
            {question.required && (
              <span className="ml-1 text-accent" aria-hidden>
                *
              </span>
            )}
          </h2>
          <p className="mt-1 text-xs text-ink-400">{hint}</p>
        </div>
      </div>

      {isInput ? (
        question.id === "phone" ? (
          <div className="flex overflow-hidden rounded-xl border border-ink-100 bg-sand-muted/50 transition focus-within:border-accent/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-accent/20">
            <span className="flex shrink-0 items-center border-r border-ink-100 bg-ink-950/5 px-3.5 text-[15px] font-semibold tabular-nums text-ink-800">
              +998
            </span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={textValue
                .replace(/^\+?998\s?/, "")
                .replace(/[^\d\s]/g, "")}
              onChange={(e) => {
                const digits = e.target.value.replace(/[^\d]/g, "").slice(0, 9);
                const formatted =
                  digits.length <= 2
                    ? digits
                    : digits.length <= 5
                      ? `${digits.slice(0, 2)} ${digits.slice(2)}`
                      : digits.length <= 7
                        ? `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`
                        : `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
                onChange(digits ? `+998 ${formatted}` : "");
              }}
              placeholder={question.placeholder}
              className="min-w-0 flex-1 bg-transparent px-3.5 py-3.5 text-[15px] text-ink-900 outline-none placeholder:text-ink-300"
            />
          </div>
        ) : (
          <div>
            <input
              type={question.type === "number" ? "number" : "text"}
              inputMode={question.type === "number" ? "numeric" : undefined}
              min={question.type === "number" ? 10 : undefined}
              max={question.type === "number" ? 80 : undefined}
              value={textValue}
              onChange={(e) => onChange(e.target.value)}
              placeholder={question.placeholder}
              className="w-full rounded-xl border border-ink-100 bg-sand-muted/50 px-4 py-3.5 text-[15px] text-ink-900 outline-none transition placeholder:text-ink-300 focus:border-accent/50 focus:bg-white focus:ring-2 focus:ring-accent/20"
            />
          </div>
        )
      ) : (
        <ul className="space-y-2" role="list">
          {(question.options ?? []).map((opt) => {
            const checked = isChecked(opt.id);
            const isMulti = question.type === "multiple";

            return (
              <li key={opt.id}>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.985 }}
                  onClick={() =>
                    isMulti ? toggleMultiple(opt.id) : selectSingle(opt.id)
                  }
                  className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-200 ${
                    checked
                      ? "border-accent/40 bg-accent/5 shadow-[inset_0_0_0_1px_rgba(13,148,136,0.12)]"
                      : "border-ink-100 bg-sand-muted/40 hover:border-ink-200 hover:bg-white"
                  }`}
                  aria-pressed={checked}
                >
                  <span
                    className={`relative flex h-[18px] w-[18px] shrink-0 items-center justify-center border-2 transition-colors ${
                      isMulti ? "rounded-[5px]" : "rounded-full"
                    } ${
                      checked
                        ? "border-accent bg-accent"
                        : "border-ink-300 bg-white"
                    }`}
                  >
                    <AnimatePresence>
                      {checked && (
                        <motion.span
                          key="mark"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 28,
                          }}
                          className="text-white"
                        >
                          {isMulti ? (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                            >
                              <path
                                d="M1.5 5.2L3.8 7.5L8.5 2.5"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  <span className="text-[15px] text-ink-800">{opt.label}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      )}

      {question.allowOther && (
        <div className="mt-3">
          <label className="block text-xs font-medium text-ink-400">
            Boshqa (yozing)
          </label>
          <input
            type="text"
            value={otherText}
            onChange={(e) => {
              const t = e.target.value;
              onOtherChange?.(t);
              if (question.type === "multiple") {
                const base = selected.filter((s) => !s.startsWith("other:"));
                onChange(t.trim() ? [...base, `other:${t.trim()}`] : base);
              }
            }}
            placeholder="Javobingizni yozing…"
            className="mt-1.5 w-full rounded-xl border border-ink-100 bg-sand-muted/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-accent/50 focus:bg-white focus:ring-2 focus:ring-accent/20"
          />
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      </article>
    </motion.div>
  );
}
