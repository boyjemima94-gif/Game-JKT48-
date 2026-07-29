"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/lib/game-store";
import { getDailyChallenge, isDailyCompleted } from "@/lib/daily-challenge";
import { playClick, playStampSlam } from "@/lib/audio";

/**
 * Daily Challenge — a special daily variant with deterministic modifiers.
 * Shows today's modifiers + bonus multiplier + completion status.
 * Offers a "start daily" button that sets difficulty to a special daily mode.
 */
export default function DailyChallengeSection() {
  const caseHistory = useGame((s) => s.caseHistory);
  const setDifficulty = useGame((s) => s.setDifficulty);
  const difficulty = useGame((s) => s.difficulty);
  const [showDetail, setShowDetail] = useState(false);

  const daily = useMemo(() => getDailyChallenge(), []);
  const completed = useMemo(
    () => isDailyCompleted(caseHistory, daily.dateKey),
    [caseHistory, daily.dateKey]
  );

  const today = new Date();
  const dateStr = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleStartDaily = () => {
    playClick();
    setTimeout(() => playStampSlam(), 150);
    // Set difficulty to "legendaris" as base for daily (hardest base)
    // The daily modifiers layer on top
    setDifficulty("legendaris");
    // Scroll to briefing to start
    document.getElementById("berkas")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="tantangan-harian"
      className="relative py-16 sm:py-20 px-4 sm:px-6"
      aria-label="Tantangan Harian"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative overflow-hidden border-4 ${
            completed
              ? "border-green-700"
              : "border-noir-brass"
          } paper-texture paper-edge paper-burn p-5 sm:p-7`}
        >
          {/* corner ribbon */}
          <div className="absolute -top-1 -right-1 px-3 py-1 bg-noir-crimson text-noir-paper font-stamp text-[9px] tracking-widest font-bold rotate-3 shadow-lg">
            ★ HARIAN
          </div>

          {/* header */}
          <div className="flex items-start gap-4 mb-4">
            <span className="text-4xl sm:text-5xl">🎲</span>
            <div className="flex-1">
              <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-crimson font-bold uppercase">
                Tantangan Harian
              </p>
              <h3 className="font-stamp text-xl sm:text-2xl font-black text-noir-paper-ink leading-tight">
                {dateStr}
              </h3>
            </div>
            {completed && (
              <span className="px-2 py-1 border-2 border-green-700 text-green-700 font-stamp text-[9px] tracking-widest font-bold">
                ✓ SELESAI
              </span>
            )}
          </div>

          {/* modifiers */}
          <div className="space-y-2 mb-4">
            <p className="font-stamp text-[10px] tracking-widest text-noir-brass font-bold uppercase">
              ◆ Modifier Hari Ini:
            </p>
            {daily.modifiers.map((mod) => (
              <div
                key={mod.id}
                className="flex items-start gap-3 p-2.5 border border-noir-paper-ink/20 bg-noir-paper/30"
              >
                <span className="text-2xl shrink-0">{mod.glyph}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-stamp text-xs font-bold text-noir-paper-ink">
                    {mod.title}{" "}
                    <span className="text-green-700 text-[10px]">
                      +{Math.round(mod.scoreBonus * 100)}%
                    </span>
                  </p>
                  <p className="font-typewriter text-[10px] text-noir-paper-ink/70 leading-snug">
                    {mod.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* bonus multiplier */}
          <div className="text-center p-3 border-2 border-noir-brass bg-noir-brass/10 mb-4">
            <p className="font-stamp text-[10px] tracking-widest text-noir-brass font-bold uppercase">
              Pengali Skor Bonus
            </p>
            <p className="font-stamp text-3xl font-black text-noir-brass">
              ×{daily.bonusMultiplier.toFixed(2)}
            </p>
          </div>

          {/* actions */}
          {!completed ? (
            <button
              onClick={handleStartDaily}
              data-cursor-active
              disabled={!!difficulty && !accusationCleared(difficulty)}
              className="w-full py-3 font-stamp text-xs tracking-widest uppercase text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-colors shadow-md disabled:opacity-50"
            >
              🎲 Mulai Tantangan Harian →
            </button>
          ) : (
            <div className="text-center p-3 border-2 border-green-700 bg-green-700/10">
              <p className="font-stamp text-sm font-bold text-green-700">
                ✓ Tantangan haran ini telah selesai!
              </p>
              <p className="font-typewriter text-[10px] text-noir-paper-ink/60 mt-1">
                Kembali besok untuk tantangan baru.
              </p>
            </div>
          )}

          <p className="font-typewriter text-[9px] text-noir-paper-ink/40 text-center mt-3 italic">
            Modifier ditentukan oleh tanggal — semua pemain mendapat tantangan
            yang sama setiap hari.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Helper: check if current game can be abandoned for daily
function accusationCleared(difficulty: string | null): boolean {
  // If a game is in progress (difficulty set but no accusation), we allow starting daily
  // This is a simplified check
  return !difficulty;
}
