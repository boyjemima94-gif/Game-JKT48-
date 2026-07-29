"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGame, DIFFICULTIES, type Difficulty } from "@/lib/game-store";
import { playClick, playStampSlam } from "@/lib/audio";

const ORDER: Difficulty[] = ["pemula", "detektif", "legendaris"];

const CARD_STYLES: Record<
  Difficulty,
  { border: string; glow: string; text: string; bg: string }
> = {
  pemula: {
    border: "border-green-700",
    glow: "rgba(34,197,94,0.4)",
    text: "text-green-400",
    bg: "bg-green-700/10",
  },
  detektif: {
    border: "border-noir-brass",
    glow: "rgba(201,163,90,0.4)",
    text: "text-noir-brass",
    bg: "bg-noir-brass/10",
  },
  legendaris: {
    border: "border-noir-crimson",
    glow: "rgba(192,57,43,0.4)",
    text: "text-noir-crimson",
    bg: "bg-noir-crimson/10",
  },
};

export default function DifficultySelect() {
  const difficulty = useGame((s) => s.difficulty);
  const setDifficulty = useGame((s) => s.setDifficulty);

  // Hide once chosen
  if (difficulty) return null;

  const choose = (d: Difficulty) => {
    playClick();
    setTimeout(() => playStampSlam(), 150);
    setDifficulty(d);
  };

  return (
    <section
      id="mode"
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      aria-label="Pilih Mode Penyelidikan"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Pilih Mode ·
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3"
            style={{
              textShadow:
                "0 0 24px rgba(255,179,71,0.25), 0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            MODE PENYELIDIKAN
          </h2>
          <p className="font-typewriter text-sm sm:text-base text-noir-paper/85 max-w-lg mx-auto">
            Pilih gaya penyelidikanmu. Tingkat kesulitan menentukan minimum
            petunjuk untuk menuduh, ketersediaan petunjuk, dan pengali skor
            akhir.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {ORDER.map((id, i) => {
            const cfg = DIFFICULTIES[id];
            const style = CARD_STYLES[id];
            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => choose(id)}
                data-cursor-active
                aria-label={`Pilih mode ${cfg.label}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className={`group relative p-6 border-2 ${style.border} ${style.bg} backdrop-blur transition-all hover:shadow-[0_16px_40px_rgba(0,0,0,0.8)]`}
                style={{
                  boxShadow: `0 8px 24px rgba(0,0,0,0.5)`,
                }}
              >
                {/* icon */}
                <div className="text-center mb-4">
                  <span
                    className="text-5xl inline-block transition-transform group-hover:scale-110"
                    style={{ filter: `drop-shadow(0 0 12px ${style.glow})` }}
                  >
                    {cfg.icon}
                  </span>
                </div>

                {/* label */}
                <h3
                  className={`font-stamp text-xl sm:text-2xl font-black ${style.text} text-center mb-2`}
                >
                  {cfg.label.toUpperCase()}
                </h3>

                {/* description */}
                <p className="font-typewriter text-[11px] text-noir-paper/75 text-center leading-relaxed mb-4 min-h-[48px]">
                  {cfg.description}
                </p>

                {/* stats */}
                <div className="space-y-1.5 pt-3 border-t border-noir-paper/10">
                  <div className="flex items-center justify-between text-[10px] font-typewriter">
                    <span className="text-noir-paper/50">Min. Petunjuk</span>
                    <span className={`font-stamp font-bold ${style.text}`}>
                      {cfg.minClues}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-typewriter">
                    <span className="text-noir-paper/50">Petunjuk Bantuan</span>
                    <span className={`font-stamp font-bold ${style.text}`}>
                      {cfg.showHints ? "Tersedia" : "Tidak"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-typewriter">
                    <span className="text-noir-paper/50">Pengali Skor</span>
                    <span className={`font-stamp font-bold ${style.text}`}>
                      ×{cfg.scoreMultiplier}
                    </span>
                  </div>
                </div>

                {/* select CTA */}
                <div
                  className={`mt-4 py-2 text-center font-stamp text-[11px] tracking-widest uppercase ${style.text} border-t border-${style.border}/40 group-hover:bg-noir-paper/5 transition-colors`}
                >
                  Pilih Mode →
                </div>

                {/* recommended badge for detektif */}
                {id === "detektif" && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-noir-brass text-noir-ink font-stamp text-[9px] tracking-widest font-bold -rotate-3">
                    ★ DIREKOMENDASI
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <p className="text-center font-typewriter text-[10px] text-noir-paper/40 mt-6 tracking-widest">
          · Mode dapat diubah dengan menekan ↻ MAIN LAGI di akhir kasus ·
        </p>
      </div>
    </section>
  );
}
