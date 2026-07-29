"use client";

import { motion } from "framer-motion";
import { useGame } from "@/lib/game-store";
import { ACHIEVEMENTS, RARITY_META } from "@/lib/achievements";

/**
 * Achievements Gallery — shows all unlockable badges.
 * Locked achievements are greyed out; unlocked ones glow with rarity color.
 * Persistent across games (survives reset).
 */
export default function AchievementsGallery() {
  const unlockedAchievements = useGame((s) => s.unlockedAchievements);

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const pct =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <section
      id="pencapaian"
      className="relative py-16 sm:py-20 px-4 sm:px-6"
      aria-label="Galeri Pencapaian"
    >
      <div className="max-w-5xl mx-auto">
        {/* header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Pencapaian ·
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3"
            style={{
              textShadow:
                "0 0 24px rgba(255,179,71,0.25), 0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            GALLERI PENCAPAIAN
          </h2>
          <p className="font-typewriter text-sm text-noir-paper/70 max-w-lg mx-auto">
            Buka lencana dengan menyelesaikan tantangan khusus. Pencapaian
            tercatat permanen.
          </p>

          {/* progress */}
          <div className="inline-flex items-center gap-3 mt-5 px-4 py-2 border border-noir-brass/40 bg-noir-coal/60">
            <span className="font-stamp text-[11px] tracking-widest text-noir-brass">
              TERBUKA
            </span>
            <div className="flex gap-1">
              {ACHIEVEMENTS.map((a) => (
                <span
                  key={a.id}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    unlockedAchievements.includes(a.id)
                      ? "bg-noir-brass shadow-[0_0_6px_rgba(201,163,90,0.8)]"
                      : "bg-noir-paper/15"
                  }`}
                />
              ))}
            </div>
            <span className="font-typewriter text-xs text-noir-paper/70 font-mono">
              {unlockedCount}/{totalCount} · {pct}%
            </span>
          </div>
        </motion.div>

        {/* achievements grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((ach, i) => {
            const isUnlocked = unlockedAchievements.includes(ach.id);
            const rarity = RARITY_META[ach.rarity];
            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                whileHover={{ y: -3 }}
                className={`relative p-4 border-2 transition-all ${
                  isUnlocked
                    ? `${rarity.border} bg-noir-coal/70`
                    : "border-noir-coffee/50 bg-noir-coal/40"
                }`}
                style={{
                  boxShadow: isUnlocked ? `0 0 20px ${rarity.glow}` : "none",
                }}
              >
                {/* rarity badge */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-stamp text-[8px] tracking-widest font-bold px-1.5 py-0.5 border ${
                      isUnlocked
                        ? `${rarity.border} ${rarity.color}`
                        : "border-noir-paper/20 text-noir-paper/30"
                    }`}
                  >
                    {rarity.label}
                  </span>
                  {isUnlocked ? (
                    <span className="font-stamp text-[9px] tracking-widest text-noir-brass font-bold">
                      ✓ TERBUKA
                    </span>
                  ) : (
                    <span className="font-stamp text-[9px] tracking-widest text-noir-paper/30">
                      🔒 TERKUNCI
                    </span>
                  )}
                </div>

                {/* glyph + title */}
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-4xl transition-all ${
                      isUnlocked ? "" : "grayscale opacity-30"
                    }`}
                    style={{
                      filter: isUnlocked
                        ? `drop-shadow(0 0 8px ${rarity.glow})`
                        : "none",
                    }}
                  >
                    {ach.glyph}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-stamp text-sm font-black leading-tight ${
                        isUnlocked ? "text-noir-paper" : "text-noir-paper/40"
                      }`}
                    >
                      {ach.title}
                    </p>
                  </div>
                </div>

                {/* description */}
                <p
                  className={`font-typewriter text-[11px] leading-relaxed ${
                    isUnlocked
                      ? "text-noir-paper/70"
                      : "text-noir-paper/30 italic"
                  }`}
                >
                  {isUnlocked
                    ? ach.description
                    : "???"}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* completion message */}
        {unlockedCount === totalCount && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-center paper-texture paper-edge p-5 border-4 border-noir-brass"
          >
            <p className="text-4xl mb-2">🏆</p>
            <p className="font-stamp text-lg font-black text-noir-brass">
              ★ SEMUA PENCAPAIAN TERBUKA ★
            </p>
            <p className="font-typewriter text-xs text-noir-paper-ink/70 mt-1">
              Kau adalah Detektif Sejati Teatro del Misteri.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
