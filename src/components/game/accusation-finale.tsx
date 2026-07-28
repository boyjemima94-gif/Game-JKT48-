"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, CULPRIT_ID, TOTAL_CLUE_COUNT } from "@/lib/game-store";
import { SUSPECTS } from "@/lib/suspects";
import { playClick, playStampSlam, playPaperRustle } from "@/lib/audio";

export default function AccusationFinale() {
  const clues = useGame((s) => s.clues);
  const accusation = useGame((s) => s.accusation);
  const accusationResult = useGame((s) => s.accusationResult);
  const makeAccusation = useGame((s) => s.makeAccusation);
  const resetGame = useGame((s) => s.resetGame);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const allCluesFound = clues.length >= TOTAL_CLUE_COUNT;
  const minCluesFound = clues.length >= 3;
  const canAccuse = minCluesFound && !accusation;

  const handleAccuse = () => {
    if (!selected) return;
    setConfirming(true);
    playPaperRustle(0.6, 0.6);
    setTimeout(() => {
      playStampSlam();
      makeAccusation(selected);
      setConfirming(false);
    }, 800);
  };

  const handleReset = () => {
    playClick();
    resetGame();
    setSelected(null);
  };

  const culprit = SUSPECTS.find((s) => s.id === CULPRIT_ID)!;
  const accusedSuspect = accusation
    ? SUSPECTS.find((s) => s.id === accusation)
    : null;

  return (
    <section
      id="tuduhan"
      className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
      aria-label="Tuduhan Akhir"
    >
      {/* dramatic backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(139,26,26,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* header */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-crimson uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Tuduhan Akhir ·
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3"
            style={{
              textShadow:
                "0 0 28px rgba(192,57,43,0.4), 0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            SIAPA PELAKU?
          </h2>
          <p className="font-typewriter text-sm sm:text-base text-noir-paper/85 max-w-xl mx-auto">
            {accusation
              ? "Keputusan telah dibuat. Lihat hasil tuduhanmu di bawah."
              : allCluesFound
              ? "Semua bukti terkumpul. Saatnya menuduh pelaku sejati."
              : minCluesFound
              ? "Kau telah mengumpulkan cukup petunjuk. Pilih satu tersangka untuk dituduh — pilih dengan hati-hati, hanya ada satu kesempatan."
              : "Kumpulkan setidaknya 3 petunjuk dari Loker Bukti sebelum dapat menuduh. Periksa bukti untuk membuka kunci tuduhan."}
          </p>
        </motion.div>

        {/* If not yet accused — show suspect selection */}
        {!accusation && (
          <>
            {/* lock overlay if not enough clues */}
            <div className={canAccuse ? "" : "relative"}>
              {!canAccuse && (
                <div className="absolute inset-0 z-20 bg-noir-ink/70 backdrop-blur-sm flex items-center justify-center rounded-lg">
                  <div className="text-center px-6">
                    <div className="text-5xl mb-3">🔒</div>
                    <p className="font-stamp text-sm tracking-widest text-noir-brass mb-1">
      TERTUTUK — PERLU LEBIH BANYIK PETUNJUK
                    </p>
                    <p className="font-typewriter text-xs text-noir-paper/70">
                      Petunjuk terkumpul: {clues.length} / 3 minimum
                    </p>
                    <a
                      href="#bukti"
                      data-cursor-active
                      className="inline-block mt-4 font-stamp text-[11px] tracking-widest text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-colors px-4 py-2"
                    >
                      → KE LOKER BUKTI
                    </a>
                  </div>
                </div>
              )}

              {/* suspect selection grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {SUSPECTS.map((s, i) => {
                  const isSelected = selected === s.id;
                  const implicatedCount = clues.filter(
                    (c) => c.suspectId === s.id
                  ).length;
                  return (
                    <motion.button
                      key={s.id}
                      type="button"
                      disabled={!canAccuse}
                      onClick={() => {
                        playClick();
                        setSelected(s.id);
                      }}
                      data-cursor-active
                      aria-label={`Tuduh ${s.name}`}
                      className="group relative focus:outline-none disabled:cursor-not-allowed"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      whileHover={canAccuse ? { y: -6 } : {}}
                    >
                      <div
                        className={`relative aspect-[3/4] border-2 overflow-hidden transition-all ${
                          isSelected
                            ? "border-noir-crimson shadow-[0_0_30px_rgba(192,57,43,0.6)]"
                            : "border-noir-coffee/70 hover:border-noir-brass"
                        }`}
                      >
                        <img
                          src={s.portrait}
                          alt={s.name}
                          className="suspect-portrait w-full h-full object-cover"
                          style={{
                            filter: isSelected
                              ? "sepia(0) contrast(1.15) brightness(1.05)"
                              : "sepia(0.4) contrast(1.05) brightness(0.7)",
                          }}
                        />
                        {/* selection ring */}
                        {isSelected && (
                          <div className="absolute inset-0 border-4 border-noir-crimson/80 pointer-events-none" />
                        )}
                        {/* codename */}
                        <div className="absolute bottom-0 inset-x-0 bg-noir-ink/95 px-2 py-1.5 border-t-2 border-noir-brass/60">
                          <p className="font-stamp text-[10px] sm:text-xs tracking-widest text-noir-brass font-bold truncate text-center">
                            {s.codename}
                          </p>
                          <p className="font-typewriter text-[8px] sm:text-[9px] text-noir-paper/70 truncate text-center">
                            {s.name}
                          </p>
                        </div>
                        {/* implicated clues indicator */}
                        {implicatedCount > 0 && (
                          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-noir-crimson/90">
                            <span className="font-stamp text-[8px] tracking-widest text-noir-paper font-bold">
                              {implicatedCount} PETUNJUK
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* confirm bar */}
            <AnimatePresence>
              {selected && canAccuse && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-8 paper-texture paper-edge p-5 sm:p-6 max-w-2xl mx-auto"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="text-center sm:text-left flex-1">
                      <p className="font-stamp text-[10px] tracking-widest text-noir-crimson font-bold">
                        KONFIRMASI TUDUHAN
                      </p>
                      <p className="font-typewriter text-sm text-noir-paper-ink mt-1">
                        Kau menuduh{" "}
                        <span className="font-bold">
                          {SUSPECTS.find((s) => s.id === selected)?.name}
                        </span>{" "}
                        ({SUSPECTS.find((s) => s.id === selected)?.codename})
                        sebagai pelaku. Keputusan ini{" "}
                        <span className="text-noir-crimson font-bold">
                          tidak dapat dibatalkan
                        </span>
                        .
                      </p>
                    </div>
                    <button
                      onClick={handleAccuse}
                      disabled={confirming}
                      data-cursor-active
                      className="shrink-0 px-6 py-3 font-stamp text-xs tracking-[0.2em] uppercase text-noir-paper bg-noir-crimson hover:bg-noir-blood transition-colors shadow-[0_8px_20px_rgba(139,26,26,0.6)] disabled:opacity-60"
                    >
                      {confirming ? "MEMPROSES..." : "TUDUH SEKARANG ⚖"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Result — after accusation */}
        {accusation && accusedSuspect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className={`relative paper-texture paper-edge paper-burn p-6 sm:p-10 max-w-3xl mx-auto ${
              accusationResult === "correct"
                ? "border-4 border-green-700"
                : "border-4 border-noir-crimson"
            }`}
          >
            {/* verdict stamp */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 rotate-[-8deg]">
              <div
                className={`px-6 py-2 border-4 ${
                  accusationResult === "correct"
                    ? "border-green-700 bg-noir-paper"
                    : "border-noir-crimson bg-noir-paper"
                }`}
              >
                <p
                  className={`font-stamp text-2xl sm:text-3xl font-black ${
                    accusationResult === "correct"
                      ? "text-green-700"
                      : "text-noir-crimson"
                  }`}
                >
                  {accusationResult === "correct"
                    ? "BENAR!"
                    : "SALAH!"}
                </p>
              </div>
            </div>

            <div className="text-center pt-6">
              <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-paper-ink/60 uppercase mb-2">
                Verdict · Putusan Akhir
              </p>
              <h3 className="font-stamp text-2xl sm:text-3xl font-black text-noir-paper-ink mb-4">
                {accusationResult === "correct"
                  ? "KASUS TERPECAHKAN"
                  : "KEADILAN TERTUNDIN"}
              </h3>

              <div className="flex flex-col sm:flex-row items-center gap-5 my-6">
                {/* accused */}
                <div className="text-center">
                  <div className="w-24 h-32 mx-auto border-2 border-noir-paper-ink/40 overflow-hidden mb-2">
                    <img
                      src={accusedSuspect.portrait}
                      alt={accusedSuspect.name}
                      className="w-full h-full object-cover suspect-portrait"
                    />
                  </div>
                  <p className="font-stamp text-[9px] tracking-widest text-noir-paper-ink/60">
                    KAU MENUDUH
                  </p>
                  <p className="font-stamp text-sm font-bold text-noir-paper-ink">
                    {accusedSuspect.name}
                  </p>
                </div>

                {/* vs divider */}
                <div className="font-stamp text-2xl text-noir-crimson font-black">
                  ⚖
                </div>

                {/* actual culprit */}
                <div className="text-center">
                  <div className="w-24 h-32 mx-auto border-2 border-noir-crimson overflow-hidden mb-2 shadow-[0_0_20px_rgba(192,57,43,0.4)]">
                    <img
                      src={culprit.portrait}
                      alt={culprit.name}
                      className="w-full h-full object-cover suspect-portrait"
                    />
                  </div>
                  <p className="font-stamp text-[9px] tracking-widest text-noir-crimson font-bold">
                    PELAKU SEBENARNYA
                  </p>
                  <p className="font-stamp text-sm font-bold text-noir-paper-ink">
                    {culprit.name}
                  </p>
                </div>
              </div>

              {/* story resolution */}
              <div className="text-left border-t border-noir-paper-ink/20 pt-5 mb-5">
                <p className="font-stamp text-[10px] tracking-[0.25em] text-noir-crimson font-bold mb-2">
                  PENGAKUAN
                </p>
                {accusationResult === "correct" ? (
                  <p className="font-typewriter text-sm text-noir-paper-ink/90 leading-relaxed italic">
                    &ldquo;{culprit.quote}&rdquo;{" "}
                    <span className="not-italic">
                      — {culprit.name} mengaku setelah dikonfrontasi dengan
                      seluruh bukti. {culprit.signature} Rahasia panggung akhirnya
                      terbongkar. Kau telah menyelesaikan kasus JKT-48-001.
                    </span>
                  </p>
                ) : (
                  <p className="font-typewriter text-sm text-noir-paper-ink/90 leading-relaxed">
                    Tuduhanmu jatuh kepada {accusedSuspect.name}, namun bukti
                    sebenarnya mengarah ke {culprit.name} ({culprit.codename}).
                    {culprit.name} melarikan diri malam itu. Kasus ini kini
                    menjadi arsip dingin — sampai seseorang membukanya kembali.
                  </p>
                )}
              </div>

              {/* stats */}
              <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                <div className="border border-noir-paper-ink/20 p-2">
                  <p className="font-stamp text-[9px] tracking-widest text-noir-paper-ink/60">
                    PETUNJUK
                  </p>
                  <p className="font-stamp text-lg font-black text-noir-paper-ink">
                    {clues.length}/{TOTAL_CLUE_COUNT}
                  </p>
                </div>
                <div className="border border-noir-paper-ink/20 p-2">
                  <p className="font-stamp text-[9px] tracking-widest text-noir-paper-ink/60">
                    HASIL
                  </p>
                  <p
                    className={`font-stamp text-lg font-black ${
                      accusationResult === "correct"
                        ? "text-green-700"
                        : "text-noir-crimson"
                    }`}
                  >
                    {accusationResult === "correct" ? "MENANG" : "KALAH"}
                  </p>
                </div>
                <div className="border border-noir-paper-ink/20 p-2">
                  <p className="font-stamp text-[9px] tracking-widest text-noir-paper-ink/60">
                    KASUS
                  </p>
                  <p className="font-stamp text-lg font-black text-noir-paper-ink">
                    001
                  </p>
                </div>
              </div>

              {/* reset button */}
              <button
                onClick={handleReset}
                data-cursor-active
                className="font-stamp text-[11px] tracking-widest text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-colors px-6 py-2.5"
              >
                ↻ MAIN LAGI
              </button>
              <p className="font-typewriter text-[10px] text-noir-paper-ink/50 mt-2">
                Menghapus progres dan memulai penyelidikan baru
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
