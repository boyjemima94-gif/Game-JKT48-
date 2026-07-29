"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SUSPECTS } from "@/lib/suspects";
import { playClick } from "@/lib/audio";

interface CastBio {
  career: string;
  personality: string;
  secret: string;
  relationship: string;
}

const CAST_BIOS: Record<string, CastBio> = {
  oline: {
    career:
      "Bergabung dengan Teatro del Misteri 3 tahun lalu. Naik daun cepat sebagai center setelah koreografi solo viral. Dikenal perfeksionis — sering latihan hingga larut malam, sendirian.",
    personality:
      "Ambisius, tertutup, dan sangat protektif terhadap posisinya. Sulit percaya pada orang lain. Di balik senyum panggungnya, menyimpan ketakutan akan kehilangan segalanya.",
    secret:
      "Menerima surat peringatan anonim sebulan lalu. Tidak melaporkannya ke siapa pun — malah menyimpannya sebagai bukti 'jika suatu saat dibutuhkan'.",
    relationship:
      "Sahabat lama Abigail, tapi hubungan mereka mendingin setelah Oline jadi center. Saingan langsung Catherina.",
  },
  catherina: {
    career:
      "Veteran Teatro selama 6 tahun. Pernah jadi center sebelum Oline. Memimpin koreografi ensemble. Memiliki basis penggemar setia yang menyebutnya 'Ratu Panggung'.",
    personality:
      "Karismatik, tegas, dan pendendam. Tidak pernah melupakan pengkhianatan. Di balik kepercayaan dirinya, menyimpan luka dari pencitraan negatif media.",
    secret:
      "Video latihan pribadinya dibocorkan korban ke media 2 bulan lalu. Menuntut secara hukum tapi kalah. Sejak itu, menyimpan kebencian mendalam.",
    relationship:
      "Saingan utama Oline. Mantan dekat korban — hubungan profesional yang berubah racun. Memiliki aliansi senyap dengan Fiony.",
  },
  abigail: {
    career:
      "Member Teatro 4 tahun. Spesialis harmoni vokal. Jarang ambil spotlight, lebih suka mendukung dari belakang. Dihormati sesama member karena kedewasaannya.",
    personality:
      "Tenang, perhatian, dan tertutup. Selalu jadi tempat curhat member lain. Tapi tidak pernah membuka diri sendiri — menyimpan semuanya di dalam.",
    secret:
      "Korban menemukan rahasia keluarganya (skandal yang bisa menghancurkan nama baik keluarga) dan mengancam mengungkapnya jika Abigail tidak mengikuti kemauannya.",
    relationship:
      "Sahabat lama Oline (kini mendingin). Sering jadi penengah konflik. Bertemu Fiony malam kejadian di lorong.",
  },
  fiony: {
    career:
      "Member Teatro 2 tahun. Produser kreatif muda untuk acara ulang tahun. Genius teknis — menguasai editing, sound design, dan stagecraft digital. Calon pengganti korban.",
    personality:
      "Cerdas, terburu-buru, dan ambisius. Selalu punya rencana. Tidak suka perhatian publik, lebih suka bekerja di bayang. Setiap langkahnya sudah dihitung.",
    secret:
      "Korban merencanakan menggantikan Fiony sebagai produser kreatif dengan orang luar. Fiony mengetahui ini sehari sebelum kejadian — kalender kerjanya dilingkari merah.",
    relationship:
      "Aliansi senyap dengan Catherina (saling bertukar informasi). Bertemu Abigail sebentar di lorong malam kejadian.",
  },
};

