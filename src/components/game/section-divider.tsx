"use client";

import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "stamp" | "thread" | "file" | "evidence";
  label?: string;
}

const VARIANTS = {
  stamp: { glyph: "★", color: "text-noir-brass" },
  thread: { glyph: "✦", color: "text-noir-crimson" },
  file: { glyph: "§", color: "text-noir-brass" },
  evidence: { glyph: "🔍", color: "text-noir-brass" },
};

export default function SectionDivider({
  variant = "stamp",
  label,
}: SectionDividerProps) {
  const v = VARIANTS[variant];
  return (
    <motion.div
      className="flex items-center justify-center gap-4 py-8 px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      aria-hidden="true"
    >
      <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-noir-brass/40" />
      <span className={`text-xl ${v.color}`}>{v.glyph}</span>
      {label && (
        <span className="font-stamp text-[10px] sm:text-xs tracking-[0.4em] text-noir-brass/70 uppercase whitespace-nowrap">
          {label}
        </span>
      )}
      <span className={`text-xl ${v.color}`}>{v.glyph}</span>
      <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-noir-brass/40" />
    </motion.div>
  );
}
