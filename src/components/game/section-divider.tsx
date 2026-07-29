"use client";

import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "stamp" | "thread" | "file" | "evidence" | "achievement";
  label?: string;
}

const VARIANTS = {
  stamp: { glyph: "★", color: "text-noir-brass" },
  thread: { glyph: "✦", color: "text-noir-crimson" },
  file: { glyph: "§", color: "text-noir-brass" },
  evidence: { glyph: "🔍", color: "text-noir-brass" },
  achievement: { glyph: "✦", color: "text-noir-brass" },
};

export default function SectionDivider({
  variant = "stamp",
  label,
}: SectionDividerProps) {
  const v = VARIANTS[variant];
  return (
    <motion.div
      className="relative flex items-center justify-center gap-4 py-10 px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      aria-hidden="true"
    >
      {/* film-strip border decoration */}
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 8px, rgba(201,163,90,0.4) 8px, rgba(201,163,90,0.4) 10px, transparent 10px, transparent 18px)",
          maskImage:
            "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)",
        }}
      />

      {/* left line */}
      <div className="relative h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-noir-brass/50" />
      <span
        className={`relative text-xl ${v.color} drop-shadow-[0_0_8px_currentColor]`}
      >
        {v.glyph}
      </span>
      {label && (
        <span className="relative font-stamp text-[10px] sm:text-xs tracking-[0.4em] text-noir-brass/80 uppercase whitespace-nowrap font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
          {label}
        </span>
      )}
      <span
        className={`relative text-xl ${v.color} drop-shadow-[0_0_8px_currentColor]`}
      >
        {v.glyph}
      </span>
      {/* right line */}
      <div className="relative h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-noir-brass/50" />
    </motion.div>
  );
}
