"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/lib/game-store";
import { SUSPECTS } from "@/lib/suspects";
import { playClick, playPaperRustle } from "@/lib/audio";

interface BondLevel {
  level: number;
  title: string;
  color: string;
  unlockText: string;
}

const BOND_LEVELS: BondLevel[] = [
  { level: 0, title: "Tidak Dikenal", color: "text-noir-paper/40", unlockText: "Pilih sekutu untuk memulai keterikatan." },
  { level: 1, title: "Kenalan", color: "text-noir-paper/60", unlockText: "Kau mulai mengenal mereka. Tapi mereka masih menutup diri." },
  { level: 2, title: "Percaya", color: "text-cyan-400", unlockText: "Mereka mulai membuka sedikit rahasia. Tapi hati-hati — kepercayaan rapuh." },
  { level: 3, title: "Terikat", color: "text-noir-brass", unlockText: "Hubungan dalam terbentuk. Mereka akan memberi petunjuk rahasia." },
  { level: 4, title: "Sekutu Sejati", color: "text-noir-tungsten", unlockText: "Keterikatan penuh. Mereka akan mengungkap kebenaran terdalam." },
];

interface BondMessage {
  level: number;
  from: string;
  text: string;
  type: "whisper" | "secret" | "warning" | "truth";
}

