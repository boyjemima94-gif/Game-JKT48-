"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Cinematic narrative bridge between the hero and the briefing terminal.
 * Uses scroll-driven parallax to reveal story beats as the user scrolls down,
 * building atmosphere before the investigation begins.
 */
const STORY_BEATS = [
  {
    time: "23:17",
    location: "Panggung Utama Teatro",
    text: "Sebuah jerit tertahan. Lampu panggung mati. Saat menyala kembali, seorang produser tergeletak di belakang tirai.",
    accent: "crimson",
  },
  {
    time: "23:32",
    location: "Ruang Kendali CCTV",
    text: "Rekaman hilang selama sembilan menit. Sembilan menit kegelapan. Sembilan menit di mana siapa pun bisa berbuat apa saja.",
    accent: "brass",
  },
  {
    time: "23:45",
    location: "Lobi Teatro",
    text: "Empat bintang panggung masih di gedung itu. Empat alibi. Empat motif. Dan satu detektif yang baru tiba.",
    accent: "crimson",
  },
];

const ACCENT_COLORS: Record<string, { text: string; border: string; glow: string }> = {
  crimson: {
    text: "text-noir-crimson",
    border: "border-noir-crimson/50",
    glow: "rgba(192,57,43,0.3)",
  },
  brass: {
    text: "text-noir-brass",
    border: "border-noir-brass/50",
    glow: "rgba(201,163,90,0.3)",
  },
};

export default function CaseIntro() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms for the background layers
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const fogY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-36 px-4 sm:px-6 overflow-hidden"
      aria-label="Pembuka Kasus"
    >
      {/* Parallax background layers */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,26,26,0.15) 0%, transparent 70%)",
          }}
        />
      </motion.div>
      <motion.div
        style={{ y: fogY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute top-1/4 left-0 w-full h-32 opacity-20 blur-3xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,179,71,0.3), transparent)",
          }}
        />
      </motion.div>

      <div className="max-w-3xl mx-auto relative">
        {/* Section title */}
        <motion.div
          className="text-center mb-14 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-stamp text-xs tracking-[0.5em] text-noir-brass uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            ◆ Malam Itu ◆
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl md:text-6xl font-black text-noir-paper mt-4 mb-2"
            style={{
              textShadow:
                "0 0 30px rgba(192,57,43,0.4), 0 4px 16px rgba(0,0,0,0.9)",
            }}
          >
            TIGA BELAS OKTOBER
          </h2>
          <p className="font-typewriter text-sm sm:text-base text-noir-brass/80 tracking-[0.3em] uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
            Misteri Theater Berdarah · Lantai 2
          </p>
        </motion.div>

        {/* Story beats with staggered parallax */}
        <div className="space-y-16 sm:space-y-24">
          {STORY_BEATS.map((beat, i) => {
            const accent = ACCENT_COLORS[beat.accent];
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={i}
                className={`relative flex ${isLeft ? "justify-start" : "justify-end"}`}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <div className={`relative w-full sm:w-[80%] ${isLeft ? "" : "sm:text-right"}`}>
                  {/* time stamp floating */}
                  <div
                    className={`inline-flex items-center gap-2 mb-3 ${isLeft ? "" : "sm:flex-row-reverse"}`}
                  >
                    <span
                      className={`font-stamp text-2xl sm:text-3xl font-black ${accent.text}`}
                      style={{ textShadow: `0 0 20px ${accent.glow}` }}
                    >
                      {beat.time}
                    </span>
                    <span className="font-typewriter text-[10px] tracking-[0.3em] text-noir-paper/50 uppercase">
                      {beat.location}
                    </span>
                  </div>

                  {/* story card */}
                  <div
                    className={`relative p-5 sm:p-6 bg-noir-coal/70 backdrop-blur border-l-4 ${accent.border} ${isLeft ? "" : "sm:border-l-0 sm:border-r-4"}`}
                    style={{
                      boxShadow: `0 8px 32px rgba(0,0,0,0.6), inset 0 0 30px ${accent.glow}`,
                    }}
                  >
                    {/* corner quote marks */}
                    <span
                      className={`absolute top-2 ${isLeft ? "left-3" : "right-3"} font-stamp text-3xl ${accent.text} opacity-30 leading-none`}
                    >
                      &ldquo;
                    </span>
                    <p className="font-typewriter text-sm sm:text-base md:text-lg text-noir-paper/90 leading-relaxed italic">
                      {beat.text}
                    </p>
                  </div>

                  {/* connecting line to next beat */}
                  {i < STORY_BEATS.length - 1 && (
                    <div
                      className={`absolute top-full h-16 w-px bg-gradient-to-b from-noir-brass/40 to-transparent ${isLeft ? "left-8" : "right-8 sm:left-auto"}`}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* closing transition */}
        <motion.div
          className="text-center mt-16 sm:mt-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-noir-brass/40 bg-noir-coal/60">
            <span className="w-2 h-2 rounded-full bg-noir-crimson animate-pulse" />
            <span className="font-stamp text-[11px] tracking-[0.3em] text-noir-brass uppercase">
              Penyelidikan dimulai
            </span>
          </div>
          <p className="font-typewriter text-xs text-noir-paper/40 mt-4 tracking-widest">
            ↓ GULIR UNTUK MASUK TERMINAL ↓
          </p>
        </motion.div>
      </div>
    </section>
  );
}
