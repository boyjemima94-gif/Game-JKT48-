"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  useGame,
  TOTAL_CLUE_COUNT,
  CULPRIT_ID,
  DIFFICULTIES,
  type CaseRecord,
} from "@/lib/game-store";
import { EVIDENCE_ITEMS } from "@/lib/game-store";
import { INTERROGATIONS } from "@/lib/interrogations";
import { SUSPECTS } from "@/lib/suspects";
import { checkAchievements, ACHIEVEMENTS, RARITY_META } from "@/lib/achievements";

/**
 * Detective Performance Score — appears after an accusation is made.
 * Rates the player on: accuracy, thoroughness, interrogation, timeline.
 * Shows a final rank (S/A/B/C/D) and breakdown stats.
 * Only renders when accusation !== null.
 */
export default function DetectiveScore() {
  const accusation = useGame((s) => s.accusation);
  const accusationResult = useGame((s) => s.accusationResult);
  const clues = useGame((s) => s.clues);
  const examinedEvidence = useGame((s) => s.examinedEvidence);
  const interrogatedSuspects = useGame((s) => s.interrogatedSuspects);
  const timelineSolved = useGame((s) => s.timelineSolved);
  const resetGame = useGame((s) => s.resetGame);
  const difficulty = useGame((s) => s.difficulty);
  const hintsUsed = useGame((s) => s.hintsUsed);

  const stats = useMemo(() => {
    const evidenceExamined = Object.keys(examinedEvidence).length;
    const totalEvidence = EVIDENCE_ITEMS.length;
    const suspectsInterrogated = Object.keys(interrogatedSuspects).length;
    const totalSuspects = SUSPECTS.length;
    const totalQuestions = Object.values(INTERROGATIONS).reduce(
      (sum, tree) => sum + tree.questions.length,
      0
    );

    // Thoroughness: how many clues found vs total
    const thoroughnessPct = Math.round((clues.length / TOTAL_CLUE_COUNT) * 100);
    // Evidence pct
    const evidencePct = Math.round((evidenceExamined / totalEvidence) * 100);
    // Interrogation pct
    const interrogationPct = Math.round(
      (suspectsInterrogated / totalSuspects) * 100
    );
    // Timeline: solved = 100, else 0
    const timelinePct = timelineSolved ? 100 : 0;

    // Accuracy: correct accusation = 100, wrong = based on how many clues pointed to culprit
    const accuracyPct =
      accusationResult === "correct"
        ? 100
        : Math.round(
            (clues.filter((c) => c.suspectId === CULPRIT_ID).length / 5) * 100
          );

    // Overall score (weighted) — base
    const baseScore =
      accuracyPct * 0.35 +
      thoroughnessPct * 0.25 +
      interrogationPct * 0.2 +
      timelinePct * 0.1 +
      evidencePct * 0.1;

    // Apply difficulty multiplier + hint penalty
    const diffConfig = difficulty ? DIFFICULTIES[difficulty] : null;
    const multiplier = diffConfig ? diffConfig.scoreMultiplier : 1.0;
    const hintPenalty = hintsUsed * (diffConfig ? diffConfig.hintCost : 0);
    const overall = Math.max(
      0,
      Math.round(baseScore * multiplier - hintPenalty)
    );

    // Rank
    let rank = "D";
    let rankColor = "text-noir-crimson";
    let rankLabel = "Magang";
    if (overall >= 90) {
      rank = "S";
      rankColor = "text-noir-brass";
      rankLabel = "Detektif Legendaris";
    } else if (overall >= 75) {
      rank = "A";
      rankColor = "text-noir-tungsten";
      rankLabel = "Detektif Senior";
    } else if (overall >= 60) {
      rank = "B";
      rankColor = "text-green-400";
      rankLabel = "Detektif Kompeten";
    } else if (overall >= 40) {
      rank = "C";
      rankColor = "text-orange-400";
      rankLabel = "Detektif Pemula";
    }

    return {
      evidenceExamined,
      totalEvidence,
      suspectsInterrogated,
      totalSuspects,
      totalQuestions,
      thoroughnessPct,
      evidencePct,
      interrogationPct,
      timelinePct,
      accuracyPct,
      overall,
      rank,
      rankColor,
      rankLabel,
    };
  }, [
    examinedEvidence,
    interrogatedSuspects,
    clues,
    timelineSolved,
    accusationResult,
    difficulty,
    hintsUsed,
  ]);

  const recordCase = useGame((s) => s.recordCase);
  const caseHistory = useGame((s) => s.caseHistory);
  const unlockAchievements = useGame((s) => s.unlockAchievements);
  const unlockedAchievements = useGame((s) => s.unlockedAchievements);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const recordedRef = useRef<string | null>(null);

  // Record this case into history once (when accusation is made)
  useEffect(() => {
    if (!accusation || !difficulty) return;
    // generate a unique key for this accusation to avoid double-recording
    const key = `${accusation}-${stats.overall}-${clues.length}`;
    if (recordedRef.current === key) return;
    // check if already in history (same accusation + score + time proximity)
    const recent = caseHistory[0];
    if (
      recent &&
      recent.accusedId === accusation &&
      recent.score === stats.overall &&
      Date.now() - recent.date < 5000
    ) {
      recordedRef.current = key;
      return;
    }
    const rec: CaseRecord = {
      id: `case-${Date.now()}`,
      date: Date.now(),
      difficulty,
      accusedId: accusation,
      correct: accusationResult === "correct",
      score: stats.overall,
      rank: stats.rank,
      cluesFound: clues.length,
      totalClues: TOTAL_CLUE_COUNT,
      hintsUsed,
      timelineSolved,
      suspectsInterrogated: Object.keys(interrogatedSuspects).length,
    };
    recordCase(rec);
    recordedRef.current = key;

    // Check achievements
    const wins = caseHistory.filter((c) => c.correct).length + (rec.correct ? 1 : 0);
    const perfectAccusations =
      caseHistory.filter((c) => c.correct && c.hintsUsed === 0).length +
      (rec.correct && rec.hintsUsed === 0 ? 1 : 0);
    const ctx = {
      correct: rec.correct,
      score: rec.score,
      rank: rec.rank,
      difficulty: rec.difficulty,
      cluesFound: rec.cluesFound,
      totalClues: rec.totalClues,
      hintsUsed: rec.hintsUsed,
      timelineSolved: rec.timelineSolved,
      suspectsInterrogated: rec.suspectsInterrogated,
      totalSuspects: 4,
      casesPlayed: caseHistory.length + 1,
      wins,
      perfectAccusations,
    };
    const newlyUnlocked = checkAchievements(ctx, unlockedAchievements);
    if (newlyUnlocked.length > 0) {
      unlockAchievements(newlyUnlocked);
      requestAnimationFrame(() => setNewAchievements(newlyUnlocked));
    }
  }, [
    accusation,
    difficulty,
    stats.overall,
    stats.rank,
    clues.length,
    hintsUsed,
    timelineSolved,
    interrogatedSuspects,
    accusationResult,
    recordCase,
    unlockAchievements,
    caseHistory,
    unlockedAchievements,
    TOTAL_CLUE_COUNT,
  ]);

  if (!accusation) return null;

  const isWin = accusationResult === "correct";

  const statBars = [
    {
      label: "Akurasi Tuduhan",
      pct: stats.accuracyPct,
      icon: "⚖",
      color: isWin ? "from-green-600 to-green-400" : "from-noir-crimson to-orange-500",
    },
    {
      label: "Kelengkapan Bukti",
      pct: stats.thoroughnessPct,
      icon: "🔍",
      color: "from-noir-brass to-noir-tungsten",
    },
    {
      label: "Interogasi",
      pct: stats.interrogationPct,
      icon: "🗣️",
      color: "from-purple-600 to-purple-400",
    },
    {
      label: "Linimasa",
      pct: stats.timelinePct,
      icon: "🕐",
      color: "from-cyan-600 to-cyan-400",
    },
  ];

  return (
    <section
      className="relative py-16 sm:py-20 px-4 sm:px-6"
      aria-label="Skor Detektif"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-3xl mx-auto"
      >
        {/* header */}
        <div className="text-center mb-10">
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold">
            · Penilaian Akhir ·
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3"
            style={{
              textShadow:
                "0 0 24px rgba(201,163,90,0.3), 0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            LAPORAN DETEKTIF
          </h2>
        </div>

        {/* rank card */}
        <div
          className={`relative paper-texture paper-edge paper-burn p-6 sm:p-8 mb-6 border-4 ${
            isWin ? "border-green-700" : "border-noir-crimson"
          }`}
        >
          {/* rank stamp */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: -8 }}
              transition={{ type: "spring", damping: 12, delay: 0.5 }}
              className="shrink-0 relative"
            >
              <div
                className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 ${
                  isWin ? "border-green-700" : "border-noir-crimson"
                } flex items-center justify-center stamp-texture`}
                style={{
                  boxShadow: `0 0 30px ${
                    isWin ? "rgba(34,197,94,0.4)" : "rgba(192,57,43,0.4)"
                  }`,
                }}
              >
                <div className="text-center">
                  <p className="font-stamp text-[9px] tracking-[0.3em] text-noir-paper-ink/60 font-bold">
                    PANGKAT
                  </p>
                  <p
                    className={`font-stamp text-5xl sm:text-6xl font-black ${stats.rankColor}`}
                    style={{ lineHeight: 1 }}
                  >
                    {stats.rank}
                  </p>
                </div>
              </div>
              {/* inner ring */}
              <div
                className={`absolute inset-2 rounded-full border-2 ${
                  isWin ? "border-green-700/40" : "border-noir-crimson/40"
                } pointer-events-none`}
              />
            </motion.div>

            <div className="flex-1 text-center sm:text-left">
              <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-paper-ink/60 uppercase">
                Pangkat Detektif
              </p>
              <h3
                className={`font-stamp text-2xl sm:text-3xl font-black ${stats.rankColor} mb-1`}
              >
                {stats.rankLabel}
              </h3>
              <p className="font-typewriter text-sm text-noir-paper-ink/80 mb-3">
                Skor keseluruhan:{" "}
                <span className="font-bold text-noir-paper-ink">
                  {stats.overall}
                </span>
                /100
                {difficulty && (
                  <span className="ml-2 text-[11px] text-noir-paper-ink/60">
                    (Mode: {DIFFICULTIES[difficulty].label} ×{DIFFICULTIES[difficulty].scoreMultiplier}
                    {hintsUsed > 0
                      ? ` −${hintsUsed}×${DIFFICULTIES[difficulty].hintCost}`
                      : ""}
                    )
                  </span>
                )}
              </p>
              <p className="font-typewriter text-[11px] text-noir-paper-ink/60 italic">
                {isWin
                  ? "Kau telah memecahkan kasus JKT-48-001. Teatro del Misteri berutang budi padamu."
                  : "Keadilan tertundin, tapi penyelidikanmu tidak sia-sia. Kasus ini menjadi arsip dingin."}
              </p>
            </div>
          </div>
        </div>

        {/* stat bars */}
        <div className="paper-texture paper-edge p-5 sm:p-6 mb-6 space-y-4">
          <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-crimson font-bold uppercase mb-3 pb-2 border-b border-noir-paper-ink/20">
            Rincian Penilaian
          </p>
          {statBars.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-typewriter text-xs text-noir-paper-ink/80 flex items-center gap-2">
                  <span className="text-base">{stat.icon}</span>
                  {stat.label}
                </span>
                <span className="font-stamp text-sm font-bold text-noir-paper-ink">
                  {stat.pct}%
                </span>
              </div>
              <div className="h-2.5 bg-noir-paper-ink/15 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.7 + i * 0.1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            {
              label: "Bukti Diperiksa",
              value: `${stats.evidenceExamined}/${stats.totalEvidence}`,
              icon: "🔍",
            },
            {
              label: "Tersangka Diinterogasi",
              value: `${stats.suspectsInterrogated}/${stats.totalSuspects}`,
              icon: "🗣️",
            },
            {
              label: "Petunjuk Terkumpul",
              value: `${clues.length}/${TOTAL_CLUE_COUNT}`,
              icon: "📓",
            },
            {
              label: "Linimasa",
              value: stats.timelinePct === 100 ? "✓" : "✗",
              icon: "🕐",
            },
            {
              label: "Mode",
              value: difficulty ? DIFFICULTIES[difficulty].label : "—",
              icon: difficulty ? DIFFICULTIES[difficulty].icon : "🎮",
            },
            {
              label: "Petunjuk Dipakai",
              value: `${hintsUsed}`,
              icon: "💡",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.08 }}
              className="paper-texture paper-edge p-3 text-center"
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="font-stamp text-lg font-black text-noir-paper-ink">
                {s.value}
              </p>
              <p className="font-typewriter text-[9px] tracking-widest text-noir-paper-ink/60 uppercase">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* verdict badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3 }}
          className={`text-center p-4 border-2 ${
            isWin
              ? "border-green-700 bg-green-700/10"
              : "border-noir-crimson bg-noir-crimson/10"
          } mb-6`}
        >
          <p
            className={`font-stamp text-xl font-black ${
              isWin ? "text-green-700" : "text-noir-crimson"
            }`}
          >
            {isWin ? "★ KASUS TERPECAHKAN ★" : "✖ KASUS TERTUNDIN"}
          </p>
          <p className="font-typewriter text-[11px] text-noir-paper-ink/70 mt-1">
            Kasus JKT-48-001 · {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </motion.div>

        {/* newly unlocked achievements */}
        {newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mb-6 paper-texture paper-edge p-5 border-4 border-noir-brass"
          >
            <p className="font-stamp text-sm tracking-[0.3em] text-noir-brass font-bold uppercase text-center mb-3">
              ✦ Pencapaian Baru Terbuka ✦
            </p>
            <div className="space-y-2">
              {newAchievements.map((id) => {
                const ach = ACHIEVEMENTS.find((a) => a.id === id);
                if (!ach) return null;
                const rarity = RARITY_META[ach.rarity];
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8 }}
                    className={`flex items-center gap-3 p-3 border-2 ${rarity.border} bg-noir-paper/30`}
                    style={{ boxShadow: `0 0 20px ${rarity.glow}` }}
                  >
                    <span className="text-3xl">{ach.glyph}</span>
                    <div className="flex-1">
                      <p className={`font-stamp text-sm font-black ${rarity.color}`}>
                        {ach.title}
                      </p>
                      <p className="font-typewriter text-[11px] text-noir-paper-ink/70">
                        {ach.description}
                      </p>
                    </div>
                    <span
                      className={`font-stamp text-[9px] tracking-widest font-bold px-2 py-0.5 border ${rarity.border} ${rarity.color}`}
                    >
                      {rarity.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              resetGame();
            }}
            data-cursor-active
            className="px-6 py-3 font-stamp text-xs tracking-[0.2em] uppercase text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-colors shadow-md"
          >
            ↻ MAIN LAGI
          </button>
          <a
            href="#hero"
            data-cursor-active
            className="px-6 py-3 font-stamp text-xs tracking-[0.2em] uppercase text-noir-paper border border-noir-brass/40 hover:border-noir-brass hover:bg-noir-brass/10 transition-all"
          >
            ↑ KEMBALI KE ATAS
          </a>
        </div>
      </motion.div>
    </section>
  );
}
