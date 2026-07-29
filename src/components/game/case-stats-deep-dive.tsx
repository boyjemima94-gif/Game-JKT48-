"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useGame, TOTAL_CLUE_COUNT } from "@/lib/game-store";

/**
 * Case Statistics Deep Dive — expanded analytics beyond the basic summary.
 * Shows: clue discovery rate, interrogation efficiency, hint usage patterns,
 * timeline completion rate, difficulty distribution.
 * Only renders when case history exists.
 */
export default function CaseStatsDeepDive() {
  const caseHistory = useGame((s) => s.caseHistory);

  const analytics = useMemo(() => {
    if (caseHistory.length === 0) return null;
    const total = caseHistory.length;
    const wins = caseHistory.filter((c) => c.correct);
    const losses = caseHistory.filter((c) => !c.correct);

    const avgClues = Math.round(
      caseHistory.reduce((s, c) => s + c.cluesFound, 0) / total
    );
    const clueDiscoveryRate = Math.round((avgClues / TOTAL_CLUE_COUNT) * 100);

    const avgHints = (
      caseHistory.reduce((s, c) => s + c.hintsUsed, 0) / total
    ).toFixed(1);

    const timelineRate = Math.round(
      (caseHistory.filter((c) => c.timelineSolved).length / total) * 100
    );

    const avgSuspects = Math.round(
      (caseHistory.reduce((s, c) => s + c.suspectsInterrogated, 0) / total)
    );

    const noHintWins = wins.filter((c) => c.hintsUsed === 0).length;

    // difficulty distribution
    const diffCounts: Record<string, number> = {};
    caseHistory.forEach((c) => {
      diffCounts[c.difficulty] = (diffCounts[c.difficulty] ?? 0) + 1;
    });

    // avg score by difficulty
    const avgScoreByDiff: Record<string, number> = {};
    Object.keys(diffCounts).forEach((d) => {
      const cases = caseHistory.filter((c) => c.difficulty === d);
      avgScoreByDiff[d] = Math.round(
        cases.reduce((s, c) => s + c.score, 0) / cases.length
      );
    });

    return {
      total,
      wins: wins.length,
      losses: losses.length,
      avgClues,
      clueDiscoveryRate,
      avgHints,
      timelineRate,
      avgSuspects,
      noHintWins,
      diffCounts,
      avgScoreByDiff,
    };
  }, [caseHistory]);

  if (!analytics) return null;

  const statCards = [
    {
      label: "Rata-rata Petunjuk",
      value: `${analytics.avgClues}/${TOTAL_CLUE_COUNT}`,
      sub: `${analytics.clueDiscoveryRate}% penemuan`,
      icon: "🔍",
      color: "text-noir-brass",
    },
    {
      label: "Rata-rata Hint",
      value: analytics.avgHints,
      sub: analytics.noHintWins > 0 ? `${analytics.noHintWins} tanpa hint` : "—",
      icon: "💡",
      color: "text-orange-400",
    },
    {
      label: "Linimasa Selesai",
      value: `${analytics.timelineRate}%`,
      sub: `${caseHistory.filter((c) => c.timelineSolved).length}/${analytics.total} kasus`,
      icon: "🕐",
      color: "text-cyan-400",
    },
    {
      label: "Rata-rata Interogasi",
      value: `${analytics.avgSuspects}/4`,
      sub: "tersangka per kasus",
      icon: "🗣️",
      color: "text-purple-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-crimson font-bold uppercase mb-3">
        ◆ Analisis Mendalam
      </p>

      {/* stat cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="paper-texture paper-edge p-3 text-center"
          >
            <div className="text-xl mb-0.5">{s.icon}</div>
            <p className={`font-stamp text-lg font-black ${s.color}`}>
              {s.value}
            </p>
            <p className="font-typewriter text-[9px] tracking-widest text-noir-paper-ink/60 uppercase">
              {s.label}
            </p>
            <p className="font-typewriter text-[8px] text-noir-paper-ink/40 mt-0.5">
              {s.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* difficulty breakdown */}
      <div className="paper-texture paper-edge p-4">
        <p className="font-stamp text-[9px] tracking-widest text-noir-brass font-bold uppercase mb-3 pb-1.5 border-b border-noir-paper-ink/15">
          Distribusi per Mode
        </p>
        <div className="space-y-2">
          {(["pemula", "detektif", "legendaris"] as const).map((d) => {
            const count = analytics.diffCounts[d] ?? 0;
            const pct =
              analytics.total > 0
                ? Math.round((count / analytics.total) * 100)
                : 0;
            const avgScore = analytics.avgScoreByDiff[d] ?? 0;
            const labels: Record<string, string> = {
              pemula: "Pemula 🌱",
              detektif: "Detektif 🔍",
              legendaris: "Legendaris ★",
            };
            return (
              <div key={d} className="flex items-center gap-3 text-[11px]">
                <span className="font-stamp text-noir-paper-ink/80 w-28 shrink-0">
                  {labels[d]}
                </span>
                <div className="flex-1 h-4 bg-noir-paper-ink/10 rounded-sm overflow-hidden relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-noir-umber to-noir-brass"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-stamp text-[10px] font-bold text-noir-ink">
                    {count > 0 ? `${count} kasus` : ""}
                  </span>
                </div>
                <span className="font-stamp text-noir-paper-ink/70 w-16 text-right shrink-0">
                  {count > 0 ? `avg ${avgScore}` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
