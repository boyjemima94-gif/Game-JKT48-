"use client";

import { motion } from "framer-motion";

const LORE_ENTRIES = [
  {
    year: "2012",
    title: "Pendirian Teatro",
    text: "Misteri Theater Berdarah didirikan sebagai kelompok teater eksperimental di Jakarta. Memadukan drama klasik dengan elemen misteri interaktif, cepat menjadi fenomena budaya underground.",
    glyph: "🎭",
  },
  {
    year: "2018",
    title: "Kolaborasi JKT48",
    text: "Empat member JKT48 — Oline Manuel, Catherina Valencia, Abigail Rachel, dan Fiony Alveria — direkrut sebagai pemeran utama produksi tahunan 'Malam Sang Misteri'. Mereka menjadi wajah Teatro.",
    glyph: "✨",
  },
  {
    year: "2023",
    title: "Era Keemasan",
    text: "Teatro mencapai puncak popularitas. Setiap pertunjukan terjual habis. Tapi di balik panggung, persaingan antar member memuncak. Rahasia mulai terkubur.",
    glyph: "🌟",
  },
  {
    year: "2025",
    title: "Insiden Pertama",
    text: "Sebulan sebelum kasus utama, video latihan Catherina bocor ke media. Surat ancaman anonim muncul. Teatro mulai retak dari dalam.",
    glyph: "⚡",
  },
  {
    year: "13 Okt",
    title: "Malam Itu",
    text: "Empat member latihan untuk acara ulang tahun. Pukul 23:17, seorang produser ditemukan tak sadarkan diri. Sembilan menit CCTV hilang. Kasus JKT-48-001 dibuka.",
    glyph: "🕯️",
  },
];

const THEATER_FACTS = [
  { label: "Berdiri", value: "2012" },
  { label: "Lokasi", value: "Jakarta" },
  { label: "Member Tetap", value: "4" },
  { label: "Pertunjukan/Tahun", value: "120+" },
  { label: "Kasus Terbuka", value: "1" },
  { label: "Tingkat Penyelesaian", value: "?" },
];

/**
 * Lore / Worldbuilding section — expands the Misteri Theater Berdarah universe.
 * Theater history timeline + key facts + narrative context.
 */
export default function LoreSection() {
  return (
    <section
      id="loran"
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      aria-label="Latar Cerita"
    >
      <div className="max-w-5xl mx-auto">
        {/* header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Latar Cerita ·
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3"
            style={{
              textShadow:
                "0 0 24px rgba(255,179,71,0.25), 0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            DUNIA MISTERI THEATER
          </h2>
          <p className="font-typewriter text-sm sm:text-base text-noir-paper/85 max-w-lg mx-auto">
            Setiap misteri punya akar. Kenali sejarah Misteri Theater Berdarah dan
            konteks di balik kasus JKT-48-001.
          </p>
        </motion.div>

        {/* theater facts strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-12"
        >
          {THEATER_FACTS.map((f) => (
            <div
              key={f.label}
              className="paper-texture paper-edge p-2 sm:p-3 text-center"
            >
              <p className="font-stamp text-base sm:text-lg font-black text-noir-paper-ink leading-none">
                {f.value}
              </p>
              <p className="font-typewriter text-[8px] sm:text-[9px] tracking-widest text-noir-paper-ink/60 uppercase mt-1">
                {f.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* timeline */}
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-noir-brass/40 to-transparent sm:-translate-x-1/2" />

          <div className="space-y-8 sm:space-y-12">
            {LORE_ENTRIES.map((entry, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={entry.year}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className={`relative pl-12 sm:pl-0 sm:flex sm:items-center ${
                    isLeft ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* node */}
                  <div className="absolute left-4 sm:left-1/2 top-2 sm:top-1/2 -translate-x-1/2 sm:-translate-y-1/2 z-10">
                    <div className="w-3 h-3 rounded-full bg-noir-brass border-2 border-noir-ink shadow-[0_0_12px_rgba(201,163,90,0.6)]" />
                  </div>

                  {/* spacer for alternating layout on sm+ */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* card */}
                  <div className="sm:w-1/2 sm:px-6">
                    <div className="paper-texture paper-edge p-4 sm:p-5 relative">
                      {/* glyph */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{entry.glyph}</span>
                        <div>
                          <p className="font-stamp text-lg font-black text-noir-crimson leading-none">
                            {entry.year}
                          </p>
                          <p className="font-stamp text-xs font-bold text-noir-paper-ink mt-0.5">
                            {entry.title}
                          </p>
                        </div>
                      </div>
                      <p className="font-typewriter text-[11px] sm:text-xs text-noir-paper-ink/80 leading-relaxed">
                        {entry.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* closing note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12 pt-8 border-t border-noir-coffee/40"
        >
          <p className="font-typewriter text-xs sm:text-sm text-noir-paper/60 italic max-w-md mx-auto">
            &ldquo;Di atas panggung, semua orang bermain peran. Tapi di
            belakangnya, hanya kebenaran yang menunggu untuk terungkap.&rdquo;
          </p>
          <p className="font-stamp text-[10px] tracking-widest text-noir-brass/60 uppercase mt-2">
            — Arsip Misteri Theater Berdarah
          </p>
        </motion.div>
      </div>
    </section>
  );
}