const BOND_MESSAGES: Record<string, BondMessage[]> = {
  oline: [
    { level: 1, from: "Oline", text: "Kau... berbeda dari detektif lain. Mereka hanya ingin menuduh. Kau mau dengar.", type: "whisper" },
    { level: 2, from: "Oline", text: "Aku tidak pernah bilang ini ke siapa-siapa. Tapi syal ini... bukan hadiah ibu. Dia pergi sebelum sempat memberi.", type: "secret" },
    { level: 3, from: "Oline", text: "Korban tahu aku mau pindah agensi. Dia ancam ungkap. Tapi aku tidak membunuhnya. Aku cuma... ingin bebas.", type: "truth" },
    { level: 4, from: "Oline", text: "Malam itu, aku di panggung. Tapi aku dengar sesuatu. Langkah kaki. Cepat. Menuju belakang. Bukan milik korban.", type: "truth" },
  ],
  catherina: [
    { level: 1, from: "Catherina", text: "Kau tidak langsung menuduhku. Itu... menyegarkan. Orang lain sudah memvonis sebelum bicara.", type: "whisper" },
    { level: 2, from: "Catherina", text: "Parfum mawar ini... bukan ritual sakti. Ini peninggalan ibu. Dia pergi saat aku 15. Parfum ini satu-satunya yang tersisa.", type: "secret" },
    { level: 3, from: "Catherina", text: "Aku membenci korban. Ya. Tapi aku tidak membunuhnya. Aku lebih baik dari itu. Aku ingin dia hancur perlahan, bukan cepat.", type: "truth" },
    { level: 4, from: "Catherina", text: "Malam itu, aku berdebat dengannya. Dia bilang: 'Kau sudah lewat masa subur.' Lalu dia tertawa. Aku pergi. Tapi aku dengar dia memanggil seseorang setelah aku pergi.", type: "truth" },
  ],
  adeline: [
    { level: 1, from: "Adeline", text: "Kau memperhatikan detail. Sepertiku. Kebanyakan orang hanya lihat permukaan.", type: "whisper" },
    { level: 2, from: "Adeline", text: "Sketchbook ini... bukan sekadar gambar. Setiap halaman adalah rahasia seseorang. Aku mengamati. Aku mencatat. Tapi aku tidak pernah memberitahu.", type: "secret" },
    { level: 3, from: "Adeline", text: "Korban pernah minta aku jadi mata-mata. Aku tolak. Dia ancam ungkap masa laluku. Tapi aku tidak membencinya. Dia juga punya luka.", type: "truth" },
    { level: 4, from: "Adeline", text: "Malam itu, dari atap, aku melihat seseorang keluar dari pintu belakang. Cepat. Membawa sesuatu. Aku gambar — tapi tanganku gemetar. Gambarnya... tidak jelas. Tapi ada satu detail yang aku ingat.", type: "truth" },
  ],
  abigail: [
    { level: 1, from: "Abigail", text: "Kau sabar mendengarkan. Tidak seperti yang lain yang langsung menuduh.", type: "whisper" },
    { level: 2, from: "Abigail", text: "Kalung salib ini... warisan nenek. Dia bilang: 'Berpegang pada ini saat takut.' Aku selalu takut. Setiap hari.", type: "secret" },
    { level: 3, from: "Abigail", text: "Aku tahu lebih banyak dari yang kukatakan. Tapi aku takut. Bukan takut dihukum — takut rahasia keluargaku terbongkar. Ayahku bisa masuk penjara.", type: "truth" },
    { level: 4, from: "Abigail", text: "Malam itu, di lorong, aku lihat Fiony terburu-buru. Membawa sesuatu. Tapi... aku juga lihat seseorang lain. Di bayang. Tidak bergerak. Menunggu.", type: "truth" },
  ],
  marsha: [
    { level: 1, from: "Marsha", text: "Kau pintar. Lebih pintar dari detektif biasa. Aku suka itu.", type: "whisper" },
    { level: 2, from: "Marsha", text: "Valkyrie48... bukan cuma grup side-project. Itu pelarian. Tempat aku bisa jadi diri sendiri, bukan 'idol JKT48'. Tapi kalau ketahuan, kontrak batal.", type: "secret" },
    { level: 3, from: "Marsha", text: "Ya, aku matikan CCTV. Tapi bukan untuk membunuh. Seseorang memintanya. Aku tidak akan bilang siapa — tapi alasan mereka... aku mengerti.", type: "truth" },
    { level: 4, from: "Marsha", text: "Orang yang memintaku matikan CCTV... bukan pelaku. Mereka ingin melindungi seseorang. Mereka tidak tahu apa yang akan terjadi. Kau percaya padaku?", type: "truth" },
  ],
  victoria: [
    { level: 1, from: "Victoria", text: "Kau... tidak memandangku seperti anak kecil. Kau melihatku sebagai... orang.", type: "whisper" },
    { level: 2, from: "Victoria", text: "Airmata ini... kadang asli, kadang tidak. Aku tidak tahu lagi mana yang mana. Sudah terlalu lama aku berpura-pura.", type: "secret" },
    { level: 3, from: "Victoria", text: "Korban memfoto situasi memalukanku. Dia bilang: 'Kalau kau tidak nurut, ini bocor.' Aku nurut. Tapi aku benci setiap detiknya.", type: "truth" },
    { level: 4, from: "Victoria", text: "Malam itu, aku menangis di lobi. Tapi aku juga... mengirim pesan. Kepada seseorang. Kukatakan: 'Dia ancam aku lagi. Tolong.' Tapi pesan itu... tidak pernah sampai. Aku hapus.", type: "truth" },
  ],
  hillary: [
    { level: 1, from: "Hillary", text: "...Kau tidak takut padaku. Orang lain biasanya menjauh. Kau berbeda.", type: "whisper" },
    { level: 2, from: "Hillary", text: "Topi ini... bukan gaya. Bekas luka bakar di kepala. Kecelakaan masa kecil. Aku sembunyikan dari semua orang.", type: "secret" },
    { level: 3, from: "Hillary", text: "Aku bukan member biasa. Aku dikirim oleh seseorang. Untuk mengawasi. Tapi aku tidak akan bilang siapa. Dan aku tidak membunuh korban — aku hanya mengambil dokumen milikku.", type: "truth" },
    { level: 4, from: "Hillary", text: "Malam itu, di ruang arsip, aku dengar pertengkaran. Suara korban. Dan seseorang lain. Aku tidak lihat siapa — tapi suaranya... aku kenal. Aku tidak akan bilang. Bukan karena takut. Karena... aku mengerti mengapa.", type: "truth" },
  ],
  fiony: [
    { level: 1, from: "Fiony", text: "Kau cek setiap detail. Sepertiku. Kebanyakan orang lewat tanpa melihat.", type: "whisper" },
    { level: 2, from: "Fiony", text: "Drive USB kedua... bukan cadangan kerja. Itu backup rahasia. Semua file yang korban hapus dari server. Aku simpan. Untuk antisipasi.", type: "secret" },
    { level: 3, from: "Fiony", text: "Korban mau ganti aku. Dengan orang luar. Setelah semua yang kubangun. Aku marah. Tapi aku tidak membunuhnya. Aku cuma... ambil karyaku kembali.", type: "truth" },
    { level: 4, from: "Fiony", text: "Log komputer menunjukkan 7 menit tanpa input. Tapi sebenarnya, ada input — dari terminal jarak jauh. Seseorang mengakses komputer-ku dari ruang server. Bukan aku. Aku tidur di kursi saat itu.", type: "truth" },
  ],
};

