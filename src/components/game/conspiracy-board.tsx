"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { SUSPECTS, THREAD_LINKS } from "@/lib/suspects";
import { useGame } from "@/lib/game-store";
import { playClick, playPaperRustle } from "@/lib/audio";
import InterrogationModal from "./interrogation-modal";

export default function ConspiracyBoard() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [interrogatingId, setInterrogatingId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const interrogatedSuspects = useGame((s) => s.interrogatedSuspects);

  const suspectById = useMemo(
    () => Object.fromEntries(SUSPECTS.map((s) => [s.id, s])),
    []
  );

  // map suspect location {x%, y%} to svg coords (0..100 viewBox)
  const pt = (id: string) => {
    const s = suspectById[id];
    return { x: s.location.x, y: s.location.y };
  };

  // build a slightly-sagging bezier path between two suspects
  const threadPath = (fromId: string, toId: string, weight: number) => {
    const a = pt(fromId);
    const b = pt(toId);
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2 + 4 + weight * 2; // sag
    return `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`;
  };

  const isActive = (from: string, to: string) =>
    activeId && (activeId === from || activeId === to);

  const onSuspectClick = useCallback((id: string) => {
    playClick();
    playPaperRustle(0.5, 0.4);
    setActiveId((cur) => (cur === id ? null : id));
  }, []);

  return (
    <section
      id="papan"
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      aria-label="Papan Koneksi Tersangka"
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
          <span className="font-stamp text-[10px] tracking-[0.4em] text-noir-crimson uppercase">
            · Papan Konspirasi ·
          </span>
          <h2 className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3">
            BENANG MERAH
          </h2>
          <p className="font-typewriter text-sm text-noir-paper/60 max-w-lg mx-auto">
            Setiap koneksi menyimpan motif. Klik seorang tersangka untuk
            menelusuri jaring rahasia di antara mereka.
          </p>
        </motion.div>

        {/* the board */}
        <motion.div
          ref={boardRef}
          className="relative w-full max-h-[640px] aspect-[16/10] sm:aspect-[2/1] rounded-lg overflow-hidden border-4 border-noir-coffee shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, #3a2c20 0%, #211a14 50%, #14100d 100%), repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px)",
            backgroundBlendMode: "multiply",
          }}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* corkboard texture overlay */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(80,50,20,0.3) 0%, transparent 8%), radial-gradient(circle at 70% 60%, rgba(80,50,20,0.3) 0%, transparent 6%), radial-gradient(circle at 45% 80%, rgba(80,50,20,0.25) 0%, transparent 7%), radial-gradient(circle at 85% 25%, rgba(80,50,20,0.25) 0%, transparent 5%)",
            }}
          />

          {/* classified stamp watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div
              className="font-stamp text-[clamp(60px,12vw,140px)] font-black select-none -rotate-12 tracking-[0.15em]"
              style={{
                color: "rgba(139,26,26,0.08)",
                textShadow: "0 0 2px rgba(139,26,26,0.15)",
              }}
            >
              RAHASIA
            </div>
          </div>
          {/* secondary diagonal watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div
              className="font-stamp text-[clamp(40px,8vw,90px)] font-black select-none rotate-6 tracking-[0.3em]"
              style={{ color: "rgba(201,163,90,0.06)" }}
            >
              JKT-48-001
            </div>
          </div>

          {/* SVG threads layer */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <defs>
              <filter id="thread-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0.3"
                  dy="0.6"
                  stdDeviation="0.4"
                  floodColor="#000"
                  floodOpacity="0.6"
                />
              </filter>
            </defs>
            {THREAD_LINKS.map((link) => {
              const key = `${link.from}-${link.to}`;
              const active = isActive(link.from, link.to);
              const dimmed = activeId && !active;
              return (
                <g key={key}>
                  {/* shadow thread (offset, for depth) */}
                  <path
                    d={threadPath(link.from, link.to, link.weight)}
                    stroke="#3a0a0a"
                    strokeWidth={link.weight * 0.9 + 0.3}
                    fill="none"
                    opacity={dimmed ? 0.1 : 0.4}
                    transform="translate(0.4, 0.6)"
                    style={{ transition: "opacity 0.3s" }}
                  />
                  {/* main thread */}
                  <path
                    d={threadPath(link.from, link.to, link.weight)}
                    className="thread-line"
                    strokeWidth={link.weight * 0.7 + 0.4}
                    stroke={active ? "#ff4136" : "#b91c1c"}
                    opacity={dimmed ? 0.15 : active ? 1 : 0.7}
                    filter="url(#thread-shadow)"
                    style={{ transition: "opacity 0.3s, stroke 0.3s" }}
                  />
                </g>
              );
            })}

            {/* pins at each suspect */}
            {SUSPECTS.map((s) => {
              const active = activeId === s.id;
              return (
                <g key={`pin-${s.id}`}>
                  {/* pin shadow */}
                  <ellipse
                    cx={s.location.x + 0.4}
                    cy={s.location.y + 0.6}
                    rx={1.1}
                    ry={0.7}
                    fill="#000"
                    opacity={0.5}
                  />
                  {/* pin head */}
                  <circle
                    cx={s.location.x}
                    cy={s.location.y}
                    r={1.2}
                    fill={active ? "#ff4136" : "#c0392b"}
                    stroke="#3a0a0a"
                    strokeWidth={0.25}
                    style={{ transition: "fill 0.3s, r 0.3s" }}
                  />
                  {/* pin highlight */}
                  <circle
                    cx={s.location.x - 0.35}
                    cy={s.location.y - 0.35}
                    r={0.4}
                    fill="#fff"
                    opacity={0.5}
                  />
                </g>
              );
            })}
          </svg>

          {/* HTML thread labels (more readable than SVG text) */}
          {THREAD_LINKS.map((link) => {
            const a = pt(link.from);
            const b = pt(link.to);
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2 + 4 + link.weight * 2;
            const active = isActive(link.from, link.to);
            const dimmed = activeId && !active;
            return (
              <div
                key={`label-${link.from}-${link.to}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-300 z-10"
                style={{
                  left: `${mx}%`,
                  top: `${my}%`,
                  opacity: dimmed ? 0.15 : active ? 1 : 0.9,
                }}
              >
                <div
                  className="px-2 py-0.5 bg-noir-ink/90 border whitespace-nowrap font-typewriter text-[9px] sm:text-[10px] tracking-wide text-noir-paper rounded-sm shadow-lg"
                  style={{
                    borderColor: active ? "#ff4136" : "#b91c1c",
                    color: active ? "#ffd9d6" : "#e8dcc0",
                  }}
                >
                  {link.label}
                </div>
              </div>
            );
          })}

          {/* suspect portrait cards */}
          {SUSPECTS.map((s) => {
            const active = activeId === s.id;
            const dimmed = activeId && !active;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSuspectClick(s.id)}
                data-cursor-active
                aria-label={`Tersangka ${s.name}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                style={{
                  left: `${s.location.x}%`,
                  top: `${s.location.y}%`,
                  zIndex: active ? 30 : 20,
                }}
              >
                <div
                  className="relative w-[clamp(72px,9vw,128px)] transition-all duration-300"
                  style={{
                    transform: active
                      ? "scale(1.12) rotate(-2deg)"
                      : "scale(1) rotate(0deg)",
                    opacity: dimmed ? 0.5 : 1,
                    filter: active
                      ? "drop-shadow(0 0 20px rgba(255,65,54,0.5))"
                      : "drop-shadow(0 6px 12px rgba(0,0,0,0.7))",
                  }}
                >
                  {/* polaroid frame */}
                  <div className="bg-noir-paper p-1 pb-6 shadow-[0_8px_20px_rgba(0,0,0,0.8)] border border-noir-paper-dark/40">
                    <div className="relative aspect-[3/4] overflow-hidden bg-noir-coal">
                      <img
                        src={s.portrait}
                        alt={s.name}
                        className="suspect-portrait w-full h-full object-cover"
                        loading="lazy"
                        style={{
                          filter: active
                            ? "sepia(0.05) contrast(1.15) brightness(1.05)"
                            : "sepia(0.4) contrast(1.05) brightness(0.85)",
                        }}
                      />
                      {/* censored redaction bars when not active — intentional CLASSIFIED look */}
                      <div
                        className="absolute inset-x-0 top-[38%] transition-opacity duration-300 pointer-events-none"
                        style={{ opacity: active ? 0 : 1 }}
                      >
                        <div className="bg-noir-ink px-1 py-0.5">
                          <p className="font-stamp text-[7px] sm:text-[8px] tracking-[0.3em] text-noir-crimson text-center font-bold leading-tight">
                            ✖ TERSENSOR ✖
                          </p>
                        </div>
                      </div>
                      {/* classified corner stamp when not active */}
                      <div
                        className="absolute top-1 left-1 px-1 py-0.5 bg-noir-crimson/90 transition-opacity duration-300 pointer-events-none"
                        style={{ opacity: active ? 0 : 1 }}
                      >
                        <p className="font-stamp text-[6px] sm:text-[7px] tracking-widest text-noir-paper font-bold">
                          RAHASIA
                        </p>
                      </div>
                    </div>
                    {/* caption */}
                    <p className="font-typewriter text-[9px] sm:text-[10px] text-noir-paper-ink text-center mt-1 truncate px-1">
                      {s.codename}
                    </p>
                  </div>
                  {/* tape on top */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 tape -rotate-3" />
                </div>
              </button>
            );
          })}

          {/* post-it notes for flavor */}
          <div className="absolute top-[8%] left-[48%] w-20 h-20 bg-yellow-200/80 -rotate-6 p-2 shadow-lg hidden sm:block">
            <p className="font-typewriter text-[8px] text-noir-paper-ink leading-tight">
              Cek jam tangan korban — berhenti 23:17.
            </p>
          </div>
          <div className="absolute bottom-[8%] right-[46%] w-20 h-20 bg-yellow-200/80 rotate-3 p-2 shadow-lg hidden sm:block">
            <p className="font-typewriter text-[8px] text-noir-paper-ink leading-tight">
              CCTV mati 9 menit. Siapa?
            </p>
          </div>
        </motion.div>

        {/* active suspect dossier */}
        <div className="mt-8 min-h-[120px]">
          {activeId ? (
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="paper-texture paper-edge rounded-sm p-5 sm:p-6 max-w-3xl mx-auto"
            >
              {(() => {
                const s = suspectById[activeId];
                return (
                  <div className="grid sm:grid-cols-[auto_1fr] gap-5">
                    <div className="w-24 h-32 sm:w-28 sm:h-36 bg-noir-coal border-2 border-noir-paper-ink/30 overflow-hidden shrink-0">
                      <img
                        src={s.portrait}
                        alt={s.name}
                        className="w-full h-full object-cover suspect-portrait"
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                        <h3 className="font-stamp text-xl font-black text-noir-paper-ink">
                          {s.name}
                        </h3>
                        <span className="font-stamp text-[10px] tracking-widest text-noir-crimson">
                          {s.codename}
                        </span>
                      </div>
                      <p className="font-typewriter text-[11px] text-noir-paper-ink/60 mb-3">
                        {s.role} · {s.memberOf} · {s.age} thn · {s.height}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[11px] font-typewriter text-noir-paper-ink/90">
                        <div>
                          <span className="text-noir-crimson font-bold">TERAKHIR DILIHAT: </span>
                          {s.lastSeen}
                        </div>
                        <div>
                          <span className="text-noir-crimson font-bold">ALIBI: </span>
                          {s.alibi}
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-noir-crimson font-bold">MOTIF: </span>
                          {s.motive}
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-noir-crimson font-bold">BUKTI: </span>
                          <ul className="list-none mt-1 space-y-0.5">
                            {s.evidence.map((e, i) => (
                              <li key={i} className="flex gap-1.5">
                                <span className="text-noir-crimson">▸</span>
                                <span>{e}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <p className="font-typewriter text-xs italic text-noir-paper-ink/70 mt-3 border-l-2 border-noir-crimson pl-3">
                        &ldquo;{s.quote}&rdquo; <span className="not-italic">{s.signature}</span>
                      </p>
                      {/* interrogation CTA */}
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => {
                            playClick();
                            setInterrogatingId(s.id);
                          }}
                          data-cursor-active
                          className="inline-flex items-center gap-2 px-4 py-2 font-stamp text-[11px] tracking-widest uppercase text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-colors shadow-md"
                        >
                          <span>🗣️ Interogasi</span>
                          {interrogatedSuspects[s.id] && (
                            <span className="font-typewriter text-[9px] text-noir-crimson font-bold">
                              ✓
                            </span>
                          )}
                        </button>
                        {interrogatedSuspects[s.id] && (
                          <span className="font-typewriter text-[10px] text-noir-paper-ink/60">
                            Sudah diinterogasi — pernyataan tercatat di buku.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          ) : (
            <p className="text-center font-typewriter text-xs text-noir-paper/40 tracking-widest">
              · PILIH SEORANG TERSANGKA UNTUK MEMBACA DOSIR ·
            </p>
          )}
        </div>
      </div>

      <InterrogationModal
        suspectId={interrogatingId}
        onClose={() => setInterrogatingId(null)}
      />
    </section>
  );
}
