"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TIMELINE_EVENTS } from "@/lib/interrogations";
import { useGame } from "@/lib/game-store";
import { playClick, playPaperRustle, playStampSlam } from "@/lib/audio";

// The correct order is the natural array order (chronological).
const CORRECT_ORDER = TIMELINE_EVENTS.map((e) => e.id);

export default function TimelineSection() {
  const timelineSolved = useGame((s) => s.timelineSolved);
  const setTimelineSolved = useGame((s) => s.setTimelineSolved);
  const recordStatement = useGame((s) => s.recordStatement);

  // Shuffle the events once on mount (stable shuffle per session).
  const shuffled = useMemo(() => {
    const arr = [...TIMELINE_EVENTS];
    // deterministic shuffle so it doesn't reshuffle on every render
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor((i * 9301 + 49297) % 233280) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const [placed, setPlaced] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);

  const available = shuffled.filter((e) => !placed.includes(e.id));

  const placeEvent = (id: string) => {
    if (timelineSolved) return;
    playClick();
    setPlaced((p) => [...p, id]);
    setSelected(null);
  };

  const removeEvent = (id: string) => {
    if (timelineSolved) return;
    playClick();
    setPlaced((p) => p.filter((x) => x !== id));
  };

  const checkOrder = () => {
    setChecking(true);
    playPaperRustle(0.5, 0.5);
    setTimeout(() => {
      const isCorrect =
        placed.length === CORRECT_ORDER.length &&
        placed.every((id, i) => id === CORRECT_ORDER[i]);
      if (isCorrect) {
        playStampSlam();
        setTimelineSolved(true);
        // award a bonus clue
        recordStatement("stmt-timeline");
      } else {
        playClick();
        setWrongCount((w) => w + 1);
        setTimeout(() => {
          setChecking(false);
        }, 1200);
      }
    }, 800);
  };

  const reset = () => {
    playClick();
    setPlaced([]);
    setSelected(null);
    setChecking(false);
  };

  return (
    <section
      id="linimasa"
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      aria-label="Rekonstruksi Linimasa"
    >
      <div className="max-w-5xl mx-auto">
        {/* header */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Rekonstruksi ·
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3"
            style={{
              textShadow:
                "0 0 24px rgba(255,179,71,0.25), 0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            URUTAN LINIMASA
          </h2>
          <p className="font-typewriter text-sm sm:text-base text-noir-paper/85 max-w-xl mx-auto">
            Susun peristiwa malam itu dalam urutan kronologis yang benar untuk
            mengungkap pola dan membuka petunjuk bonus.
          </p>
        </motion.div>

        {/* solved banner */}
        <AnimatePresence>
          {timelineSolved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 mx-auto max-w-2xl paper-texture paper-edge p-4 border-4 border-green-700"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">✅</span>
                <div>
                  <p className="font-stamp text-lg font-black text-green-700">
                    LINIMASA TERPECAHKAN
                  </p>
                  <p className="font-typewriter text-[11px] text-noir-paper-ink/80">
                    Petunjuk bonus &ldquo;Pola Kronologi&rdquo; ditambahkan ke
                    buku catatan.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* timeline rail (placed events) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-brass uppercase">
              Urutan Kronologis
            </p>
            <p className="font-typewriter text-[11px] text-noir-paper/60">
              {placed.length} / {TIMELINE_EVENTS.length} peristiwa
            </p>
          </div>

          <div
            className={`relative paper-texture paper-edge rounded-sm p-4 sm:p-6 min-h-[200px] ${
              checking && !timelineSolved
                ? wrongCount > 0
                  ? "border-2 border-noir-crimson"
                  : ""
                : ""
            }`}
          >
            {/* the rail line */}
            {placed.length > 0 && (
              <div className="absolute left-6 sm:left-8 top-12 bottom-8 w-0.5 bg-gradient-to-b from-noir-brass via-noir-crimson to-noir-brass opacity-50" />
            )}

            {placed.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="font-typewriter text-xs text-noir-paper-ink/50 italic text-center">
                  Klik peristiwa di bawah untuk menempatkannya di sini, dalam
                  urutan yang benar.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {placed.map((id, idx) => {
                  const ev = TIMELINE_EVENTS.find((e) => e.id === id)!;
                  const isCorrectSpot =
                    timelineSolved || (checking && id === CORRECT_ORDER[idx]);
                  const isWrongSpot =
                    checking && !timelineSolved && id !== CORRECT_ORDER[idx];
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative flex items-start gap-3 sm:gap-4 pl-2"
                    >
                      {/* time node */}
                      <div
                        className={`relative z-10 shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-stamp text-[10px] sm:text-xs font-bold border-2 ${
                          isWrongSpot
                            ? "border-noir-crimson bg-noir-crimson/20 text-noir-crimson"
                            : isCorrectSpot
                            ? "border-green-600 bg-green-600/20 text-green-500"
                            : "border-noir-paper-ink/40 bg-noir-paper/40 text-noir-paper-ink"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      {/* event card */}
                      <div
                        className={`flex-1 p-3 border ${
                          isWrongSpot
                            ? "border-noir-crimson bg-noir-crimson/5"
                            : "border-noir-paper-ink/30 bg-noir-paper/30"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-stamp text-sm font-bold text-noir-crimson">
                            {ev.time}
                          </span>
                          <span className="font-stamp text-sm font-bold text-noir-paper-ink">
                            {ev.event}
                          </span>
                          {isWrongSpot && (
                            <span className="ml-auto font-stamp text-[9px] tracking-widest text-noir-crimson font-bold">
                              ✗ SALAH POSISI
                            </span>
                          )}
                          {timelineSolved && (
                            <span className="ml-auto font-stamp text-[9px] tracking-widest text-green-600 font-bold">
                              ✓ BENAR
                            </span>
                          )}
                        </div>
                        <p className="font-typewriter text-[11px] text-noir-paper-ink/80 leading-snug">
                          {ev.detail}
                        </p>
                      </div>
                      {/* remove button */}
                      {!timelineSolved && (
                        <button
                          onClick={() => removeEvent(id)}
                          data-cursor-active
                          aria-label="Hapus dari urutan"
                          className="shrink-0 w-7 h-7 flex items-center justify-center text-noir-paper-ink/40 hover:text-noir-crimson transition-colors font-stamp"
                        >
                          ✕
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* available events pool */}
        {!timelineSolved && (
          <div className="mb-6">
            <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-brass uppercase mb-3">
              Peristiwa Tersedia (acak)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {available.map((ev) => (
                <motion.button
                  key={ev.id}
                  onClick={() => placeEvent(ev.id)}
                  data-cursor-active
                  whileHover={{ y: -3 }}
                  className="text-left p-3 border border-noir-coffee/70 bg-noir-coal/70 hover:border-noir-brass hover:bg-noir-brass/10 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-stamp text-sm font-bold text-noir-crimson">
                      {ev.time}
                    </span>
                    <span className="font-stamp text-xs font-bold text-noir-paper group-hover:text-noir-brass transition-colors">
                      {ev.event}
                    </span>
                  </div>
                  <p className="font-typewriter text-[10px] text-noir-paper/60 leading-snug line-clamp-2">
                    {ev.detail}
                  </p>
                  <p className="font-stamp text-[8px] tracking-widest text-noir-brass/50 mt-1.5 group-hover:text-noir-brass transition-colors">
                    + TAMBAH KE URUTAN
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* action bar */}
        {!timelineSolved && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={checkOrder}
              disabled={placed.length !== TIMELINE_EVENTS.length || checking}
              data-cursor-active
              className="px-6 py-2.5 font-stamp text-xs tracking-[0.2em] uppercase text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {checking ? "MEMERIKSA..." : "✓ PERIKSA URUTAN"}
            </button>
            {placed.length > 0 && (
              <button
                onClick={reset}
                data-cursor-active
                className="px-4 py-2.5 font-stamp text-[11px] tracking-widest uppercase text-noir-paper/70 border border-noir-paper/20 hover:border-noir-crimson hover:text-noir-crimson transition-colors"
              >
                ↻ RESET
              </button>
            )}
            {wrongCount > 0 && (
              <span className="font-typewriter text-[11px] text-noir-crimson">
                Percobaan salah: {wrongCount}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
