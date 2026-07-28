"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CASE_FILES, type CaseFile } from "@/lib/suspects";
import { playPaperRustle, playClick } from "@/lib/audio";

const STATUS_COLORS: Record<CaseFile["status"], string> = {
  TERBUKA: "border-noir-brass text-noir-brass",
  "DALAM SIKLUS": "border-orange-500 text-orange-400",
  RAHASIA: "border-noir-crimson text-noir-crimson",
};

function CaseFileCard({ file, index }: { file: CaseFile; index: number }) {
  const [flipped, setFlipped] = useState(false);

  const toggle = useCallback(() => {
    setFlipped((f) => {
      if (!f) playPaperRustle(0.9, 0.8);
      else playPaperRustle(0.5, 0.5);
      return !f;
    });
    playClick();
  }, []);

  return (
    <div className="flip-scene relative h-[420px] sm:h-[460px]">
      <motion.div
        className={`flip-card relative w-full h-full cursor-none`}
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        aria-label={`Berkas ${file.code}: ${file.title}. ${flipped ? "Tutup" : "Buka"}.`}
        data-cursor-active
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: index * 0.12 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* ---------- FRONT (classified) ---------- */}
        <div className="flip-face absolute inset-0 paper-texture paper-edge paper-burn rounded-sm p-6 flex flex-col">
          {/* corner stamps */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col gap-1">
              <span className="font-stamp text-[10px] tracking-[0.3em] text-noir-paper-ink/60">
                ARSIP TEATRO
              </span>
              <span className="font-stamp text-2xl font-black text-noir-paper-ink">
                {file.code}
              </span>
            </div>
            <div
              className={`px-2 py-1 border-2 ${STATUS_COLORS[file.status]} rotate-3`}
            >
              <span className="font-stamp text-[10px] tracking-[0.2em] font-bold">
                {file.status}
              </span>
            </div>
          </div>

          {/* center classification stamp */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 blur-sm opacity-60">
                <div className="border-4 border-noir-crimson rounded-full w-32 h-32 flex items-center justify-center -rotate-12" />
              </div>
              <div className="border-4 border-noir-crimson rounded-full w-32 h-32 flex items-center justify-center -rotate-12 stamp-texture">
                <div className="text-center">
                  <p className="font-stamp text-[8px] tracking-[0.2em] text-noir-crimson font-bold">
                    JANGAN
                  </p>
                  <p className="font-stamp text-lg font-black text-noir-crimson leading-none my-1">
                    BUKA
                  </p>
                  <p className="font-stamp text-[8px] tracking-[0.2em] text-noir-crimson font-bold">
                    SEBELUM
                  </p>
                  <p className="font-stamp text-[8px] tracking-[0.2em] text-noir-crimson font-bold">
                    WAKTUNYA
                  </p>
                </div>
              </div>
            </div>

            <h3 className="font-stamp text-xl font-black text-noir-paper-ink mb-1">
              {file.title}
            </h3>
            <p className="font-typewriter text-xs text-noir-paper-ink/60">
              {file.date} · {file.location}
            </p>
          </div>

          {/* footer hint */}
          <div className="mt-auto pt-4 border-t border-noir-paper-ink/20">
            <div className="flex items-center justify-between">
              <span className="font-typewriter text-[10px] text-noir-paper-ink/50">
                {String(index + 1).padStart(2, "0")} / 03
              </span>
              <span className="font-typewriter text-[10px] text-noir-crimson animate-pulse">
                ↻ Balik untuk membuka
              </span>
            </div>
            {/* coffee stain */}
            <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-noir-umber/30 blur-[2px] opacity-50" />
          </div>

          {/* tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 tape rotate-2" />
        </div>

        {/* ---------- BACK (details) ---------- */}
        <div className="flip-face flip-face-back absolute inset-0 paper-texture paper-edge paper-burn rounded-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-noir-paper-ink/20 pb-2">
            <span className="font-stamp text-[10px] tracking-[0.25em] text-noir-paper-ink/60">
              {file.code} · DETAIL
            </span>
            <span
              className={`px-1.5 py-0.5 border ${STATUS_COLORS[file.status]} font-stamp text-[9px] tracking-wider`}
            >
              {file.status}
            </span>
          </div>

          <h3 className="font-stamp text-lg font-black text-noir-paper-ink mb-1">
            {file.title}
          </h3>
          <p className="font-typewriter text-[11px] text-noir-paper-ink/70 mb-3">
            {file.date} · {file.location}
          </p>

          <div className="mb-3">
            <p className="font-stamp text-[9px] tracking-[0.2em] text-noir-crimson font-bold mb-1">
              KORBAN
            </p>
            <p className="font-typewriter text-xs text-noir-paper-ink">{file.victim}</p>
          </div>

          <div className="mb-3 flex-1">
            <p className="font-stamp text-[9px] tracking-[0.2em] text-noir-crimson font-bold mb-1">
              KRONOLOGI
            </p>
            <p className="font-typewriter text-[11px] leading-relaxed text-noir-paper-ink/90">
              {file.summary}
            </p>
          </div>

          <div className="mb-3">
            <p className="font-stamp text-[9px] tracking-[0.2em] text-noir-crimson font-bold mb-1">
              PETUNJUK
            </p>
            <ul className="space-y-1">
              {file.clues.map((c, i) => (
                <li
                  key={i}
                  className="font-typewriter text-[11px] text-noir-paper-ink/80 flex gap-2"
                >
                  <span className="text-noir-crimson">▸</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-3 border-t border-noir-paper-ink/20 flex items-center justify-between">
            <span className="font-typewriter text-[10px] text-noir-paper-ink/50">
              TTD. Detektif R.
            </span>
            <span className="font-typewriter text-[10px] text-noir-crimson animate-pulse">
              ↻ Balik kembali
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CaseFileSection() {
  return (
    <section
      id="berkas"
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      aria-label="Berkas Kasus"
    >
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-stamp text-[10px] tracking-[0.4em] text-noir-brass uppercase">
            · Berkas Terklasifikasi ·
          </span>
          <h2 className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3">
            BUKA BERKAS KASUS
          </h2>
          <p className="font-typewriter text-sm text-noir-paper/60 max-w-lg mx-auto">
            Setiap ampas kertas menyimpan kebenaran yang berbeda. Balik untuk
            mengungkap kronologi, petunjuk, dan status penyelidikan.
          </p>
        </motion.div>

        {/* cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {CASE_FILES.map((f, i) => (
            <CaseFileCard key={f.id} file={f} index={i} />
          ))}
        </div>

        {/* desk label */}
        <div className="mt-12 flex items-center justify-center gap-3 text-noir-paper/40">
          <div className="h-px w-12 bg-noir-paper/20" />
          <span className="font-typewriter text-[10px] tracking-[0.3em] uppercase">
            Meja Detektif · Lantai 2
          </span>
          <div className="h-px w-12 bg-noir-paper/20" />
        </div>
      </div>
    </section>
  );
}
