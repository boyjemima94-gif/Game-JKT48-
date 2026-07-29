"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClick } from "@/lib/audio";

const SHORTCUTS = [
  { key: "N", label: "Buka / tutup buku catatan" },
  { key: "Esc", label: "Tutup modal / panel aktif" },
  { key: "M", label: "Matikan / nyalakan suara" },
  { key: "?", label: "Tampilkan bantuan ini" },
];

/**
 * Floating help button (?) + overlay listing keyboard shortcuts.
 * Toggle with the "?" key.
 */
export default function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        setOpen((o) => !o);
        playClick();
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          playClick();
        }}
        data-cursor-active
        aria-label="Bantuan keyboard (?)"
        className="fixed safe-top safe-right z-[80] w-10 h-10 rounded-full bg-noir-coal/90 border border-noir-brass/40 backdrop-blur flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.8)] hover:border-noir-brass transition-colors font-stamp text-lg text-noir-brass"
      >
        ?
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-noir-ink/90 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative paper-texture paper-edge paper-burn rounded-sm max-w-md w-full p-6"
            >
              <button
                onClick={() => {
                  setOpen(false);
                  playClick();
                }}
                data-cursor-active
                aria-label="Tutup"
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-noir-paper-ink/60 hover:text-noir-crimson transition-colors font-stamp text-lg"
              >
                ✕
              </button>

              <div className="text-center mb-5">
                <span className="text-4xl">⌨️</span>
                <h3 className="font-stamp text-2xl font-black text-noir-paper-ink mt-2">
                  PEMBANTU KIBOR
                </h3>
                <p className="font-typewriter text-[11px] text-noir-paper-ink/60 mt-1">
                  Pintasan untuk menyelidiki lebih cepat
                </p>
              </div>

              <div className="space-y-2.5">
                {SHORTCUTS.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between gap-3 p-2 border border-noir-paper-ink/20 bg-noir-paper/30"
                  >
                    <span className="font-typewriter text-xs text-noir-paper-ink/80">
                      {s.label}
                    </span>
                    <kbd className="font-stamp text-xs font-bold text-noir-paper-ink bg-noir-paper-ink/10 border border-noir-paper-ink/30 px-2 py-1 rounded shadow-sm min-w-[28px] text-center">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-noir-paper-ink/20 text-center">
                <p className="font-typewriter text-[10px] text-noir-paper-ink/50 italic">
                  Tekan <kbd className="border border-noir-paper-ink/30 px-1 rounded">?</kbd> kapan saja untuk membuka ini lagi
                </p>
              </div>

              {/* corner stamp */}
              <div className="absolute top-3 left-3 font-stamp text-[8px] tracking-widest text-noir-crimson/60 -rotate-6 border border-noir-crimson/40 px-1.5 py-0.5">
                PETUNJUK
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
