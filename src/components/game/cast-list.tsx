"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SUSPECTS } from "@/lib/suspects";
import { playClick } from "@/lib/audio";
import TiltCard from "./tilt-card";

/**
 * Cast List — deep character profiles with 3D tilt cards.
 * Uses the rich `depth` data from suspects.ts (appearance, habits,
 * personality, career timeline, relationships, dark secret, fear, etc.)
 */
export default function CastList() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeSuspect = activeId
    ? SUSPECTS.find((s) => s.id === activeId)
    : null;

  return (
    <section
      id="tokoh"
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      aria-label="Daftar Tokoh"
    >
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Daftar Tokoh ·
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3"
            style={{
              textShadow:
                "0 0 24px rgba(255,179,71,0.25), 0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            PARA TERSANGKA
          </h2>
          <p className="font-typewriter text-sm sm:text-base text-noir-paper/85 max-w-lg mx-auto">
            Kenali lebih dalam empat bintang panggung Teatro del Misteri.
            Klik setiap tokoh untuk membaca profil lengkap — penampilan,
            kebiasaan, kepribadian, dan rahasia gelap mereka.
          </p>
        </motion.div>

        {/* cast grid with 3D tilt */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {SUSPECTS.map((s, i) => {
            const isActive = activeId === s.id;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <TiltCard maxTilt={15} scale={1.04}>
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setActiveId(isActive ? null : s.id);
                    }}
                    data-cursor-active
                    aria-label={`Baca profil ${s.name}`}
                    className="group text-left focus:outline-none w-full"
                  >
                    <div
                      className={`relative overflow-hidden border-2 transition-all ${
                        isActive
                          ? "border-noir-brass shadow-[0_0_30px_rgba(201,163,90,0.5)]"
                          : "border-noir-coffee/70 group-hover:border-noir-brass"
                      }`}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* portrait */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-noir-coal">
                        <img
                          src={s.portrait}
                          alt={s.name}
                          className="suspect-portrait w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          style={{ transform: "translateZ(30px)" }}
                        />
                        {/* gradient overlay */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(180deg, transparent 30%, rgba(10,8,7,0.95) 100%)",
                          }}
                        />
                        {/* codename top */}
                        <div
                          className="absolute top-2 left-2 px-1.5 py-0.5 bg-noir-ink/80 backdrop-blur-sm"
                          style={{ transform: "translateZ(40px)" }}
                        >
                          <span className="font-stamp text-[8px] sm:text-[9px] tracking-widest text-noir-brass font-bold">
                            {s.codename}
                          </span>
                        </div>
                        {/* role */}
                        <div
                          className="absolute top-2 right-2 px-1.5 py-0.5 bg-noir-crimson/80 backdrop-blur-sm"
                          style={{ transform: "translateZ(40px)" }}
                        >
                          <span className="font-stamp text-[7px] sm:text-[8px] tracking-widest text-noir-paper font-bold">
                            {s.role.toUpperCase()}
                          </span>
                        </div>
                        {/* personality tags */}
                        <div
                          className="absolute bottom-16 inset-x-2 flex flex-wrap gap-1"
                          style={{ transform: "translateZ(20px)" }}
                        >
                          {s.depth.personality.slice(0, 3).map((trait) => (
                            <span
                              key={trait}
                              className="px-1.5 py-0.5 bg-noir-ink/70 backdrop-blur-sm border border-noir-brass/30"
                            >
                              <span className="font-typewriter text-[7px] tracking-wider text-noir-brass/80 uppercase">
                                {trait}
                              </span>
                            </span>
                          ))}
                        </div>
                        {/* name bottom */}
                        <div
                          className="absolute bottom-0 inset-x-0 p-2"
                          style={{ transform: "translateZ(50px)" }}
                        >
                          <p className="font-stamp text-sm sm:text-base font-black text-noir-paper leading-tight">
                            {s.name}
                          </p>
                          <p className="font-typewriter text-[9px] text-noir-brass tracking-widest uppercase">
                            {s.age} thn · {s.height}
                          </p>
                        </div>
                      </div>
                      {/* quick stats bar */}
                      <div className="grid grid-cols-2 text-center bg-noir-coal/80 border-t border-noir-coffee/60">
                        <div className="py-1.5 border-r border-noir-coffee/40">
                          <p className="font-stamp text-[8px] text-noir-paper/40 tracking-widest">
                            ANCAMAN
                          </p>
                          <p className="font-stamp text-xs font-bold text-noir-crimson">
                            {"●".repeat(s.threat)}
                            <span className="text-noir-paper/20">
                              {"●".repeat(5 - s.threat)}
                            </span>
                          </p>
                        </div>
                        <div className="py-1.5">
                          <p className="font-stamp text-[8px] text-noir-paper/40 tracking-widest">
                            MOTIF
                          </p>
                          <p className="font-stamp text-xs font-bold text-noir-brass">
                            {s.threat >= 4 ? "KUAT" : s.threat >= 3 ? "SEDANG" : "LEMAH"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* deep profile panel */}
        <AnimatePresence mode="wait">
          {activeSuspect && (
            <motion.div
              key={activeSuspect.id}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <DeepProfile suspect={activeSuspect} onClose={() => setActiveId(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function DeepProfile({
  suspect,
  onClose,
}: {
  suspect: (typeof SUSPECTS)[number];
  onClose: () => void;
}) {
  const d = suspect.depth;
  return (
    <div className="paper-texture paper-edge paper-burn p-5 sm:p-7 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-5 mb-5">
        {/* portrait */}
        <div className="shrink-0 mx-auto sm:mx-0 w-28 h-36 sm:w-32 sm:h-40 border-2 border-noir-paper-ink/40 overflow-hidden">
          <img
            src={suspect.portrait}
            alt={suspect.name}
            className="w-full h-full object-cover suspect-portrait"
          />
        </div>
        {/* header */}
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
            <h3 className="font-stamp text-2xl font-black text-noir-paper-ink">
              {suspect.name}
            </h3>
            <span className="font-stamp text-[11px] tracking-widest text-noir-crimson font-bold">
              {suspect.codename}
            </span>
          </div>
          <p className="font-typewriter text-[11px] text-noir-paper-ink/60 mb-3">
            {suspect.role} · {suspect.memberOf} · {suspect.age} thn · {suspect.height}
          </p>
          {/* personality tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {d.personality.map((trait) => (
              <span
                key={trait}
                className="px-2 py-0.5 border border-noir-brass/40 bg-noir-brass/10"
              >
                <span className="font-stamp text-[9px] tracking-wider text-noir-brass uppercase font-bold">
                  {trait}
                </span>
              </span>
            ))}
          </div>
          {/* quote */}
          <p className="font-typewriter text-xs italic text-noir-paper-ink/70 border-l-2 border-noir-crimson pl-3">
            &ldquo;{suspect.quote}&rdquo; <span className="not-italic">{suspect.signature}</span>
          </p>
        </div>
      </div>

      {/* appearance */}
      <BioField label="PENAMPILAN" text={d.appearance} color="text-noir-brass" />

      {/* habits */}
      <div className="mb-3">
        <p className="font-stamp text-[9px] tracking-[0.25em] font-bold uppercase mb-1.5 text-purple-700">
          KEBIASAAN
        </p>
        <ul className="space-y-1">
          {d.habits.map((h, i) => (
            <li key={i} className="font-typewriter text-[11px] text-noir-paper-ink/85 flex gap-2">
              <span className="text-purple-700">▸</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* career timeline */}
      <div className="mb-3">
        <p className="font-stamp text-[9px] tracking-[0.25em] font-bold uppercase mb-1.5 text-noir-brass">
          KARIER
        </p>
        <div className="space-y-1.5">
          {d.careerTimeline.map((c, i) => (
            <div key={i} className="flex gap-3 text-[11px]">
              <span className="font-stamp font-bold text-noir-crimson w-12 shrink-0">
                {c.year}
              </span>
              <span className="font-typewriter text-noir-paper-ink/85">{c.event}</span>
            </div>
          ))}
        </div>
      </div>

      {/* victim relationship */}
      <BioField
        label="HUBUNGAN DENGAN KORBAN"
        text={d.victimRelationship}
        color="text-noir-crimson"
      />

      {/* suspect relationships */}
      <div className="mb-3">
        <p className="font-stamp text-[9px] tracking-[0.25em] font-bold uppercase mb-1.5 text-cyan-700">
          HUBUNGAN SESAMA TERSANGKA
        </p>
        <div className="space-y-1">
          {d.suspectRelationships.map((r, i) => {
            const other = SUSPECTS.find((s) => s.id === r.suspectId);
            return (
              <div key={i} className="flex gap-2 text-[11px]">
                <span className="font-stamp font-bold text-cyan-700 shrink-0 w-24">
                  {other?.codename ?? r.suspectId}:
                </span>
                <span className="font-typewriter text-noir-paper-ink/85">{r.relationship}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* dark secret */}
      <BioField
        label="RAHASIA GELAP"
        text={d.darkSecret}
        color="text-noir-crimson"
      />

      {/* fear */}
      <BioField label="KETAKUTAN" text={d.fear} color="text-orange-600" />

      {/* alibi + during gap */}
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <BioField label="SAKSI ALIBI" text={d.alibiWitness} color="text-noir-paper-ink" />
        <BioField label="SELAMA JEDA CCTV" text={d.duringGap} color="text-noir-crimson" />
      </div>

      {/* accusation reaction */}
      <BioField
        label="REAKSI SAAT DITUDUH"
        text={d.accusationReaction}
        color="text-purple-700"
      />

      {/* close */}
      <div className="mt-4 pt-3 border-t border-noir-paper-ink/20 text-center">
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          data-cursor-active
          className="font-typewriter text-[11px] text-noir-crimson hover:text-noir-blood underline underline-offset-2"
        >
          tutup profil
        </button>
      </div>
    </div>
  );
}

function BioField({
  label,
  text,
  color,
}: {
  label: string;
  text: string;
  color: string;
}) {
  return (
    <div className="mb-3">
      <p
        className={`font-stamp text-[9px] tracking-[0.25em] font-bold uppercase mb-0.5 ${color}`}
      >
        {label}
      </p>
      <p className="font-typewriter text-[11px] text-noir-paper-ink/85 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
