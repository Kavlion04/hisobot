"use client";

import { motion } from "framer-motion";

export function SkeletonCard({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="rounded-2xl bg-white/80 p-6 shadow-card ring-1 ring-ink-950/5 backdrop-blur-sm sm:p-7"
      aria-hidden
    >
      <div className="mb-5 h-5 w-4/5 max-w-md rounded-md skeleton-shimmer" />
      <div className="mb-6 h-4 w-2/3 max-w-sm rounded-md skeleton-shimmer" />
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-5 w-5 shrink-0 rounded-full skeleton-shimmer" />
            <div
              className="h-4 rounded-md skeleton-shimmer"
              style={{ width: `${55 + ((i * 17) % 30)}%` }}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function SurveySkeleton() {
  return (
    <div className="space-y-5" role="status" aria-label="Yuklanmoqda">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-hidden rounded-3xl bg-ink-950 shadow-card"
      >
        <div className="relative h-36 skeleton-shimmer opacity-40 sm:h-44" />
        <div className="space-y-3 bg-ink-950 px-6 pb-8 pt-5 sm:px-8">
          <div className="h-3 w-24 rounded skeleton-shimmer opacity-30" />
          <div className="h-8 w-3/4 max-w-lg rounded skeleton-shimmer opacity-40" />
          <div className="h-4 w-1/2 max-w-sm rounded skeleton-shimmer opacity-30" />
        </div>
      </motion.div>
      {[0, 1, 2].map((i) => (
        <SkeletonCard key={i} index={i} />
      ))}
      <p className="sr-only">So‘rovnoma yuklanmoqda…</p>
    </div>
  );
}
