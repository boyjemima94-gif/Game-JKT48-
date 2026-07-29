"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useGame, DIFFICULTIES } from "@/lib/game-store";

const RANKS = [
  { letter: "D", label: "Magang", min: 0, color: "text-noir-crimson", border: "border-noir-crimson" },
  { letter: "C", label: "Pemula", min: 40, color: "text-orange-400", border: "border-orange-500" },
  { letter: "B", label: "Kompeten", min: 60, color: "text-green-400", border: "border-green-500" },
  { letter: "A", label: "Senior", min: 75, color: "text-noir-tungsten", border: "border-noir-tungsten" },
  { letter: "S", label: "Legendaris", min: 90, color: "text-noir-brass", border: "border-noir-brass" },
];

/**
 * Detective Rank Progression — visual rank ladder showing the player's
 * current rank based on best score, with progress to next rank.
 * Renders in the Case Archive area (only shows when cases exist).
 */
export default function RankProgression() {
  const caseHistory = useGame((s) => s.caseHistory);

  const { bestScore, currentRank, nextRank, progressPct } = useMemo(() => {
    if (caseHistory.length === 0) {
      return {
        bestScore: 0,
        currentRank: RANKS[0],
        nextRank: RANKS[1],
        progressPct: 0,
      };
    }
    const best = Math.max(...caseHistory.map((c) => c.score));
    let current = RANKS[0];
    let next: typeof RANKS[0] | null = null;
    for (let i = 0; i < RANKS.length; i++) {
      if (best >= RANKS[i].min) {
        current = RANKS[i];
        next = RANKS[i + 1] ?? null;
      }
    }
    let pct = 100;
    if (next) {
      pct = Math.round(
        ((best - current.min) / (next.min - current.min)) * 100
      );
    }
    return {
      bestScore: best,
      currentRank: current,
      nextRank: next,
      progressPct: Math.max(0, Math.min(100, pct)),
    };
  }, [caseHistory]);

  if (caseHistory.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="paper-texture paper-edge p-5 sm:p-6 mb-6"
    >
      <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-crimson font-bold uppercase mb-4 pb-2 border-b border-noir-paper-ink/20">
        ◆ Tangga Pangkat Detektif
      </p>

      {/* current rank + progress */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className={`shrink-0 w-16 h-16 rounded-full border-4 ${currentRank.border} flex items-center justify-center stamp-texture`}
          style={{ boxShadow: "0 0 20px rgba(0,0,0,0.3)" }}
        >
          <span
            className={`font-stamp text-3xl font-black ${currentRank.color}`}
          >
            {currentRank.letter}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-stamp text-sm font-black text-noir-paper-ink">
            Pangkat Saat Ini: {currentRank.label}
          </p>
          <p className="font-typewriter text-[11px] text-noir-paper-ink/60 mb-2">
            Skor terbaik: {bestScore}/100
          </p>
          {nextRank ? (
            <>
              <div className="flex items-center justify-between mb-1">
                <span className="font-typewriter text-[10px] text-noir-paper-ink/60">
                  Menuju: {nextRank.label} ({nextRank.letter})
                </span>
                <span className="font-stamp text-[10px] font-bold text-noir-paper-ink">
                  {progressPct}%
                </span>
              </div>
              <div className="h-2 bg-noir-paper-ink/15 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r from-noir-crimson to-noir-brass rounded-full`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progressPct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <p className="font-typewriter text-[9px] text-noir-paper-ink/50 mt-1">
                Butuh {nextRank.min - bestScore} poin lagi untuk naik pangkat
              </p>
            </>
          ) : (
            <p className="font-stamp text-xs font-bold text-noir-brass">
              ★ Pangkat tertinggi tercapai!
            </p>
          )}
        </div>
      </div>

      {/* rank ladder */}
      <div className="grid grid-cols-5 gap-2">
        {RANKS.map((rank, i) => {
          const achieved = bestScore >= rank.min;
          const isCurrent = currentRank.letter === rank.letter;
          return (
            <motion.div
              key={rank.letter}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative p-2 border-2 text-center transition-all ${
                achieved
                  ? `${rank.border} ${isCurrent ? "bg-noir-brass/10" : ""}`
                  : "border-noir-paper-ink/15 opacity-40"
              }`}
              style={
                isCurrent
                  ? { boxShadow: "0 0 12px rgba(201,163,90,0.3)" }
                  : {}
              }
            >
              <p
                className={`font-stamp text-xl font-black ${
                  achieved ? rank.color : "text-noir-paper-ink/40"
                }`}
              >
                {rank.letter}
              </p>
              <p className="font-typewriter text-[8px] tracking-widest text-noir-paper-ink/60 uppercase leading-tight mt-0.5">
                {rank.label}
              </p>
              <p className="font-typewriter text-[8px] text-noir-paper-ink/40 mt-0.5">
                {rank.min}+
              </p>
              {isCurrent && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1 py-0.5 bg-noir-brass text-noir-ink font-stamp text-[7px] font-bold tracking-widest">
                  SAAT INI
                </div>
              )}
              {achieved && !isCurrent && (
                <span className="absolute top-1 right-1 text-[8px] text-green-600 font-bold">
                  ✓
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
