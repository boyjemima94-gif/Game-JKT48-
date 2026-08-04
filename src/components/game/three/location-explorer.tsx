"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface RoomClue {
  id: string;
  label: string;
  position: [number, number, number];
  detail: string;
}

interface RoomChar {
  suspectId: string;
  name: string;
  color: string;
  position: [number, number, number];
  rotation: number;
  action: string;
}

interface Location {
  id: string;
  name: string;
  glyph: string;
  description: string;
  clues: RoomClue[];
  characters: RoomChar[];
}

const LOCATIONS: Location[] = [
  {
    id: "panggung",
    name: "Panggung Utama",
    glyph: "🎭",
    description: "Panggung utama. Tirai beludru merah, lampu sorot hangat. Korban ditemukan di belakang tirai.",
    clues: [
      { id: "sepatu", label: "Bekas Sepatu", position: [-1.5, -0.8, -3], detail: "Bekas sepatu ukuran 42 di belakang tirai — bukan milik korban." },
      { id: "tirai", label: "Tirai Robek", position: [1.5, 0.5, -3.5], detail: "Tirai beludru robek di bagian bawah — tanda perjuangan." },
    ],
    characters: [
      { suspectId: "oline", name: "Oline", color: "#e0a83c", position: [-2, -0.8, -2.5], rotation: 0.3, action: "stand" },
    ],
  },
  {
    id: "ruang-ganti",
    name: "Ruang Ganti No.4",
    glyph: "🚪",
    description: "Ruang ganti dengan cermin bingkai lampu. Tempat Catherina berdebat dengan korban.",
    clues: [
      { id: "parfum", label: "Botol Parfum", position: [-1, -0.3, -3.5], detail: "Botol parfum mawar setengah kosong — baru dipakai." },
      { id: "note", label: "Note Tersembunyi", position: [1.5, 0, -3.8], detail: "Note kecil: 'Aku tahu apa kau lakukan.'" },
    ],
    characters: [
      { suspectId: "catherina", name: "Catherina", color: "#c0392b", position: [0, -0.8, -3], rotation: 0, action: "lean" },
    ],
  },
  {
    id: "studio",
    name: "Studio Rekaman B",
    glyph: "🎥",
    description: "Studio suntingan video. Monitor biru dingin. Fiony bekerja di sini.",
    clues: [
      { id: "usb", label: "Drive USB", position: [0.5, -0.4, -3.5], detail: "Drive USB dengan sidik jari Fiony." },
      { id: "log", label: "Log Komputer", position: [-1, 0.2, -3.8], detail: "Log: akses 23:05-23:12 — 7 menit tanpa input." },
    ],
    characters: [
      { suspectId: "fiony", name: "Fiony", color: "#7a5c8a", position: [0, -0.8, -3.5], rotation: 0, action: "type" },
    ],
  },
  {
    id: "kafe",
    name: "Kafe Lobi",
    glyph: "☕",
    description: "Kafe kecil di lobi theater. Abigail duduk sendirian.",
    clues: [
      { id: "tisu", label: "Tisu Bekas", position: [0.8, -0.5, -2], detail: "Tisu dengan lipstik pink — bukan milik Abigail." },
      { id: "ponsel", label: "Ponsel Terkunci", position: [-0.8, -0.5, -2], detail: "Ponsel Abigail — aplikasi pesan terenkripsi." },
    ],
    characters: [
      { suspectId: "abigail", name: "Abigail", color: "#9a7b4f", position: [0, -0.8, -2], rotation: 0.5, action: "sit" },
    ],
  },
  {
    id: "arsip",
    name: "Ruang Arsip",
    glyph: "📂",
    description: "Ruang arsip gelap berdebu. Hillary menyusup ke sini.",
    clues: [
      { id: "brankas", label: "Brankas Terbuka", position: [2, -0.3, -3.5], detail: "Brankas terbuka — dokumen kontrak Hillary hilang." },
      { id: "sidik", label: "Sidik Jari", position: [1.8, 0.5, -3.3], detail: "Sidik jari di gagang brankas — milik Hillary." },
    ],
    characters: [
      { suspectId: "hillary", name: "Hillary", color: "#5a8a6a", position: [1.5, -0.8, -2.5], rotation: -0.5, action: "stand" },
    ],
  },
  {
    id: "server",
    name: "Ruang Server",
    glyph: "🖥️",
    description: "Ruang server keamanan. Marsha mengakses CCTV malam itu.",
    clues: [
      { id: "terminal", label: "Terminal CCTV", position: [0, 0, -3.5], detail: "Log: CCTV dimatikan 23:17, dihidupkan 23:26." },
      { id: "stiker", label: "Stiker Laptop", position: [-1.5, -0.3, -3], detail: "Stiker Valkyrie48 tertutup stiker pizza." },
    ],
    characters: [
      { suspectId: "marsha", name: "Marsha", color: "#d46a9b", position: [0, -0.8, -3], rotation: 0, action: "type" },
    ],
  },
];