export default function CastList() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeSuspect = activeId
    ? SUSPECTS.find((s) => s.id === activeId)
    : null;
  const activeBio = activeId ? CAST_BIOS[activeId] : null;

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
            Klik setiap tokoh untuk membaca biografi, kepribadian, dan rahasia
            mereka.
          </p>
        </motion.div>

        {/* cast grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {SUSPECTS.map((s, i) => {
            const bio = CAST_BIOS[s.id];
            const isActive = activeId === s.id;
            return (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => {
                  playClick();
                  setActiveId(isActive ? null : s.id);
                }}
                data-cursor-active
                aria-label={`Baca biografi ${s.name}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group text-left focus:outline-none"
              >
                <div
                  className={`relative overflow-hidden border-2 transition-all ${
                    isActive
                      ? "border-noir-brass shadow-[0_0_30px_rgba(201,163,90,0.4)]"
                      : "border-noir-coffee/70 group-hover:border-noir-brass"
                  }`}
                >
                  {/* portrait */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-noir-coal">
                    <img
                      src={s.portrait}
                      alt={s.name}
                      className="suspect-portrait w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 40%, rgba(10,8,7,0.9) 100%)",
                      }}
                    />
                    {/* codename top */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-noir-ink/80 backdrop-blur-sm">
                      <span className="font-stamp text-[8px] sm:text-[9px] tracking-widest text-noir-brass font-bold">
                        {s.codename}
                      </span>
                    </div>
                    {/* role */}
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-noir-crimson/80 backdrop-blur-sm">
                      <span className="font-stamp text-[7px] sm:text-[8px] tracking-widest text-noir-paper font-bold">
                        {s.role.toUpperCase()}
                      </span>
                    </div>
                    {/* name bottom */}
                    <div className="absolute bottom-0 inset-x-0 p-2">
                      <p className="font-stamp text-sm sm:text-base font-black text-noir-paper leading-tight">
                        {s.name}
                      </p>
                      <p className="font-typewriter text-[9px] text-noir-brass tracking-widest uppercase">
                        {s.memberOf.split("—")[0].trim()}
                      </p>
                    </div>
                  </div>
                  {/* quick stats bar */}
                  <div className="grid grid-cols-3 text-center bg-noir-coal/80 border-t border-noir-coffee/60">
                    <div className="py-1.5 border-r border-noir-coffee/40">
                      <p className="font-stamp text-[8px] text-noir-paper/40 tracking-widest">
                        USIA
                      </p>
                      <p className="font-stamp text-xs font-bold text-noir-paper">
                        {s.age}
                      </p>
                    </div>
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
                        TINGGI
                      </p>
                      <p className="font-stamp text-xs font-bold text-noir-paper">
                        {s.height.split(" ")[0]}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* bio detail panel */}
        <AnimatePresence mode="wait">
          {activeSuspect && activeBio && (
            <motion.div
              key={activeSuspect.id}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden mt-8"
            >
              <div className="paper-texture paper-edge paper-burn p-5 sm:p-7 max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* portrait */}
                  <div className="shrink-0 mx-auto sm:mx-0 w-28 h-36 sm:w-32 sm:h-40 border-2 border-noir-paper-ink/40 overflow-hidden">
                    <img
                      src={activeSuspect.portrait}
                      alt={activeSuspect.name}
                      className="w-full h-full object-cover suspect-portrait"
                    />
                  </div>
                  {/* bio text */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                      <h3 className="font-stamp text-2xl font-black text-noir-paper-ink">
                        {activeSuspect.name}
                      </h3>
                      <span className="font-stamp text-[11px] tracking-widest text-noir-crimson font-bold">
                        {activeSuspect.codename}
                      </span>
                    </div>

                    <div className="space-y-3 text-[11px] sm:text-xs">
                      <BioField
                        label="KARIER"
                        text={activeBio.career}
                        color="text-noir-brass"
                      />
                      <BioField
                        label="KEPRIBADIAN"
                        text={activeBio.personality}
                        color="text-noir-paper-ink"
                      />
                      <BioField
                        label="RAHASIA"
                        text={activeBio.secret}
                        color="text-noir-crimson"
                      />
                      <BioField
                        label="HUBUNGAN"
                        text={activeBio.relationship}
                        color="text-purple-700"
                      />
                    </div>

                    <div className="mt-4 pt-3 border-t border-noir-paper-ink/20">
                      <p className="font-typewriter text-[11px] text-noir-paper-ink/70 italic">
                        &ldquo;{activeSuspect.quote}&rdquo;{" "}
                        <span className="not-italic">
                          {activeSuspect.signature}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* close button */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      playClick();
                      setActiveId(null);
                    }}
                    data-cursor-active
                    className="font-typewriter text-[11px] text-noir-crimson hover:text-noir-blood underline underline-offset-2"
                  >
                    tutup biografi
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
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
    <div>
      <p
        className={`font-stamp text-[9px] tracking-[0.25em] font-bold uppercase mb-0.5 ${color}`}
      >
        {label}
      </p>
      <p className="font-typewriter text-noir-paper-ink/85 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