const TYPE_STYLES = {
  whisper: { color: "text-noir-paper/70", border: "border-noir-paper/20", icon: "💭" },
  secret: { color: "text-purple-400", border: "border-purple-500/40", icon: "🔐" },
  warning: { color: "text-orange-400", border: "border-orange-500/40", icon: "⚠" },
  truth: { color: "text-noir-brass", border: "border-noir-brass/50", icon: "★" },
};

/**
 * Personal Bond System — player forms a relationship with one suspect.
 * As they investigate (examine evidence, interrogate, solve timeline),
 * the bond deepens, unlocking personal messages and secrets.
 */
export default function PersonalBond() {
  const [bondedSuspectId, setBondedSuspectId] = useState<string | null>(null);
  const [bondLevel, setBondLevel] = useState(0);
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const examinedEvidence = useGame((s) => s.examinedEvidence);
  const interrogatedSuspects = useGame((s) => s.interrogatedSuspects);
  const timelineSolved = useGame((s) => s.timelineSolved);
  const clues = useGame((s) => s.clues);

  // Calculate bond level based on investigation progress with this suspect
  useEffect(() => {
    if (!bondedSuspectId) {
      requestAnimationFrame(() => setBondLevel(0));
      return;
    }
    const evidenceCount = Object.keys(examinedEvidence).length;
    const interrogated = !!interrogatedSuspects[bondedSuspectId];
    const suspectClues = clues.filter((c) => c.suspectId === bondedSuspectId).length;

    let level = 0;
    if (evidenceCount >= 2 || suspectClues >= 1) level = 1;
    if (interrogated || suspectClues >= 2) level = 2;
    if (suspectClues >= 3 || (interrogated && evidenceCount >= 4)) level = 3;
    if (timelineSolved && suspectClues >= 3) level = 4;

    requestAnimationFrame(() => setBondLevel(level));
  }, [bondedSuspectId, examinedEvidence, interrogatedSuspects, clues, timelineSolved]);

  const bondedSuspect = bondedSuspectId
    ? SUSPECTS.find((s) => s.id === bondedSuspectId)
    : null;
  const currentLevel = BOND_LEVELS[bondLevel];
  const messages = bondedSuspectId
    ? BOND_MESSAGES[bondedSuspectId] ?? []
    : [];
  const unlockedMessages = messages.filter((m) => m.level <= bondLevel);
  const lockedMessages = messages.filter((m) => m.level > bondLevel);

  return (
    <section
      id="ikatan"
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      aria-label="Keterikatan Personal"
    >
      <div className="max-w-3xl mx-auto">
        {/* header */}
        <div className="text-center mb-10">
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Keterikatan ·
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3"
            style={{
              textShadow: "0 0 24px rgba(255,179,71,0.3), 0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            SEKUTU PERSONAL
          </h2>
          <p className="font-typewriter text-sm text-noir-paper/70 max-w-lg mx-auto">
            Pilih satu karakter untuk dijalin keterikatan. Semakin dalam
            penyelidikanmu tentang mereka, semakin banyak rahasia yang
            terungkap.
          </p>
        </div>

        {!bondedSuspect ? (
          /* Selection screen */
          <div className="paper-texture paper-edge paper-burn p-5 sm:p-6">
            <p className="font-stamp text-[10px] tracking-widest text-noir-crimson font-bold uppercase mb-4 pb-2 border-b border-noir-paper-ink/20">
              Pilih Sekutu
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SUSPECTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    playClick();
                    playPaperRustle(0.4, 0.4);
                    setBondedSuspectId(s.id);
                  }}
                  data-cursor-active
                  className="group text-center"
                >
                  <div className="relative aspect-[3/4] border-2 border-noir-paper-ink/20 overflow-hidden group-hover:border-noir-brass transition-colors">
                    <img
                      src={s.portrait}
                      alt={s.name}
                      className="w-full h-full object-cover suspect-portrait group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir-ink/90 to-transparent" />
                    <p className="absolute bottom-1 inset-x-0 font-stamp text-[9px] font-bold text-noir-paper truncate px-1">
                      {s.name.split(" ")[0]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Bond screen */
          <div className="paper-texture paper-edge paper-burn p-5 sm:p-6">
            {/* suspect header */}
            <div className="flex items-center gap-4 mb-5 pb-4 border-b border-noir-paper-ink/20">
              <div className="w-16 h-20 border-2 border-noir-paper-ink/30 overflow-hidden shrink-0">
                <img
                  src={bondedSuspect.portrait}
                  alt={bondedSuspect.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-stamp text-lg font-black text-noir-paper-ink">
                  {bondedSuspect.name}
                </p>
                <p className="font-stamp text-[10px] tracking-widest text-noir-crimson">
                  {bondedSuspect.codename}
                </p>
                <p className={`font-stamp text-xs font-bold mt-1 ${currentLevel.color}`}>
                  Tingkat: {currentLevel.title}
                </p>
              </div>
              <button
                onClick={() => {
                  playClick();
                  setBondedSuspectId(null);
                }}
                data-cursor-active
                className="font-typewriter text-[10px] text-noir-crimson hover:text-noir-blood underline"
              >
                putus
              </button>
            </div>

            {/* bond level progress */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-stamp text-[10px] tracking-widest text-noir-paper-ink/60 uppercase">
                  Kedalaman Ikatan
                </span>
                <span className="font-stamp text-xs font-bold text-noir-paper-ink">
                  {bondLevel}/4
                </span>
              </div>
              <div className="flex gap-1">
                {BOND_LEVELS.slice(1).map((lvl) => (
                  <div
                    key={lvl.level}
                    className={`flex-1 h-2 rounded-full transition-colors ${
                      bondLevel >= lvl.level
                        ? "bg-gradient-to-r from-noir-crimson to-noir-brass"
                        : "bg-noir-paper-ink/15"
                    }`}
                  />
                ))}
              </div>
              <p className={`font-typewriter text-[11px] mt-2 italic ${currentLevel.color}`}>
                {currentLevel.unlockText}
              </p>
            </div>

            {/* messages */}
            <div className="space-y-2">
              <p className="font-stamp text-[10px] tracking-widest text-noir-crimson font-bold uppercase mb-2">
                Pesan Rahasia
              </p>
              {unlockedMessages.map((msg, i) => {
                const style = TYPE_STYLES[msg.type];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`border-l-2 ${style.border} pl-3 py-2 cursor-pointer hover:bg-noir-paper/10 transition-colors`}
                    onClick={() => {
                      playClick();
                      setShowMessage(showMessage === `${i}` ? null : `${i}`);
                    }}
                    data-cursor-active
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{style.icon}</span>
                      <span className={`font-stamp text-[10px] font-bold ${style.color} uppercase`}>
                        Tingkat {msg.level} · {msg.from}
                      </span>
                    </div>
                    <p className="font-typewriter text-xs text-noir-paper-ink/85 italic leading-relaxed">
                      &ldquo;{msg.text}&rdquo;
                    </p>
                  </motion.div>
                );
              })}

              {lockedMessages.map((msg, i) => (
                <div
                  key={`locked-${i}`}
                  className="border-l-2 border-noir-paper-ink/10 pl-3 py-2 opacity-40"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>🔒</span>
                    <span className="font-stamp text-[10px] font-bold text-noir-paper-ink/40 uppercase">
                      Tingkat {msg.level} · Terkunci
                    </span>
                  </div>
                  <p className="font-typewriter text-xs text-noir-paper-ink/40 italic">
                    Perdalam penyelidikan untuk membuka pesan ini...
                  </p>
                </div>
              ))}
            </div>

            {/* hint to deepen bond */}
            {bondLevel < 4 && (
              <div className="mt-4 pt-3 border-t border-noir-paper-ink/15">
                <p className="font-typewriter text-[10px] text-noir-paper-ink/50 italic">
                  💡 {bondLevel === 0 && "Periksa bukti di Loker Bukti untuk mulai mengenal mereka."}
                  {bondLevel === 1 && `Interogasi ${bondedSuspect.name} di Papan Benang Merah untuk memperdalam kepercayaan.`}
                  {bondLevel === 2 && `Temukan lebih banyak petunjuk tentang ${bondedSuspect.name} (butuh 3+ petunjuk).`}
                  {bondLevel === 3 && "Selesaikan Rekonstruksi Linimasa untuk membuka kebenaran terdalam."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
