"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useCallback } from "react";
import { SUSPECTS } from "@/lib/suspects";
import { playLampBuzz } from "@/lib/audio";

const HeroLampScene = dynamic(() => import("./three/hero-lamp-scene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-noir-amber animate-pulse" />
    </div>
  ),
});

export default function HeroSection() {
  const [flicker, setFlicker] = useState(0.9);
  const [sweep, setSweep] = useState(0);
  const [litIndex, setLitIndex] = useState(0);
  const [booted, setBooted] = useState(false);
  const lastBuzz = useRef(0);

  const onFlicker = useCallback((intensity: number) => {
    setFlicker(intensity);
    // trigger buzz on hard dips
    const now = performance.now();
    if (intensity < 0.35 && now - lastBuzz.current > 1800) {
      lastBuzz.current = now;
      playLampBuzz();
    }
  }, []);

  const onSweep = useCallback((t: number) => {
    setSweep(t);
  }, []);

  useEffect(() => {
    // cycle which portrait is "lit" by the lamp sweep
    const raf = requestAnimationFrame(() => setBooted(true));
    const id = setInterval(() => {
      setLitIndex((i) => (i + 1) % SUSPECTS.length);
    }, 4200);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  // exposure factor for a given portrait index based on sweep + flicker
  const exposure = (idx: number) => {
    const dist = Math.abs(idx - litIndex);
    const base = dist === 0 ? 1 : dist === 1 ? 0.35 : 0.15;
    return base * (0.6 + flicker * 0.4);
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100svh] overflow-hidden"
      aria-label="Hero: lampu meja berkedip"
    >
      {/* Noir film-frame decorative corners */}
      <div className="pointer-events-none absolute inset-0 z-[5]">
        {/* top-left corner */}
        <div className="absolute top-0 left-0 w-20 h-20 sm:w-28 sm:h-28">
          <div className="absolute top-4 left-4 w-full h-0.5 bg-noir-brass/70" />
          <div className="absolute top-4 left-4 h-full w-0.5 bg-noir-brass/70" />
          <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-noir-brass" />
        </div>
        {/* top-right corner */}
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-28 sm:h-28">
          <div className="absolute top-4 right-4 w-full h-0.5 bg-noir-brass/70" />
          <div className="absolute top-4 right-4 h-full w-0.5 bg-noir-brass/70" />
          <div className="absolute top-6 right-6 w-3 h-3 border-t-2 border-r-2 border-noir-brass" />
        </div>
        {/* bottom-left corner */}
        <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-28 sm:h-28">
          <div className="absolute bottom-4 left-4 w-full h-0.5 bg-noir-brass/70" />
          <div className="absolute bottom-4 left-4 h-full w-0.5 bg-noir-brass/70" />
          <div className="absolute bottom-6 left-6 w-3 h-3 border-b-2 border-l-2 border-noir-brass" />
        </div>
        {/* bottom-right corner */}
        <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-28 sm:h-28">
          <div className="absolute bottom-4 right-4 w-full h-0.5 bg-noir-brass/70" />
          <div className="absolute bottom-4 right-4 h-full w-0.5 bg-noir-brass/70" />
          <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-noir-brass" />
        </div>
      </div>

      {/* Three.js lamp scene */}
      <div className="absolute inset-0">
        <HeroLampScene onFlicker={onFlicker} onSweep={onSweep} />
      </div>

      {/* Atmospheric color grade overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 55%, rgba(255,179,71,0.06) 0%, transparent 60%), linear-gradient(180deg, rgba(10,8,7,0.4) 0%, transparent 30%, rgba(10,8,7,0.85) 100%)",
        }}
      />

      {/* Suspect portraits on the wall — lit by the lamp */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full max-w-7xl mx-auto px-6">
          {SUSPECTS.map((s, i) => {
            const exp = exposure(i);
            const positions = [
              "left-[4%] top-[14%]",
              "right-[4%] top-[14%]",
              "left-[6%] bottom-[20%]",
              "right-[6%] bottom-[20%]",
            ];
            return (
              <div
                key={s.id}
                className={`absolute ${positions[i]} w-[clamp(110px,14vw,180px)] transition-all duration-700`}
                style={{
                  filter: `brightness(${0.18 + exp * 0.85}) saturate(${0.5 + exp * 0.6})`,
                  opacity: 0.45 + exp * 0.55,
                  transform: `translateY(${(1 - exp) * 8}px)`,
                }}
              >
                <div className="relative aspect-[3/4] border-4 border-noir-umber/80 shadow-[0_8px_30px_rgba(0,0,0,0.8)] overflow-hidden">
                  <img
                    src={s.portrait}
                    alt={`Tersangka: ${s.name}`}
                    className="suspect-portrait w-full h-full object-cover"
                    style={{
                      filter: `sepia(${0.4 - exp * 0.35}) contrast(${1 + exp * 0.1})`,
                    }}
                    loading="eager"
                  />
                  {/* glare when lit */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,203,122,0.35) 0%, transparent 50%)",
                      opacity: exp * 0.7,
                    }}
                  />
                  {/* frame label */}
                  <div className="absolute bottom-0 inset-x-0 bg-noir-ink/95 px-2 py-1.5 border-t-2 border-noir-brass/60">
                    <p className="font-stamp text-[10px] sm:text-xs tracking-widest text-noir-brass font-bold truncate drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                      {s.codename}
                    </p>
                  </div>
                </div>
                {/* pin */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-noir-crimson shadow-[0_2px_4px_rgba(0,0,0,0.8)] border border-noir-ink" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Center content — title + intro */}
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
              textShadow:
                "0 0 30px rgba(255,179,71,0.35), 0 4px 20px rgba(0,0,0,0.9), 2px 2px 0 rgba(0,0,0,0.5)",
              filter: `brightness(${0.7 + flicker * 0.3})`,
              transition: "filter 0.1s linear",
            }}
          >
            TEATRO
            <br />
            <span
              className="text-noir-crimson"
              style={{ textShadow: "0 0 30px rgba(192,57,43,0.5), 2px 2px 0 rgba(0,0,0,0.6)" }}
            >
              DEL MISTERI
            </span>
          </h1>

          <p
            className="font-typewriter text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-noir-paper/85 mb-8 leading-relaxed"
            style={{ filter: `brightness(${0.75 + flicker * 0.25})` }}
          >
            Empat bintang panggung. Satu malam. Satu korban di belakang
            panggung. Lampu menyala-meredup mengungkap siapa yang bersembunyi
            dalam bayang.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="#stamp"
              className="group relative px-8 py-3.5 font-stamp text-sm tracking-[0.2em] uppercase text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-all shadow-[0_8px_24px_rgba(201,163,90,0.45),0_0_0_1px_rgba(201,163,90,0.6)] hover:shadow-[0_12px_32px_rgba(255,203,122,0.6),0_0_0_2px_rgba(255,203,122,0.8)] hover:-translate-y-0.5"
              style={{
                boxShadow: `0 8px 24px rgba(201,163,90,${0.3 + flicker * 0.25})`,
              }}
            >
              {/* animated sheen */}
              <span className="absolute inset-0 overflow-hidden">
                <span
                  className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 group-hover:translate-x-[400%] transition-transform duration-700"
                />
              </span>
              <span className="relative z-10 flex items-center gap-2">
                Bergabung dalam Game
                <span className="text-noir-ink/70 group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </a>
            <a
              href="#berkas"
              className="group relative inline-flex items-center gap-2 px-6 py-3.5 font-typewriter text-sm text-noir-paper border border-noir-brass/40 hover:border-noir-brass hover:bg-noir-brass/10 transition-all hover:-translate-y-0.5"
            >
              <span className="font-stamp tracking-widest text-noir-brass group-hover:text-noir-tungsten transition-colors">Buka Berkas Kasus</span>
              <span className="text-noir-brass transition-transform group-hover:translate-y-1">↓</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="font-typewriter text-[11px] tracking-[0.4em] text-noir-brass/80 uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
          Selidiki
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-noir-brass via-noir-brass/50 to-transparent animate-pulse" />
      </div>

      {/* Flicker-driven light spill on edges */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-100"
        style={{
          opacity: flicker * 0.5,
          background:
            "radial-gradient(ellipse 50% 40% at 50% 60%, rgba(255,179,71,0.12) 0%, transparent 70%)",
        }}
      />
    </section>
  );
}
