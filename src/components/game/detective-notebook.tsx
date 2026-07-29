"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, TOTAL_CLUE_COUNT } from "@/lib/game-store";
import { SUSPECTS as SUSPECTS_DATA } from "@/lib/suspects";
import { playClick } from "@/lib/audio";

export default function DetectiveNotebook() {
  const open = useGame((s) => s.notebookOpen);
  const clues = useGame((s) => s.clues);
  const toggleNotebook = useGame((s) => s.toggleNotebook);

  // keyboard shortcut: N to toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.key === "n" || e.key === "N") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        const t = e.target as HTMLElement;
        if (
          t &&
          (t.tagName === "INPUT" ||
            t.tagName === "TEXTAREA" ||
            t.isContentEditable)
        )
          return;
        e.preventDefault();
        toggleNotebook();
        playClick();
      }
      if (e.key === "Escape" && open) {
        toggleNotebook(false);
        playClick();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleNotebook, open]);

  // group clues by whether they implicate a suspect
  const cluesWithSuspect = clues.filter((c) => c.suspectId);
  const generalClues = clues.filter((c) => !c.suspectId);

  const suspectName = (id?: string) =>
    SUSPECTS_DATA.find((s) => s.id === id)?.name ?? "—";
  const suspectCodename = (id?: string) =>
    SUSPECTS_DATA.find((s) => s.id === id)?.codename ?? "—";

  return (
    <>
      {/* floating trigger button */}
      <button
        type="button"
        onClick={() => {
          toggleNotebook();
          playClick();
        }}
        data-cursor-active
        aria-label="Buka Buku Catatan Detektif (N)"
        className="fixed safe-bottom safe-right z-[80] group flex items-center gap-2 px-4 h-11 rounded-full bg-noir-coal/90 border border-noir-brass/40 backdrop-blur shadow-[0_4px_16px_rgba(0,0,0,0.8)] hover:border-noir-brass transition-colors"
      >
        <span className="text-lg">📓</span>
        <span className="font-stamp text-[10px] tracking-widest text-noir-brass uppercase hidden sm:inline">
          Catatan
        </span>
        {/* clue count badge */}
        <span className="ml-1 min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-noir-crimson text-noir-paper font-stamp text-[10px] font-bold">
          {clues.length}
        </span>
        <kbd className="hidden md:inline font-typewriter text-[9px] text-noir-paper/40 border border-noir-paper/20 px-1 rounded">
          N
        </kbd>
      </button>

      {/* slide-out panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* backdrop */}
            <motion.div
              className="fixed inset-0 z-[95] bg-noir-ink/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                toggleNotebook(false);
                playClick();
              }}
            />
            {/* panel */}
            <motion.aside
              className="fixed top-0 right-0 bottom-0 z-[96] w-full max-w-md paper-texture paper-edge overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              role="dialog"
              aria-label="Buku Catatan Detektif"
            >
              {/* header */}
              <div className="sticky top-0 z-10 bg-noir-paper-ink px-5 py-4 flex items-center justify-between shadow-lg">
                <div>
                  <p className="font-stamp text-[9px] tracking-[0.3em] text-noir-brass uppercase">
                    Detektif R.
                  </p>
                  <h3 className="font-stamp text-lg font-black text-noir-paper tracking-wide">
                    BUKU CATATAN
                  </h3>
                </div>
                <button
                  onClick={() => {
                    toggleNotebook(false);
                    playClick();
                  }}
                  data-cursor-active
                  aria-label="Tutup"
                  className="w-9 h-9 flex items-center justify-center text-noir-paper/70 hover:text-noir-crimson transition-colors font-stamp text-xl border border-noir-paper/20 rounded"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-6">
                {/* progress */}
                <div className="border-2 border-noir-paper-ink/30 p-3 bg-noir-paper/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-stamp text-[10px] tracking-widest text-noir-paper-ink/70">
      PROGRES PENYELIDIKAN
                    </span>
                    <span className="font-typewriter text-sm text-noir-paper-ink font-bold">
                      {clues.length}/{TOTAL_CLUE_COUNT}
                    </span>
                  </div>
                  <div className="h-2 bg-noir-paper-ink/15 overflow-hidden rounded-full">
                    <motion.div
                      className="h-full bg-gradient-to-r from-noir-crimson to-noir-brass"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(clues.length / TOTAL_CLUE_COUNT) * 100}%`,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  {clues.length === 0 && (
                    <p className="font-typewriter text-[10px] text-noir-paper-ink/60 mt-2 italic">
                      Belum ada catatan. Periksa bukti di Loker Bukti.
                    </p>
                  )}
                  {clues.length === TOTAL_CLUE_COUNT && (
                    <p className="font-stamp text-[10px] tracking-widest text-noir-crimson mt-2 font-bold animate-pulse">
                      ★ SEMUA BUKTI TERKUMPUL — SAATNYA MENUDUH! ★
                    </p>
                  )}
                </div>

                {/* clues implicating suspects */}
                {cluesWithSuspect.length > 0 && (
                  <div>
                    <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-crimson font-bold mb-3 pb-1 border-b border-noir-paper-ink/20">
                      ↳ PETUNJUK PENGARAH TERSANGKA
                    </p>
                    <div className="space-y-3">
                      {cluesWithSuspect.map((c) => (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="border-l-2 border-noir-crimson pl-3 py-1"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{c.glyph}</span>
                            <span className="font-stamp text-sm font-bold text-noir-paper-ink">
                              {c.title}
                            </span>
                          </div>
                          <p className="font-typewriter text-[11px] text-noir-paper-ink/80 leading-snug mb-1">
                            {c.description}
                          </p>
                          <p className="font-typewriter text-[10px] text-noir-crimson font-bold">
                            → Mengarah ke: {suspectName(c.suspectId)} (
                            {suspectCodename(c.suspectId)})
                          </p>
                          <p className="font-typewriter text-[9px] text-noir-paper-ink/40 mt-0.5">
                            {c.source} ·{" "}
                            {new Date(c.foundAt).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* general clues */}
                {generalClues.length > 0 && (
                  <div>
                    <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-brass font-bold mb-3 pb-1 border-b border-noir-paper-ink/20">
                      ↳ PETUNJUK UMUM
                    </p>
                    <div className="space-y-2">
                      {generalClues.map((c) => (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-2 border-l-2 border-noir-brass pl-3 py-1"
                        >
                          <span className="text-lg">{c.glyph}</span>
                          <div>
                            <span className="font-stamp text-sm font-bold text-noir-paper-ink block">
                              {c.title}
                            </span>
                            <p className="font-typewriter text-[11px] text-noir-paper-ink/80 leading-snug">
                              {c.description}
                            </p>
                            <p className="font-typewriter text-[9px] text-noir-paper-ink/40 mt-0.5">
                              {c.source}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* suspect quick list */}
                <div>
                  <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-paper-ink/60 font-bold mb-3 pb-1 border-b border-noir-paper-ink/20">
                    ↳ TERSANGKA
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {SUSPECTS_DATA.map((s) => {
                      const implicated = cluesWithSuspect.filter(
                        (c) => c.suspectId === s.id
                      ).length;
                      return (
                        <div
                          key={s.id}
                          className="border border-noir-paper-ink/20 p-2 bg-noir-paper/30"
                        >
                          <p className="font-stamp text-[10px] font-bold text-noir-paper-ink truncate">
                            {s.name.split(" ")[0]}
                          </p>
                          <p className="font-typewriter text-[9px] text-noir-paper-ink/50 truncate">
                            {s.codename}
                          </p>
                          <p className="font-typewriter text-[10px] text-noir-crimson font-bold mt-0.5">
                            {implicated} petunjuk
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* footer hint */}
                <div className="text-center pt-2 border-t border-noir-paper-ink/20">
                  <p className="font-typewriter text-[10px] text-noir-paper-ink/50 italic">
                    &ldquo;Setiap petunjuk adalah benang menuju kebenaran.&rdquo;
                  </p>
                  <p className="font-typewriter text-[9px] text-noir-paper-ink/40 mt-1">
                    Tekan <kbd className="border border-noir-paper-ink/30 px-1 rounded">N</kbd> atau <kbd className="border border-noir-paper-ink/30 px-1 rounded">Esc</kbd> untuk menutup
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
