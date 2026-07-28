"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EVIDENCE_ITEMS, useGame } from "@/lib/game-store";
import { playClick, playPaperRustle } from "@/lib/audio";

const CATEGORY_LABELS: Record<string, string> = {
  fisik: "BARANG BUKTI FISIK",
  digital: "BUKTI DIGITAL",
  dokumen: "DOKUMEN",
  biologis: "BAHAN BIOLOGIS",
};

const CATEGORY_COLORS: Record<string, string> = {
  fisik: "border-noir-brass text-noir-brass",
  digital: "border-cyan-500 text-cyan-400",
  dokumen: "border-noir-paper-ink text-noir-paper-ink",
  biologis: "border-green-600 text-green-500",
};

export default function EvidenceLocker() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const examinedEvidence = useGame((s) => s.examinedEvidence);
  const examineEvidence = useGame((s) => s.examineEvidence);

  const activeItem = EVIDENCE_ITEMS.find((e) => e.id === activeId);
  const examinedCount = Object.keys(examinedEvidence).length;

  const openDetail = (id: string) => {
    playClick();
    setActiveId(id);
    if (!examinedEvidence[id]) {
      setTimeout(() => {
        examineEvidence(id);
        playPaperRustle(0.6, 0.5);
      }, 400);
    }
  };

  return (
    <section
      id="bukti"
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      aria-label="Loker Bukti"
    >
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Loker Bukti ·
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3"
            style={{
              textShadow:
                "0 0 24px rgba(255,179,71,0.25), 0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            PEMERIKSAAN BUKTI
          </h2>
          <p className="font-typewriter text-sm sm:text-base text-noir-paper/85 max-w-lg mx-auto">
            Klik setiap barang bukti untuk memeriksa detailnya. Setiap bukti
            yang diperiksa otomatis masuk ke buku catatan detektif.
          </p>
          {/* progress */}
          <div className="inline-flex items-center gap-3 mt-5 px-4 py-2 border border-noir-brass/40 bg-noir-coal/60">
            <span className="font-stamp text-[11px] tracking-widest text-noir-brass">
              BUKTI DIPERIKSA
            </span>
            <div className="flex gap-1">
              {EVIDENCE_ITEMS.map((e) => (
                <span
                  key={e.id}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    examinedEvidence[e.id]
                      ? "bg-noir-brass shadow-[0_0_6px_rgba(201,163,90,0.8)]"
                      : "bg-noir-paper/15"
                  }`}
                />
              ))}
            </div>
            <span className="font-typewriter text-xs text-noir-paper/70 font-mono">
              {examinedCount}/{EVIDENCE_ITEMS.length}
            </span>
          </div>
        </motion.div>

        {/* evidence grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {EVIDENCE_ITEMS.map((ev, i) => {
            const examined = !!examinedEvidence[ev.id];
            return (
              <motion.button
                key={ev.id}
                type="button"
                onClick={() => openDetail(ev.id)}
                data-cursor-active
                aria-label={`Periksa bukti: ${ev.name}`}
                className="group relative aspect-[3/4] focus:outline-none"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
              >
                {/* evidence bag / locker cell */}
                <div
                  className={`relative w-full h-full border-2 ${
                    examined
                      ? "border-noir-brass/70 bg-noir-brass/5"
                      : "border-noir-coffee/70 bg-noir-coal/80"
                  } transition-colors overflow-hidden`}
                >
                  {/* cell number */}
                  <div className="absolute top-1.5 left-1.5 z-10">
                    <span className="font-stamp text-[9px] tracking-widest text-noir-brass/70">
                      #{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {/* examined stamp */}
                  {examined && (
                    <div className="absolute top-1.5 right-1.5 z-10 rotate-12">
                      <span className="font-stamp text-[7px] tracking-widest text-noir-crimson font-bold border border-noir-crimson px-1">
                        DIPERIKSA
                      </span>
                    </div>
                  )}
                  {/* glyph */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-5xl sm:text-6xl transition-transform duration-300 group-hover:scale-110"
                      style={{
                        filter: examined
                          ? "drop-shadow(0 0 12px rgba(201,163,90,0.5))"
                          : "grayscale(0.6) brightness(0.7)",
                      }}
                    >
                      {ev.glyph}
                    </span>
                  </div>
                  {/* category badge */}
                  <div className="absolute bottom-1.5 inset-x-1.5">
                    <span
                      className={`block text-center font-stamp text-[7px] sm:text-[8px] tracking-widest border ${CATEGORY_COLORS[ev.category]} py-0.5 bg-noir-ink/80`}
                    >
                      {ev.category.toUpperCase()}
                    </span>
                  </div>
                  {/* scanline when not examined */}
                  {!examined && (
                    <div
                      className="absolute inset-0 opacity-30 pointer-events-none"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.4) 3px, rgba(0,0,0,0.4) 4px)",
                      }}
                    />
                  )}
                  {/* hover instruction */}
                  <div className="absolute inset-0 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="font-stamp text-[8px] tracking-widest text-noir-brass bg-noir-ink/90 px-2 py-1">
                      🔍 PERIKSA
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* detail modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              playClick();
              setActiveId(null);
            }}
          >
            <div className="absolute inset-0 bg-noir-ink/95 backdrop-blur-sm" />
            <motion.div
              key={activeItem.id}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative paper-texture paper-edge paper-burn rounded-sm max-w-2xl w-full p-6 sm:p-8"
            >
              {/* close */}
              <button
                onClick={() => {
                  playClick();
                  setActiveId(null);
                }}
                data-cursor-active
                aria-label="Tutup"
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-noir-paper-ink/60 hover:text-noir-crimson transition-colors font-stamp text-xl"
              >
                ✕
              </button>

              {/* evidence tag */}
              <div className="flex items-center gap-2 mb-4">
                <span className="font-stamp text-[10px] tracking-[0.3em] text-noir-crimson font-bold border border-noir-crimson px-2 py-0.5">
                  BUKTI #{EVIDENCE_ITEMS.findIndex((e) => e.id === activeItem.id) + 1}
                </span>
                <span
                  className={`font-stamp text-[10px] tracking-widest border ${CATEGORY_COLORS[activeItem.category]} px-2 py-0.5 bg-noir-ink/10`}
                >
                  {CATEGORY_LABELS[activeItem.category]}
                </span>
                {examinedEvidence[activeItem.id] && (
                  <span className="font-stamp text-[10px] tracking-widest text-noir-brass font-bold ml-auto">
                    ✓ DICATAT
                  </span>
                )}
              </div>

              {/* glyph + name */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center border-2 border-noir-paper-ink/30 bg-noir-coal/10 shrink-0">
                  <span className="text-5xl sm:text-6xl">{activeItem.glyph}</span>
                </div>
                <div>
                  <h3 className="font-stamp text-2xl sm:text-3xl font-black text-noir-paper-ink leading-tight">
                    {activeItem.name}
                  </h3>
                  <p className="font-typewriter text-[11px] text-noir-paper-ink/60 mt-1">
                    Dikumpulkan dari TKP · Diperiksa di Lab Forensik
                  </p>
                </div>
              </div>

              {/* description */}
              <div className="mb-4">
                <p className="font-stamp text-[9px] tracking-[0.25em] text-noir-crimson font-bold mb-1">
                  DESKRIPSI AWAL
                </p>
                <p className="font-typewriter text-sm text-noir-paper-ink/90 leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

              {/* detailed analysis */}
              <div className="mb-4 border-t border-noir-paper-ink/20 pt-4">
                <p className="font-stamp text-[9px] tracking-[0.25em] text-noir-crimson font-bold mb-1">
                  ANALISIS FORENSIK 🔍
                </p>
                <p className="font-typewriter text-sm text-noir-paper-ink/90 leading-relaxed">
                  {activeItem.detail}
                </p>
              </div>

              {/* footer */}
              <div className="flex items-center justify-between pt-4 border-t border-noir-paper-ink/20">
                <span className="font-typewriter text-[10px] text-noir-paper-ink/50">
                  {examinedEvidence[activeItem.id]
                    ? "Bukti ini telah dicatat di buku catatan."
                    : "Mencatat ke buku..."}
                </span>
                <button
                  onClick={() => {
                    playClick();
                    setActiveId(null);
                  }}
                  data-cursor-active
                  className="font-stamp text-[11px] tracking-widest text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-colors px-4 py-2"
                >
                  TUTUP →
                </button>
              </div>

              {/* corner stamp */}
              <div className="absolute top-3 left-3 font-stamp text-[8px] tracking-widest text-noir-crimson/60 -rotate-6 border border-noir-crimson/40 px-1.5 py-0.5">
                FORENSIK
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
