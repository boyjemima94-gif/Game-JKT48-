"use client";

import { motion } from "framer-motion";

const TECH_STACK = [
  { name: "Next.js 16", role: "Framework" },
  { name: "TypeScript", role: "Bahasa" },
  { name: "Three.js", role: "3D Scene" },
  { name: "React Three Fiber", role: "React 3D" },
  { name: "Framer Motion", role: "Animasi" },
  { name: "Tailwind CSS 4", role: "Styling" },
  { name: "shadcn/ui", role: "Komponen" },
  { name: "Zustand", role: "State" },
  { name: "Web Audio API", role: "Audio SFX" },
];

const CAST = [
  { name: "Oline Manuel", role: "Tersangka · BURUNG MERAK" },
  { name: "Catherina Valencia", role: "Tersangka · MERAH MUDA" },
  { name: "Abigail Rachel", role: "Tersangka · ANGSA PUTIH" },
  { name: "Fiony Alveria", role: "Tersangka · BAYANG MALAM" },
];

/**
 * Credits / About section — attribution for the project.
 * Tech stack, cast, inspiration, and disclaimer.
 */
export default function CreditsSection() {
  return (
    <section
      id="kredit"
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      aria-label="Kredit & Tentang"
    >
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Tentang Proyek ·
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3"
            style={{
              textShadow:
                "0 0 24px rgba(255,179,71,0.25), 0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            KREDIT
          </h2>
          <p className="font-typewriter text-sm text-noir-paper/70 max-w-lg mx-auto">
            Game misteri pembunuhan interaktif dibangun dengan teknologi modern
            dan atmosfer noir detektif.
          </p>
        </motion.div>

        {/* about blurb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="paper-texture paper-edge paper-burn p-5 sm:p-7 mb-8"
        >
          <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-crimson font-bold uppercase mb-3 pb-2 border-b border-noir-paper-ink/20">
            Tentang Misteri Theater Berdarah
          </p>
          <p className="font-typewriter text-sm text-noir-paper-ink/85 leading-relaxed mb-3">
            <strong>Misteri Theater Berdarah</strong> adalah game misteri pembunuhan
            interaktif yang memadukan narasi sinematik, penyelidikan forensik,
            dan atmosfer noir. Pemain mengambil peran detektif yang menyelidiki
            kasus JKT-48-001 — kejadian misterius di belakang panggung teater.
          </p>
          <p className="font-typewriter text-sm text-noir-paper-ink/85 leading-relaxed">
            Game ini menampilkan lampu meja 3D berkedip, berkas kasus dengan
            efek flip kertas, papan benang merah, cap pers raksasa, dan kursor
            kaca pembesar — semua disintesis secara real-time tanpa file
            eksternal.
          </p>
        </motion.div>

        {/* tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-brass font-bold uppercase mb-4">
            ◆ Tumpukan Teknologi
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="border border-noir-coffee/60 bg-noir-coal/60 p-3 hover:border-noir-brass/60 transition-colors group"
              >
                <p className="font-stamp text-sm font-bold text-noir-paper group-hover:text-noir-brass transition-colors">
                  {tech.name}
                </p>
                <p className="font-typewriter text-[9px] text-noir-paper/50 tracking-widest uppercase mt-0.5">
                  {tech.role}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* cast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-brass font-bold uppercase mb-4">
            ◆ Pemeran Tersangka
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CAST.map((member) => (
              <div
                key={member.name}
                className="border border-noir-coffee/60 bg-noir-coal/60 p-3 flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-noir-crimson shrink-0" />
                <div>
                  <p className="font-stamp text-sm font-bold text-noir-paper">
                    {member.name}
                  </p>
                  <p className="font-typewriter text-[10px] text-noir-brass tracking-widest uppercase">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="font-typewriter text-[10px] text-noir-paper/40 mt-3 italic">
            Karakter didasarkan pada member JKT48. Persona dalam game bersifat
            fiksi untuk tujuan hiburan.
          </p>
        </motion.div>

        {/* features list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="paper-texture paper-edge p-5 sm:p-6 mb-8"
        >
          <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-crimson font-bold uppercase mb-3 pb-2 border-b border-noir-paper-ink/20">
            Fitur Utama
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[11px] font-typewriter text-noir-paper-ink/85">
            {[
              "Lampu meja 3D berkedip (Three.js)",
              "Kursor kaca pembesar (DOM-clone magnification)",
              "Berkas kasus dengan flip kertas 3D",
              "Papan benang merah konspirasi",
              "Cap pers raksasa dengan audio",
              "Terminal briefing efek mesin tik",
              "Sistem interogasi dengan pohon dialog",
              "Konfrontasi bukti (cross-reference)",
              "Rekonstruksi linimasa puzzle",
              "3 mode kesulitan (Pemula/Detektif/Legendaris)",
              "Sistem pencapaian (12 lencana)",
              "Buku catatan detektif slide-out",
              "Sistem petunjuk dengan biaya skor",
              "Skor detektif + pangkat (S/A/B/C/D)",
              "Arsip kasus persisten",
              "Soundboard (Web Audio API)",
              "Navigasi cepat + bantuan keyboard",
              "Audio disintesis real-time (tanpa file)",
            ].map((feature) => (
              <div key={feature} className="flex gap-1.5">
                <span className="text-noir-crimson">▸</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center pt-4 border-t border-noir-coffee/40"
        >
          <p className="font-stamp text-sm font-bold text-noir-brass mb-1">
            ★ MISTERI THEATER BERDARAH ★
          </p>
          <p className="font-typewriter text-[10px] text-noir-paper/50 tracking-widest uppercase">
            Kasus JKT-48-001 · Dibuat dengan Next.js + Three.js
          </p>
          <p className="font-typewriter text-[9px] text-noir-paper/30 mt-2 italic">
            Setiap karakter, nama, dan peristiwa dalam game ini adalah fiksi.
            Kemiripan dengan orang atau peristiwa nyata bersifat kebetulan.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