const ROOM_COLORS: Record<string, { bg: string; accent: string; border: string }> = {
  panggung: { bg: "from-red-950/40 to-noir-ink", accent: "text-amber-400", border: "border-amber-600/30" },
  "ruang-ganti": { bg: "from-green-950/40 to-noir-ink", accent: "text-orange-400", border: "border-orange-600/30" },
  studio: { bg: "from-blue-950/40 to-noir-ink", accent: "text-blue-400", border: "border-blue-600/30" },
  kafe: { bg: "from-yellow-950/40 to-noir-ink", accent: "text-yellow-400", border: "border-yellow-600/30" },
  arsip: { bg: "from-amber-950/40 to-noir-ink", accent: "text-amber-500", border: "border-amber-700/30" },
  server: { bg: "from-green-950/50 to-noir-ink", accent: "text-green-400", border: "border-green-600/30" },
};

export default function LocationExplorer() {
  const [activeLocation, setActiveLocation] = useState<Location>(LOCATIONS[0]);
  const [examinedClues, setExaminedClues] = useState<Set<string>>(new Set());
  const [activeClueDetail, setActiveClueDetail] = useState<RoomClue | null>(null);

  const handleClueClick = useCallback((clue: RoomClue) => {
    setActiveClueDetail(clue);
    setExaminedClues((prev) => new Set(prev).add(clue.id));
  }, []);

  return (
    <section
      id="lokasi-3d"
      className="relative py-16 sm:py-24 px-4 sm:px-6"
      aria-label="Eksplorasi Lokasi 3D"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold">
            · Eksplorasi TKP ·
          </span>
          <h2
            className="font-stamp text-2xl sm:text-4xl font-black text-noir-paper mt-2 mb-2"
            style={{ textShadow: "0 0 24px rgba(255,179,71,0.3)" }}
          >
            TEMPAT KEJADIAN
          </h2>
          <p className="font-typewriter text-xs sm:text-sm text-noir-paper/60 max-w-md mx-auto">
            Jelajahi setiap ruangan. Klik petunjuk untuk memeriksa. Karakter
            ditampilkan di posisinya malam itu.
          </p>
        </div>

        {/* Room Visualizer — CSS-based 3D perspective room */}
        <div
          className={`relative w-full aspect-[16/10] sm:aspect-[2/1] border-2 border-noir-coffee/60 overflow-hidden rounded-sm bg-gradient-to-b ${ROOM_COLORS[activeLocation.id]?.bg ?? "from-noir-coal to-noir-ink"}`}
        >
          {/* Floor with perspective */}
          <div className="absolute bottom-0 inset-x-0 h-1/2" style={{ perspective: "600px", perspectiveOrigin: "50% 0%" }}>
            <div
              className="absolute inset-0 origin-top"
              style={{
                transform: "rotateX(60deg)",
                backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 40px), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 40px)`,
              }}
            />
          </div>

          {/* Back wall texture */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-noir-coal/60 to-transparent">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Spotlight effect */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-full pointer-events-none"
            style={{
              background: `linear-gradient(180deg, ${ROOM_COLORS[activeLocation.id]?.accent.replace("text-", "rgba(") ?? "rgba(255,203,122,0.1)"} 0%, transparent 70%)`,
              opacity: 0.15,
              filter: "blur(20px)",
            }}
          />

          {/* Character silhouettes */}
          {activeLocation.characters.map((char) => (
            <div
              key={char.suspectId}
              className="absolute"
              style={{
                left: `${50 + char.position[0] * 8}%`,
                bottom: `${10 + (char.position[2] + 3) * 5}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="relative">
                <div
                  className="w-8 h-16 rounded-t-full rounded-b-md mx-auto animate-pulse"
                  style={{
                    background: `linear-gradient(180deg, ${char.color} 0%, ${char.color}40 100%)`,
                    boxShadow: `0 0 20px ${char.color}60`,
                  }}
                />
                <div
                  className="w-6 h-6 rounded-full mx-auto -mt-1"
                  style={{ background: "#d4a880", boxShadow: `0 0 10px ${char.color}80` }}
                />
                <p className="font-stamp text-[8px] text-noir-paper/60 text-center mt-1 whitespace-nowrap">
                  {char.name}
                </p>
              </div>
            </div>
          ))}

          {/* Clue markers */}
          {activeLocation.clues.map((clue) => {
            const examined = examinedClues.has(clue.id);
            return (
              <button
                key={clue.id}
                onClick={() => handleClueClick(clue)}
                className="absolute group"
                style={{
                  left: `${50 + clue.position[0] * 8}%`,
                  top: `${30 + (clue.position[1] + 1) * 20}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className={`w-6 h-6 rounded-full border-2 ${examined ? "border-green-400 bg-green-400/20" : "border-amber-400 bg-amber-400/20 animate-ping"} group-hover:scale-125 transition-transform`} />
                <div className="absolute -inset-2 rounded-full border border-amber-400/30 animate-pulse" />
                <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-stamp text-[8px] text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {clue.label}
                </span>
              </button>
            );
          })}

          {/* Location name */}
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-noir-ink/80 backdrop-blur border border-noir-brass/30 rounded">
              <span className="text-xl">{activeLocation.glyph}</span>
              <div>
                <p className="font-stamp text-sm font-bold text-noir-brass">{activeLocation.name}</p>
                <p className="font-typewriter text-[9px] text-noir-paper/50">TKP · JKT-48-001</p>
              </div>
            </div>
          </div>

          {/* Counter */}
          <div className="absolute top-4 right-4 z-10">
            <div className="px-3 py-1.5 bg-noir-ink/80 backdrop-blur border border-noir-brass/30 rounded">
              <p className="font-stamp text-[10px] text-noir-brass">
                DIPERIKSA: {examinedClues.size}/{LOCATIONS.reduce((s, l) => s + l.clues.length, 0)}
              </p>
            </div>
          </div>

          {/* Clue detail */}
          {activeClueDetail && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-noir-ink via-noir-ink/95 to-transparent z-20"
            >
              <div className="border-l-2 border-amber-400 pl-3">
                <p className="font-stamp text-[9px] tracking-widest text-amber-400 font-bold uppercase">
                  ✓ {activeClueDetail.label}
                </p>
                <p className="font-typewriter text-xs text-noir-paper/90 italic">{activeClueDetail.detail}</p>
                <button
                  onClick={() => setActiveClueDetail(null)}
                  className="font-typewriter text-[9px] text-red-400 hover:text-red-300 underline mt-1"
                >
                  tutup
                </button>
              </div>
            </motion.div>
          )}

          {/* Description */}
          {!activeClueDetail && (
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-noir-ink via-noir-ink/90 to-transparent z-10">
              <p className="font-typewriter text-xs text-noir-paper/70 mb-1 leading-relaxed">
                {activeLocation.description}
              </p>
              <p className="font-stamp text-[9px] text-amber-400/60 tracking-widest uppercase">
                🔍 Klik orb bercahaya untuk memeriksa petunjuk
              </p>
            </div>
          )}
        </div>

        {/* Location selector */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mt-4">
          {LOCATIONS.map((loc) => {
            const isActive = activeLocation.id === loc.id;
            const examinedInLoc = loc.clues.filter((c) => examinedClues.has(c.id)).length;
            return (
              <button
                key={loc.id}
                onClick={() => {
                  setActiveLocation(loc);
                  setActiveClueDetail(null);
                }}
                className={`relative p-2 sm:p-3 border-2 transition-all text-center ${
                  isActive
                    ? "border-amber-500 bg-amber-500/10 shadow-[0_0_12px_rgba(255,179,71,0.2)]"
                    : "border-noir-coffee/50 hover:border-amber-500/50"
                }`}
              >
                <div className="text-lg sm:text-2xl mb-1">{loc.glyph}</div>
                <p className={`font-stamp text-[8px] sm:text-[10px] font-bold ${isActive ? "text-amber-400" : "text-noir-paper/60"}`}>
                  {loc.name.split(" ")[0].toUpperCase()}
                </p>
                {examinedInLoc === loc.clues.length && loc.clues.length > 0 && (
                  <span className="absolute top-1 right-1 text-[8px] text-green-400 font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
