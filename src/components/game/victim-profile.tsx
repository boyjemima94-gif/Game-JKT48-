"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VICTIM } from "@/lib/interrogations";
import { SUSPECTS } from "@/lib/suspects";
import { playClick, playPaperRustle } from "@/lib/audio";

export default function VictimProfile() {
  const [revealed, setRevealed] = useState(false);

  const suspectName = (id: string) =>
    SUSPECTS.find((s) => s.id === id)?.name ?? "—";
  const suspectCodename = (id: string) =>
    SUSPECTS.find((s) => s.id === id)?.codename ?? "—";

  return (
    <section
      id="korban"
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      aria-label="Profil Korban"
    >
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-crimson uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Korban ·
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3"
            style={{
              textShadow:
                "0 0 24px rgba(192,57,43,0.3), 0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            SIAPA KORBAN?
          </h2>
          <p className="font-typewriter text-sm sm:text-base text-noir-paper/85 max-w-lg mx-auto">
            Sebelum menuduh, kenali siapa yang meregang nyawa. Setiap tersangka
            punya hubungan dengannya.
          </p>
        </motion.div>

        {/* case file folder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* folder tab */}
          <div className="flex items-end gap-2 mb-1">
            <div className="px-4 py-1.5 bg-noir-coffee border-2 border-noir-umber/70 border-b-0 rounded-t-sm">
              <span className="font-stamp text-[10px] tracking-[0.3em] text-noir-brass uppercase font-bold">
                BERKAS KORBAN
              </span>
            </div>
            <div className="px-3 py-1.5 bg-noir-coal border border-noir-coffee/60 border-b-0 rounded-t-sm">
              <span className="font-stamp text-[9px] tracking-widest text-noir-paper/40 uppercase">
                RAHASIA
              </span>
            </div>
          </div>

          {/* folder body */}
          <div className="relative paper-texture paper-edge paper-burn border-2 border-noir-umber/70 rounded-sm overflow-hidden">
            {/* tape */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-5 tape -rotate-2 z-10" />

            {!revealed ? (
              /* redacted state */
              <div className="p-8 sm:p-12 text-center min-h-[280px] flex flex-col items-center justify-center">
                <div className="text-6xl mb-4 opacity-50">📇</div>
                <p className="font-stamp text-lg font-black text-noir-paper-ink mb-2">
                  BERKAS TERSEGEL
                </p>
                <p className="font-typewriter text-xs text-noir-paper-ink/60 max-w-sm mb-6">
                  Identitas korban dan detail hubungannya dengan para tersangka
                  tersembunyi di balik segel ini.
                </p>
                <div className="inline-block border-2 border-noir-crimson rounded-full px-6 py-2 -rotate-6 mb-6 stamp-texture">
                  <p className="font-stamp text-xs tracking-[0.25em] text-noir-crimson font-bold">
                    ✖ RAHASIA ✖
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      playPaperRustle(0.7, 0.6);
                      setRevealed(true);
                    }}
                    data-cursor-active
                    className="px-6 py-2.5 font-stamp text-xs tracking-[0.2em] uppercase text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-colors shadow-md"
                  >
                    📂 BUKA BERKAS
                  </button>
                </div>
              </div>
            ) : (
              /* revealed state */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-5 sm:p-7"
              >
                {/* victim header */}
                <div className="flex flex-col sm:flex-row gap-5 mb-6">
                  {/* portrait — using a stylized silhouette since victim is fictional */}
                  <div className="shrink-0 mx-auto sm:mx-0 w-28 h-36 sm:w-32 sm:h-40 bg-noir-coal border-2 border-noir-paper-ink/40 overflow-hidden relative">
                    {/* silhouette */}
                    <div className="absolute inset-0 flex items-end justify-center">
                      <svg
                        viewBox="0 0 100 120"
                        className="w-full h-full"
                        preserveAspectRatio="xMidYMax meet"
                      >
                        <circle cx="50" cy="32" r="18" fill="#3a2c20" />
                        <path
                          d="M 20 120 Q 20 60 50 55 Q 80 60 80 120 Z"
                          fill="#3a2c20"
                        />
                        {/* hat */}
                        <path
                          d="M 28 28 Q 28 14 50 14 Q 72 14 72 28 L 72 32 L 28 32 Z"
                          fill="#211a14"
                        />
                        <rect x="24" y="30" width="52" height="3" fill="#211a14" />
                      </svg>
                    </div>
                    {/* red stamp */}
                    <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-noir-crimson/90 -rotate-6">
                      <span className="font-stamp text-[7px] tracking-widest text-noir-paper font-bold">
                        KORBAN
                      </span>
                    </div>
                    {/* deceased line */}
                    <div className="absolute inset-x-0 bottom-0 bg-noir-ink/90 px-1 py-0.5">
                      <p className="font-stamp text-[8px] tracking-widest text-noir-crimson text-center font-bold">
                        † MENINGGAL
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="font-stamp text-[9px] tracking-[0.3em] text-noir-crimson font-bold uppercase mb-1">
                      Identitas Korban
                    </p>
                    <h3 className="font-stamp text-xl sm:text-2xl font-black text-noir-paper-ink leading-tight mb-1">
                      {VICTIM.name}
                    </h3>
                    <p className="font-typewriter text-[11px] text-noir-paper-ink/70 mb-3">
                      {VICTIM.role} · {VICTIM.age} tahun
                    </p>
                    <div className="space-y-2 text-[11px] font-typewriter">
                      <div>
                        <span className="text-noir-crimson font-bold">
                          PENYEBAB:
                        </span>{" "}
                        <span className="text-noir-paper-ink/90">
                          {VICTIM.causeOfDeath}
                        </span>
                      </div>
                      <div className="border-l-2 border-noir-crimson pl-2">
                        <span className="text-noir-crimson font-bold">
                          KATA TERAKHIR:
                        </span>
                        <p className="italic text-noir-paper-ink/80 mt-0.5">
                          &ldquo;{VICTIM.lastWords}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* background */}
                <div className="mb-5 border-t border-noir-paper-ink/20 pt-4">
                  <p className="font-stamp text-[9px] tracking-[0.25em] text-noir-crimson font-bold mb-1.5">
                    LATAR BELAKANG
                  </p>
                  <p className="font-typewriter text-xs sm:text-sm text-noir-paper-ink/90 leading-relaxed">
                    {VICTIM.background}
                  </p>
                </div>

                {/* relationships with suspects */}
                <div className="border-t border-noir-paper-ink/20 pt-4">
                  <p className="font-stamp text-[9px] tracking-[0.25em] text-noir-crimson font-bold mb-2">
                    HUBUNGAN DENGAN TERSANGKA
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {VICTIM.relationships.map((rel, i) => (
                      <motion.div
                        key={rel.suspectId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="flex items-start gap-2 p-2 border border-noir-paper-ink/20 bg-noir-paper/30"
                      >
                        <span className="text-noir-crimson mt-0.5">▸</span>
                        <div>
                          <p className="font-stamp text-[11px] font-bold text-noir-paper-ink">
                            {suspectName(rel.suspectId)}
                          </p>
                          <p className="font-typewriter text-[9px] text-noir-brass tracking-widest uppercase mb-0.5">
                            {suspectCodename(rel.suspectId)}
                          </p>
                          <p className="font-typewriter text-[11px] text-noir-paper-ink/80 leading-snug">
                            {rel.relation}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* footer */}
                <div className="mt-5 pt-3 border-t border-noir-paper-ink/20 flex items-center justify-between">
                  <span className="font-typewriter text-[10px] text-noir-paper-ink/50">
                    Setiap tersangka punya alasan. Tapi hanya satu yang
                    melakukannya.
                  </span>
                  <button
                    onClick={() => {
                      playClick();
                      setRevealed(false);
                    }}
                    data-cursor-active
                    className="font-typewriter text-[10px] text-noir-crimson hover:text-noir-blood underline underline-offset-2"
                  >
                    tutup berkas
                  </button>
                </div>
              </motion.div>
            )}

            {/* coffee stain decoration */}
            <div className="absolute bottom-3 right-6 w-14 h-14 rounded-full bg-noir-umber/20 blur-[2px] opacity-40 pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
