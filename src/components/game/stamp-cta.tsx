"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playStampSlam, playPaperRustle, playClick, unlockAudio } from "@/lib/audio";

export default function StampCta() {
  const [stamped, setStamped] = useState(false);
  const [slamming, setSlamming] = useState(false);
  const [count, setCount] = useState(0);
  const stampRef = useRef<HTMLButtonElement | null>(null);

  const doStamp = useCallback(() => {
    if (slamming) return;
    unlockAudio();
    setSlamming(true);
    // pre-stamp rustle (paper shifting)
    playPaperRustle(0.5, 0.5);
    // then the slam
    setTimeout(() => {
      playStampSlam();
      playPaperRustle(0.7, 0.7);
    }, 280);
    setTimeout(() => {
      setStamped(true);
      setCount((c) => c + 1);
      setSlamming(false);
    }, 560);
  }, [slamming]);

  const reset = useCallback(() => {
    playClick();
    setStamped(false);
  }, []);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && stampRef.current === document.activeElement) {
        e.preventDefault();
        doStamp();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doStamp]);

  return (
    <section
      id="stamp"
      className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden"
      aria-label="Bergabung dalam Game"
    >
      {/* ambient spotlight behind stamp */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(192,57,43,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-stamp text-xs sm:text-sm tracking-[0.4em] text-noir-brass uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Panggilan Terakhir ·
          </span>
          <h2
            className="font-stamp text-4xl sm:text-6xl font-black text-noir-paper mt-3 mb-4"
            style={{
              textShadow:
                "0 0 30px rgba(255,179,71,0.3), 0 4px 16px rgba(0,0,0,0.9), 2px 2px 0 rgba(0,0,0,0.6)",
            }}
          >
            MASUKI TEATER
          </h2>
          <p className="font-typewriter text-sm sm:text-base text-noir-paper/85 max-w-lg mx-auto mb-12">
            Tekan cap untuk menandatangani kontrak detektif. Suara gemerisik
            kertas akan menemanimu memasuki dunia ini.
          </p>
        </motion.div>

        {/* Stamp assembly */}
        <div className="relative flex flex-col items-center">
          {/* hanging stamp tool */}
          <button
            ref={stampRef}
            type="button"
            onClick={doStamp}
            disabled={slamming}
            data-cursor-active
            aria-label="Tekan cap: Bergabung dalam Game"
            className="relative group focus:outline-none disabled:cursor-none"
          >
            {/* string / chain holding the stamp */}
            <div className="absolute left-1/2 -top-32 -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-noir-brass/30 to-noir-brass pointer-events-none" />
            <div className="absolute left-1/2 -top-[140px] -translate-x-1/2 w-4 h-4 rounded-full bg-noir-brass border-2 border-noir-ink pointer-events-none shadow-[0_2px_6px_rgba(0,0,0,0.8)]" />

            {/* the GIANT stamp tool */}
            <motion.div
              animate={
                slamming
                  ? { y: 120, rotate: -8, scale: 1.05 }
                  : stamped
                  ? { y: -16, rotate: -6 }
                  : { y: 0, rotate: -6 }
              }
              transition={{
                duration: slamming ? 0.3 : 0.4,
                ease: slamming ? "easeIn" : "easeOut",
              }}
              whileHover={!stamped && !slamming ? { y: 10, rotate: -2 } : {}}
              className="relative"
              style={{ filter: "drop-shadow(0 16px 30px rgba(0,0,0,0.9))" }}
            >
              {/* handle top knob */}
              <div className="mx-auto w-6 h-4 bg-gradient-to-b from-noir-brass to-noir-umber rounded-t-full border-2 border-noir-ink" />
              {/* handle shaft */}
              <div className="mx-auto w-16 h-28 bg-gradient-to-b from-noir-brass via-noir-brass to-noir-umber rounded-md border-2 border-noir-ink shadow-[inset_2px_0_4px_rgba(255,255,255,0.3),inset_-2px_0_4px_rgba(0,0,0,0.4)] relative">
                {/* handle grip ridges */}
                <div className="absolute inset-x-2 top-4 h-px bg-noir-ink/40" />
                <div className="absolute inset-x-2 top-8 h-px bg-noir-ink/40" />
                <div className="absolute inset-x-2 top-12 h-px bg-noir-ink/40" />
                <div className="absolute inset-x-2 top-16 h-px bg-noir-ink/40" />
                <div className="absolute inset-x-2 top-20 h-px bg-noir-ink/40" />
              </div>
              {/* collar */}
              <div className="mx-auto w-28 h-4 bg-gradient-to-b from-noir-brass to-noir-umber rounded-sm border-2 border-noir-ink shadow-md" />
              {/* GIANT stamp head */}
              <div className="mx-auto w-64 h-28 bg-gradient-to-b from-noir-umber via-[#4a3826] to-noir-coffee rounded-lg border-2 border-noir-ink shadow-[0_12px_30px_rgba(0,0,0,0.9),inset_0_3px_6px_rgba(255,200,120,0.2),inset_0_-3px_6px_rgba(0,0,0,0.4)] flex items-center justify-center relative overflow-hidden">
                {/* metallic sheen */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                <div className="text-center relative z-10">
                  <p className="font-stamp text-[10px] tracking-[0.4em] text-noir-brass font-bold">
                    ★ TEATRO ★
                  </p>
                  <p className="font-stamp text-2xl font-black text-noir-paper tracking-[0.15em] my-1">
                    CAP RESMI
                  </p>
                  <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-brass/80">
                    DEL MISTERI
                  </p>
                </div>
                {/* side bolts */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-noir-brass border border-noir-ink" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-noir-brass border border-noir-ink" />
              </div>
              {/* rubber face (the part that stamps) — wider than head */}
              <div className="mx-auto w-60 h-4 -mt-1 bg-gradient-to-b from-noir-ink to-[#0a0807] rounded-sm border-2 border-noir-coffee shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />
            </motion.div>
          </button>

          {/* paper receiving pad — extra top margin to fit giant stamp slam */}
          <div className="relative mt-20 w-[min(92vw,640px)]">
            <div className="paper-texture paper-edge paper-burn rounded-sm p-8 sm:p-14 min-h-[260px] flex flex-col items-center justify-center relative overflow-hidden">
              {/* paper lines */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent 0px, transparent 27px, rgba(120,90,50,0.3) 27px, rgba(120,90,50,0.3) 28px)",
                }}
              />

              {/* instruction when not stamped */}
              <AnimatePresence mode="wait">
                {!stamped ? (
                  <motion.div
                    key="instructions"
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative z-10 text-center"
                  >
                    <p className="font-typewriter text-xs text-noir-paper-ink/60 mb-2">
                      Dokumen belum ditandatangani.
                    </p>
                    <p className="font-stamp text-sm tracking-[0.2em] text-noir-paper-ink/80">
                      ↓ TEKAN CAP DI ATAS ↓
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="stamped"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative z-10 text-center"
                  >
                    {/* the ink impression — giant */}
                    <div className="stamp-slam inline-block stamp-texture">
                      <div className="border-[4px] border-noir-crimson rounded-full px-10 py-5 sm:px-16 sm:py-8 -rotate-12 relative">
                        <div className="absolute inset-1.5 border-2 border-noir-crimson/40 rounded-full" />
                        <p className="font-stamp text-[11px] sm:text-sm tracking-[0.35em] text-noir-crimson font-bold mb-2">
                          ★ TEATRO DEL MISTERI ★
                        </p>
                        <p className="font-stamp text-3xl sm:text-5xl font-black stamp-ink leading-none mb-1">
                          BERGABUNG
                        </p>
                        <p className="font-stamp text-2xl sm:text-4xl font-black stamp-ink leading-none">
                          DALAM GAME
                        </p>
                        <p className="font-stamp text-[9px] sm:text-[10px] tracking-[0.25em] text-noir-crimson/80 font-bold mt-2">
                          DISETUJUI · {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <p className="font-typewriter text-[11px] text-noir-paper-ink/60 mt-4">
                      Kontrak #{String(count).padStart(4, "0")} · Tertanda
                    </p>
                    <button
                      onClick={reset}
                      data-cursor-active
                      className="mt-3 font-typewriter text-[10px] text-noir-crimson hover:text-noir-blood underline underline-offset-2"
                    >
                      cap ulang
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* corner perforations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-noir-paper-ink/20" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-noir-paper-ink/20" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-noir-paper-ink/20" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-noir-paper-ink/20" />

              {/* coffee stain */}
              <div className="absolute bottom-3 right-8 w-12 h-12 rounded-full bg-noir-umber/20 blur-[2px] opacity-40" />
            </div>
          </div>
        </div>

        {/* post-stamp CTA */}
        <AnimatePresence>
          {stamped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10"
            >
              <a
                href="#berkas"
                onClick={() => playClick()}
                data-cursor-active
                className="inline-flex items-center gap-3 px-8 py-4 font-stamp text-sm tracking-[0.2em] uppercase text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-colors shadow-[0_8px_30px_rgba(201,163,90,0.4)]"
              >
                <span>Mulai Penyelidikan</span>
                <span className="text-lg">→</span>
              </a>
              <p className="font-typewriter text-[11px] text-noir-paper/50 mt-4">
                Selamat datang, Detektif. Kasus pertama menunggumu.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
