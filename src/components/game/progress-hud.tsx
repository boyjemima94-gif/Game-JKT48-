"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, TOTAL_CLUE_COUNT } from "@/lib/game-store";
import { playClick } from "@/lib/audio";

/**
 * Top progress HUD — shows case status + clue count + notebook toggle hint.
 * Appears after the user scrolls past the hero.
 */
export default function ProgressHud() {
  const clues = useGame((s) => s.clues);
  const toggleNotebook = useGame((s) => s.toggleNotebook);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pct = Math.round((clues.length / TOTAL_CLUE_COUNT) * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed safe-top left-1/2 -translate-x-1/2 z-[75] w-[min(94vw,640px)]"
        >
          <div className="flex items-center gap-3 px-4 py-2 bg-noir-coal/90 backdrop-blur border border-noir-brass/40 shadow-[0_8px_24px_rgba(0,0,0,0.7)] rounded-sm">
            {/* case badge */}
            <div className="shrink-0 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-noir-crimson animate-pulse" />
              <span className="font-stamp text-[10px] tracking-widest text-noir-brass hidden sm:inline">
                JKT-48-001
              </span>
            </div>

            {/* progress bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-typewriter text-[9px] tracking-wider text-noir-paper/60 uppercase truncate">
                  Petunjuk
                </span>
                <span className="font-typewriter text-[10px] text-noir-paper/80 font-mono">
                  {clues.length}/{TOTAL_CLUE_COUNT}
                </span>
              </div>
              <div className="h-1.5 bg-noir-ink rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-noir-crimson to-noir-brass"
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* notebook quick-open */}
            <button
              onClick={() => {
                playClick();
                toggleNotebook();
              }}
              data-cursor-active
              aria-label="Buka catatan"
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 border border-noir-brass/40 hover:border-noir-brass hover:bg-noir-brass/10 transition-colors rounded-sm"
            >
              <span className="text-sm">📓</span>
              <kbd className="hidden md:inline font-typewriter text-[9px] text-noir-paper/50 border border-noir-paper/20 px-1 rounded">
                N
              </kbd>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
