"use client";

import { useMemo } from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, DIFFICULTIES } from "@/lib/game-store";
import { playClick } from "@/lib/audio";

interface HintStep {
  id: string;
  text: string;
  target?: string; // section id to scroll to
}

/**
 * Floating hint bulb — suggests the next logical investigation step.
 * Only shows on "pemula" and "detektif" difficulties (not "legendaris").
 * Each use costs score points (per difficulty config).
 */
export default function HintSystem() {
  const difficulty = useGame((s) => s.difficulty);
  const clues = useGame((s) => s.clues);
  const examinedEvidence = useGame((s) => s.examinedEvidence);
  const interrogatedSuspects = useGame((s) => s.interrogatedSuspects);
  const timelineSolved = useGame((s) => s.timelineSolved);
  const accusation = useGame((s) => s.accusation);
  const addHint = useGame((s) => s.useHint);
  const hintsUsed = useGame((s) => s.hintsUsed);

  const [hint, setHint] = useState<HintStep | null>(null);
  const [visible, setVisible] = useState(false);

  const showHints = difficulty
    ? DIFFICULTIES[difficulty].showHints
    : false;

  // Determine the current next step based on game state
  const nextStep = useMemo((): HintStep => {
    const evidenceCount = Object.keys(examinedEvidence).length;
    const suspectsInterrogatedCount = Object.keys(interrogatedSuspects).length;

    if (evidenceCount < 3) {
      return {
        id: "evidence",
        text: "Periksa bukti di Loker Bukti. Setiap bukti yang kau periksa otomatis tercatat di buku catatan.",
        target: "bukti",
      };
    }
    if (suspectsInterrogatedCount === 0) {
      return {
        id: "interrogate",
        text: "Kunjungi Papan Benang Merah dan interogasi tersangka. Pernyataan mereka mengungkap siapa yang berbohong.",
        target: "papan",
      };
    }
    if (suspectsInterrogatedCount < 2) {
      return {
        id: "interrogate-more",
        text: `Hanya ${suspectsInterrogatedCount} tersangka yang diinterogasi. Bandingkan pernyataan untuk menemukan kontradiksi.`,
        target: "papan",
      };
    }
    if (!timelineSolved) {
      return {
        id: "timeline",
        text: "Coba selesaikan Rekonstruksi Linimasa. Mengurutkan peristiwa dengan benar memberi petunjuk bonus.",
        target: "linimasa",
      };
    }
    if (clues.length < (DIFFICULTIES[difficulty ?? "detektif"].minClues)) {
      return {
        id: "more-clues",
        text: `Kumpulkan lebih banyak petunjuk. Minimum untuk menuduh: ${DIFFICULTIES[difficulty ?? "detektif"].minClues}. Saat ini: ${clues.length}.`,
        target: "bukti",
      };
    }
    return {
      id: "accuse",
      text: "Kau sudah siap. Kunjungi Tuduhan Akhir dan pilih pelakunya — tapi pilih dengan hati-hati.",
      target: "tuduhan",
    };
  }, [examinedEvidence, interrogatedSuspects, timelineSolved, clues, difficulty]);

  // Show floating button after onboarding + difficulty chosen
  useEffect(() => {
    if (!showHints || accusation) {
      return;
    }
    let shouldShow = false;
    const check = () => {
      try {
        const onboarded =
          sessionStorage.getItem("misteri theater-onboarded") === "1";
        shouldShow = onboarded && !!difficulty && !accusation;
        if (shouldShow !== visible) {
          const raf = requestAnimationFrame(() => setVisible(shouldShow));
          // cleanup will cancel if needed
          return () => cancelAnimationFrame(raf);
        }
      } catch {
        /* noop */
      }
    };
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [showHints, difficulty, accusation, visible]);

  const revealHint = () => {
    playClick();
    addHint();
    setHint(nextStep);
  };

  const goToTarget = () => {
    playClick();
    if (hint?.target) {
      document
        .getElementById(hint.target)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setHint(null);
  };

  if (!visible) return null;

  const cost = difficulty ? DIFFICULTIES[difficulty].hintCost : 0;

  return (
    <>
      {/* floating bulb button */}
      <button
        type="button"
        onClick={revealHint}
        data-cursor-active
        aria-label="Minta petunjuk"
        className="fixed safe-bottom left-1/2 -translate-x-1/2 z-[78] group flex items-center gap-2 px-4 h-11 rounded-full bg-noir-coal/90 border border-noir-brass/50 backdrop-blur shadow-[0_4px_20px_rgba(201,163,90,0.3)] hover:border-noir-brass transition-colors"
      >
        <span className="text-lg group-hover:rotate-12 transition-transform">
          💡
        </span>
        <span className="font-stamp text-[10px] tracking-widest text-noir-brass uppercase">
          Petunjuk
        </span>
        {hintsUsed > 0 && (
          <span className="font-typewriter text-[9px] text-noir-paper/40">
            ×{hintsUsed}
          </span>
        )}
      </button>

      {/* hint modal */}
      <AnimatePresence>
        {hint && (
          <motion.div
            className="fixed inset-0 z-[98] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              playClick();
              setHint(null);
            }}
          >
            <div className="absolute inset-0 bg-noir-ink/90 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative paper-texture paper-edge paper-burn rounded-sm max-w-md w-full p-6"
            >
              <button
                onClick={() => {
                  playClick();
                  setHint(null);
                }}
                data-cursor-active
                aria-label="Tutup"
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-noir-paper-ink/60 hover:text-noir-crimson transition-colors font-stamp text-lg"
              >
                ✕
              </button>

              <div className="text-center mb-4">
                <span className="text-4xl inline-block">💡</span>
                <h3 className="font-stamp text-xl font-black text-noir-paper-ink mt-2">
                  PETUNJUK DETEKTIF
                </h3>
                <p className="font-typewriter text-[10px] text-noir-paper-ink/60 tracking-widest uppercase">
                  Petunjuk #{hintsUsed} · Biaya: -{cost} poin
                </p>
              </div>

              <div className="border-l-2 border-noir-crimson pl-3 py-2 mb-5">
                <p className="font-typewriter text-sm text-noir-paper-ink/90 leading-relaxed italic">
                  {hint.text}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    playClick();
                    setHint(null);
                  }}
                  data-cursor-active
                  className="font-typewriter text-[11px] text-noir-paper-ink/60 hover:text-noir-paper-ink/90 transition-colors px-3 py-2"
                >
                  tutup
                </button>
                {hint.target && (
                  <button
                    onClick={goToTarget}
                    data-cursor-active
                    className="font-stamp text-[11px] tracking-widest uppercase text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-colors px-4 py-2"
                  >
                    {hint.target === "bukti"
                      ? "→ KE LOKER BUKTI"
                      : hint.target === "papan"
                      ? "→ KE PAPAN"
                      : hint.target === "linimasa"
                      ? "→ KE LINIMASA"
                      : "→ KE TUDUHAN"}
                  </button>
                )}
              </div>

              {/* corner stamp */}
              <div className="absolute top-3 left-3 font-stamp text-[8px] tracking-widest text-noir-crimson/60 -rotate-6 border border-noir-crimson/40 px-1.5 py-0.5">
                BANTUAN
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
