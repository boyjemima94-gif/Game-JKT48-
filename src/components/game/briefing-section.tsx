"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { playClick, playPaperRustle } from "@/lib/audio";

const BRIEFING_LINES = [
  ">> SISTEM: Penyalaan arsip... berhasil.",
  ">> KASUS #JKT-48-001 — INSIDEN PANGGUNG UTAMA",
  ">> Lokasi: Theater JKT48, Lantai 2. 23:17 WIB.",
  ">> Korban: M — Produser Senior. Ditemukan tak sadar.",
  ">> CCTV panggung mati 9 menit. Tidak ada saksi langsung.",
  ">> Empat tersangka. Empat motif. Satu kebenaran.",
  ">> Detektif ditugaskan: [ANDA]",
  ">> Instruksi: Periksa berkas. Tarik benang. Temukan pelaku.",
  ">> SISTEM: Lampu menyala. Penyelidikan dimulai.",
];

export default function BriefingSection() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // start typing when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  // typewriter effect
  useEffect(() => {
    if (!started) return;
    if (visibleLines >= BRIEFING_LINES.length) return;
    const fullLine = BRIEFING_LINES[visibleLines];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(fullLine.slice(0, i));
      if (i >= fullLine.length) {
        clearInterval(interval);
        setTimeout(() => {
          setVisibleLines((v) => v + 1);
          setTyped("");
        }, 280);
      }
    }, 24);
    return () => clearInterval(interval);
  }, [visibleLines, started]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      aria-label="Briefing Kasus"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="font-stamp text-[10px] tracking-[0.4em] text-noir-brass uppercase">
            · Terminal Detektif ·
          </span>
          <h2 className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3">
            BRIEFING KASUS
          </h2>
        </motion.div>

        {/* terminal window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-noir-coal border-2 border-noir-umber/60 rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* terminal header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-noir-coffee/60 border-b border-noir-umber/60">
            <span className="w-3 h-3 rounded-full bg-noir-crimson/80" />
            <span className="w-3 h-3 rounded-full bg-noir-brass/80" />
            <span className="w-3 h-3 rounded-full bg-green-600/60" />
            <span className="ml-3 font-typewriter text-[11px] tracking-widest text-noir-brass/80 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
              teatro@detective:~/kasus/JKT-48-001
            </span>
            {/* skip / replay control */}
            {visibleLines < BRIEFING_LINES.length ? (
              <button
                onClick={() => {
                  playClick();
                  setVisibleLines(BRIEFING_LINES.length);
                  setTyped("");
                }}
                data-cursor-active
                aria-label="Lewati animasi ketik"
                className="ml-auto font-stamp text-[10px] tracking-widest text-noir-paper/50 hover:text-noir-brass transition-colors px-2 py-0.5 border border-noir-paper/20 hover:border-noir-brass/60"
              >
                ⏭ LEWATI
              </button>
            ) : (
              <button
                onClick={() => {
                  playClick();
                  setVisibleLines(0);
                  setTyped("");
                  setStarted(false);
                  // re-trigger via observer on next tick
                  requestAnimationFrame(() => setStarted(true));
                }}
                data-cursor-active
                aria-label="Putar ulang briefing"
                className="ml-auto font-stamp text-[10px] tracking-widest text-noir-paper/50 hover:text-noir-brass transition-colors px-2 py-0.5 border border-noir-paper/20 hover:border-noir-brass/60"
              >
                ↻ ULANG
              </button>
            )}
          </div>

          {/* terminal body */}
          <div className="p-5 sm:p-6 font-typewriter text-xs sm:text-sm min-h-[280px] bg-noir-ink/80">
            {BRIEFING_LINES.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className={`mb-1.5 ${
                  line.startsWith(">> SISTEM")
                    ? "text-green-400/80"
                    : line.startsWith(">> KASUS")
                    ? "text-noir-crimson font-bold"
                    : line.startsWith(">> Detektif")
                    ? "text-noir-brass font-bold"
                    : line.startsWith(">> Instruksi")
                    ? "text-noir-tungsten"
                    : "text-noir-paper/80"
                }`}
              >
                {line}
              </div>
            ))}
            {visibleLines < BRIEFING_LINES.length && (
              <div className="text-noir-paper/90">
                {typed}
                <span className="caret" />
              </div>
            )}
            {visibleLines >= BRIEFING_LINES.length && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => {
                  playClick();
                  playPaperRustle(0.4, 0.4);
                  document
                    .getElementById("berkas")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                data-cursor-active
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-noir-brass/60 text-noir-brass hover:bg-noir-brass/10 transition-colors font-stamp text-[11px] tracking-widest"
              >
                LANJUT KE BERKAS →
              </motion.button>
            )}
          </div>

          {/* scanline overlay (animated drift) */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 3px)",
            }}
          >
            {/* moving scanline beam */}
            <div
              className="absolute inset-x-0 h-8"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(255,203,122,0.08) 50%, transparent 100%)",
                animation: "crt-scan 4s linear infinite",
              }}
            />
          </div>
          {/* CRT glow + flicker */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
            }}
          />
          {/* CRT screen curvature subtle edge */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              boxShadow:
                "inset 0 0 60px rgba(0,0,0,0.6), inset 0 0 120px rgba(0,0,0,0.3)",
            }}
          />
        </motion.div>

        {/* flavor footer */}
        <p className="text-center font-typewriter text-[11px] text-noir-brass/60 mt-4 tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
          · Transmisi terenkripsi · Jangan dibagikan ·
        </p>
      </div>
    </section>
  );
}
