"use client";

import { useEffect, useState, useCallback } from "react";
import { SUSPECTS } from "@/lib/suspects";

export default function HeroSection() {
  const [litIndex, setLitIndex] = useState(0);
  const [booted, setBooted] = useState(false);
  const [breath, setBreath] = useState(1);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setBooted(true));
    const id = setInterval(() => {
      setLitIndex((i) => (i + 1) % SUSPECTS.length);
    }, 5000);
    // Smooth breathing animation — NO flicker
    const breathId = setInterval(() => {
      const t = Date.now() / 1000;
      setBreath(0.85 + Math.sin(t * 0.8) * 0.1 + Math.sin(t * 2.1) * 0.05);
    }, 50);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
      clearInterval(breathId);
    };
  }, []);

  const exposure = useCallback(
    (idx: number) => {
      const dist = Math.abs(idx - litIndex);
      const base = dist === 0 ? 1 : dist === 1 ? 0.4 : dist === 2 ? 0.2 : 0.1;
      return base * (0.7 + breath * 0.3);
    },
    [litIndex, breath]
  );

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100svh] overflow-hidden"
      aria-label="Hero"
    >
      {/* CSS-based ambient lighting — smooth, no WebGL */}
      <div className="absolute inset-0">
        {/* Warm spotlight from top-center */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 35%, rgba(255,179,71,${0.12 * breath}) 0%, transparent 60%)`,
          }}
        />
        {/* Crimson underglow */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background: `linear-gradient(180deg, transparent 0%, rgba(139,26,26,${0.06 * breath}) 100%)`,
          }}
        />
      </div>

      {/* Film-frame corners */}
      <div className="pointer-events-none absolute inset-0 z-[5]">
        <div className="absolute top-0 left-0 w-20 h-20">
          <div className="absolute top-4 left-4 w-full h-0.5 bg-noir-brass/60" />
          <div className="absolute top-4 left-4 h-full w-0.5 bg-noir-brass/60" />
        </div>
        <div className="absolute top-0 right-0 w-20 h-20">
          <div className="absolute top-4 right-4 w-full h-0.5 bg-noir-brass/60" />
          <div className="absolute top-4 right-4 h-full w-0.5 bg-noir-brass/60" />
        </div>
        <div className="absolute bottom-0 left-0 w-20 h-20">
          <div className="absolute bottom-4 left-4 w-full h-0.5 bg-noir-brass/60" />
          <div className="absolute bottom-4 left-4 h-full w-0.5 bg-noir-brass/60" />
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20">
          <div className="absolute bottom-4 right-4 w-full h-0.5 bg-noir-brass/60" />
          <div className="absolute bottom-4 right-4 h-full w-0.5 bg-noir-brass/60" />
        </div>
      </div>

      {/* Suspect portraits on the wall */}
      <div className="absolute inset-0 pointer-events-none">
        {SUSPECTS.map((s, i) => {
          const exp = exposure(i);
          const positions = [
            "left-[5%] top-[15%]",
            "right-[5%] top-[15%]",
            "left-[7%] bottom-[22%]",
            "right-[7%] bottom-[22%]",
            "left-[3%] top-[45%]",
            "right-[3%] top-[45%]",
            "left-[15%] top-[5%]",
            "right-[15%] top-[5%]",
          ];
          return (
            <div
              key={s.id}
              className={`absolute ${positions[i % positions.length]} w-[clamp(80px,10vw,140px)] transition-all duration-1000`}
              style={{
                filter: `brightness(${0.15 + exp * 0.85})`,
                opacity: 0.3 + exp * 0.7,
              }}
            >
              <div className="relative aspect-[3/4] border-4 border-noir-umber/60 shadow-2xl overflow-hidden">
                <img
                  src={s.portrait}
                  alt={s.name}
                  className="w-full h-full object-cover"
                  style={{ filter: `sepia(${0.5 - exp * 0.4})` }}
                  loading="eager"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,203,122,${exp * 0.3}) 0%, transparent 50%)`,
                  }}
                />
                <div className="absolute bottom-0 inset-x-0 bg-noir-ink/90 px-2 py-1 border-t border-noir-brass/40">
                  <p className="font-stamp text-[8px] sm:text-[9px] tracking-widest text-noir-brass font-bold truncate">
                    {s.codename}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100svh] px-6 text-center">
        <div
          className="transition-all duration-1000"
          style={{
            opacity: booted ? 1 : 0,
            transform: booted ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-noir-brass/40 bg-noir-coal/70 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-noir-crimson animate-pulse" />
            <span className="font-stamp text-[10px] sm:text-xs tracking-[0.3em] text-noir-brass uppercase">
              Kasus Aktif · JKT-48-001
            </span>
          </div>

          <h1
            className="font-stamp text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-6"
            style={{
              color: "#e8dcc0",
              textShadow: "0 0 30px rgba(255,179,71,0.3), 0 4px 20px rgba(0,0,0,0.9)",
            }}
          >
            <span className="text-shimmer">MISTERI THEATER</span>
            <br />
            <span
              className="text-noir-crimson"
              style={{ textShadow: "0 0 30px rgba(192,57,43,0.4), 2px 2px 0 rgba(0,0,0,0.6)" }}
            >
              BERDARAH
            </span>
          </h1>

          <p className="font-typewriter text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-noir-paper/85 mb-8 leading-relaxed">
            Delapan bintang panggung. Satu malam. Satu korban di belakang
            panggung. Lampu menyala-meredup mengungkap siapa yang bersembunyi
            dalam bayang.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="#stamp"
              className="group relative px-8 py-3.5 font-stamp text-sm tracking-[0.2em] uppercase text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-all hover:-translate-y-0.5 shadow-lg"
            >
              Bergabung dalam Game →
            </a>
            <a
              href="#berkas"
              className="group inline-flex items-center gap-2 px-6 py-3.5 font-typewriter text-sm text-noir-paper border border-noir-brass/40 hover:border-noir-brass hover:bg-noir-brass/10 transition-all hover:-translate-y-0.5"
            >
              <span className="font-stamp tracking-widest text-noir-brass">Buka Berkas Kasus</span>
              <span className="text-noir-brass">↓</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="font-typewriter text-[11px] tracking-[0.4em] text-noir-brass/80 uppercase">
          Selidiki
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-noir-brass via-noir-brass/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
