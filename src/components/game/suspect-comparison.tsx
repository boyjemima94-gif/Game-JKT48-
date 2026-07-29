"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SUSPECTS } from "@/lib/suspects";
import { useGame } from "@/lib/game-store";
import { INTERROGATIONS } from "@/lib/interrogations";
import { playClick } from "@/lib/audio";

/**
 * Suspect Comparison Tool — side-by-side comparison of two suspects'
 * alibis, motives, evidence, and interrogation status.
 * Helps players deduce contradictions and identify the culprit.
 */
export default function SuspectComparison() {
  const [leftId, setLeftId] = useState<string>(SUSPECTS[0].id);
  const [rightId, setRightId] = useState<string>(SUSPECTS[1].id);
  const interrogatedSuspects = useGame((s) => s.interrogatedSuspects);
  const clues = useGame((s) => s.clues);

  const left = SUSPECTS.find((s) => s.id === leftId)!;
  const right = SUSPECTS.find((s) => s.id === rightId)!;

  const leftClues = clues.filter((c) => c.suspectId === leftId);
  const rightClues = clues.filter((c) => c.suspectId === rightId);
  const leftInterrogated = !!interrogatedSuspects[leftId];
  const rightInterrogated = !!interrogatedSuspects[rightId];

  const leftTree = INTERROGATIONS[leftId];
  const rightTree = INTERROGATIONS[rightId];

  // Compare fields
  const comparisons = [
    {
      label: "Peran",
      left: left.role,
      right: right.role,
    },
    {
      label: "Usia",
      left: `${left.age} thn`,
      right: `${right.age} thn`,
    },
    {
      label: "Tinggi",
      left: left.height,
      right: right.height,
    },
    {
      label: "Ancaman",
      left: "●".repeat(left.threat) + "○".repeat(5 - left.threat),
      right: "●".repeat(right.threat) + "○".repeat(5 - right.threat),
    },
    {
      label: "Terakhir Dilihat",
      left: left.lastSeen,
      right: right.lastSeen,
    },
    {
      label: "Alibi",
      left: left.alibi,
      right: right.alibi,
    },
    {
      label: "Motif",
      left: left.motive,
      right: right.motive,
    },
  ];

  return (
    <section
      id="banding"
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      aria-label="Banding Tersangka"
    >
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Alat Deduksi ·
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3"
            style={{
              textShadow:
                "0 0 24px rgba(255,179,71,0.25), 0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            BANDING TERSANGKA
          </h2>
          <p className="font-typewriter text-sm text-noir-paper/70 max-w-lg mx-auto">
            Bandingkan dua tersangka berdampingan untuk menemukan kontradiksi
            dan mengungkap pelaku.
          </p>
        </motion.div>

        {/* selectors */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-6">
          <SuspectSelector
            label="KIRI"
            selectedId={leftId}
            onSelect={(id) => {
              playClick();
              if (id === rightId) {
                // swap if same
                setRightId(leftId);
              }
              setLeftId(id);
            }}
            excludeId={rightId}
          />
          <SuspectSelector
            label="KANAN"
            selectedId={rightId}
            onSelect={(id) => {
              playClick();
              if (id === leftId) {
                setLeftId(rightId);
              }
              setRightId(id);
            }}
            excludeId={leftId}
          />
        </div>

        {/* comparison grid */}
        <div className="paper-texture paper-edge paper-burn p-4 sm:p-6">
          {/* portraits row */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-4 pb-4 border-b-2 border-noir-paper-ink/20">
            {[left, right].map((s) => (
              <div key={s.id} className="text-center">
                <div className="w-20 h-28 sm:w-24 sm:h-32 mx-auto border-2 border-noir-paper-ink/40 overflow-hidden mb-2">
                  <img
                    src={s.portrait}
                    alt={s.name}
                    className="w-full h-full object-cover suspect-portrait"
                  />
                </div>
                <p className="font-stamp text-sm sm:text-base font-black text-noir-paper-ink">
                  {s.name}
                </p>
                <p className="font-stamp text-[10px] tracking-widest text-noir-crimson">
                  {s.codename}
                </p>
              </div>
            ))}
          </div>

          {/* comparison rows */}
          <div className="space-y-3">
            {comparisons.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-[auto_1fr_1fr] gap-2 sm:gap-4 items-start text-[11px] sm:text-xs"
              >
                <div className="font-stamp text-[9px] tracking-widest text-noir-crimson font-bold uppercase pt-1 w-20 sm:w-28 shrink-0">
                  {row.label}
                </div>
                <div
                  className={`font-typewriter text-noir-paper-ink/85 p-2 border-l-2 ${
                    row.left === row.right
                      ? "border-orange-500 bg-orange-500/5"
                      : "border-noir-brass/40"
                  }`}
                >
                  {row.left}
                  {row.label === "Alibi" && row.left === row.right && (
                    <span className="block text-[9px] text-orange-600 font-bold mt-1">
                      ⚠ SAMA
                    </span>
                  )}
                </div>
                <div
                  className={`font-typewriter text-noir-paper-ink/85 p-2 border-l-2 ${
                    row.left === row.right
                      ? "border-orange-500 bg-orange-500/5"
                      : "border-noir-crimson/40"
                  }`}
                >
                  {row.right}
                </div>
              </motion.div>
            ))}

            {/* interrogation status */}
            <div className="grid grid-cols-[auto_1fr_1fr] gap-2 sm:gap-4 items-start text-[11px] sm:text-xs pt-3 border-t border-noir-paper-ink/15">
              <div className="font-stamp text-[9px] tracking-widest text-noir-crimson font-bold uppercase pt-1 w-20 sm:w-28 shrink-0">
                Interogasi
              </div>
              <div className="p-2 border-l-2 border-purple-500/40">
                {leftInterrogated ? (
                  <span className="text-green-700 font-bold">
                    ✓ Diinterogasi ({leftTree?.questions.length ?? 0} pertanyaan)
                  </span>
                ) : (
                  <span className="text-noir-paper-ink/40 italic">
                    Belum diinterogasi
                  </span>
                )}
              </div>
              <div className="p-2 border-l-2 border-purple-500/40">
                {rightInterrogated ? (
                  <span className="text-green-700 font-bold">
                    ✓ Diinterogasi ({rightTree?.questions.length ?? 0} pertanyaan)
                  </span>
                ) : (
                  <span className="text-noir-paper-ink/40 italic">
                    Belum diinterogasi
                  </span>
                )}
              </div>
            </div>

            {/* clues pointing to each */}
            <div className="grid grid-cols-[auto_1fr_1fr] gap-2 sm:gap-4 items-start text-[11px] sm:text-xs">
              <div className="font-stamp text-[9px] tracking-widest text-noir-crimson font-bold uppercase pt-1 w-20 sm:w-28 shrink-0">
                Petunjuk
              </div>
              <div className="p-2 border-l-2 border-noir-crimson/40">
                {leftClues.length > 0 ? (
                  <div className="space-y-1">
                    {leftClues.map((c) => (
                      <div key={c.id} className="flex gap-1">
                        <span className="text-noir-crimson">▸</span>
                        <span className="text-noir-paper-ink/80">{c.title}</span>
                      </div>
                    ))}
                    <p className="font-stamp text-[10px] font-bold text-noir-crimson mt-1">
                      {leftClues.length} petunjuk mengarah
                    </p>
                  </div>
                ) : (
                  <span className="text-noir-paper-ink/40 italic">
                    Belum ada petunjuk
                  </span>
                )}
              </div>
              <div className="p-2 border-l-2 border-noir-crimson/40">
                {rightClues.length > 0 ? (
                  <div className="space-y-1">
                    {rightClues.map((c) => (
                      <div key={c.id} className="flex gap-1">
                        <span className="text-noir-crimson">▸</span>
                        <span className="text-noir-paper-ink/80">{c.title}</span>
                      </div>
                    ))}
                    <p className="font-stamp text-[10px] font-bold text-noir-crimson mt-1">
                      {rightClues.length} petunjuk mengarah
                    </p>
                  </div>
                ) : (
                  <span className="text-noir-paper-ink/40 italic">
                    Belum ada petunjuk
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* tip */}
        <p className="text-center font-typewriter text-[10px] text-noir-paper/40 mt-4 italic">
          Baris dengan highlight oranye menandakan kesamaan antara dua tersangka —
          periksa apakah itu kebetulan atau sinyal kolusi.
        </p>
      </div>
    </section>
  );
}

function SuspectSelector({
  label,
  selectedId,
  onSelect,
  excludeId,
}: {
  label: string;
  selectedId: string;
  onSelect: (id: string) => void;
  excludeId: string;
}) {
  const selected = SUSPECTS.find((s) => s.id === selectedId)!;
  return (
    <div>
      <p className="font-stamp text-[10px] tracking-widest text-noir-brass uppercase mb-2">
        {label}
      </p>
      <div className="grid grid-cols-4 gap-1.5">
        {SUSPECTS.map((s) => {
          const isSelected = s.id === selectedId;
          const isExcluded = s.id === excludeId;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              data-cursor-active
              disabled={isExcluded}
              aria-label={`Pilih ${s.name}`}
              className={`relative aspect-square border-2 overflow-hidden transition-all ${
                isSelected
                  ? "border-noir-brass shadow-[0_0_12px_rgba(201,163,90,0.4)]"
                  : isExcluded
                  ? "border-noir-paper/10 opacity-30 cursor-not-allowed"
                  : "border-noir-coffee/50 hover:border-noir-brass/60"
              }`}
            >
              <img
                src={s.portrait}
                alt={s.name}
                className="w-full h-full object-cover"
                style={{
                  filter: isSelected
                    ? "sepia(0) contrast(1.1) brightness(1)"
                    : "sepia(0.5) brightness(0.6)",
                }}
              />
              {isSelected && (
                <div className="absolute bottom-0 inset-x-0 bg-noir-brass/90 px-1 py-0.5">
                  <p className="font-stamp text-[7px] tracking-widest text-noir-ink font-bold text-center truncate">
                    {s.codename}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
