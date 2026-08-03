"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import BabylonScene from "@/components/game/babylon/babylon-scene";

// ============================================================
// TYPES & DATA
// ============================================================
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
  fogColor: string;
  ambientColor: string;
  lightColor: string;
  lightIntensity: number;
  accentColor: string;
  wallColor: string;
  floorColor: string;
  roomType: string;
  description: string;
  clues: RoomClue[];
  characters: RoomChar[];
}

const LOCATIONS: Location[] = [
  {
    id: "panggung",
    name: "Panggung Utama",
    glyph: "🎭",
    fogColor: "#1a0d0a",
    ambientColor: "#5a4a3a",
    lightColor: "#ffcb7a",
    lightIntensity: 40,
    accentColor: "#ffcb7a",
    wallColor: "#4a3020",
    floorColor: "#2a1810",
    roomType: "panggung",
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
    fogColor: "#0d1a0d",
    ambientColor: "#4a5a4a",
    lightColor: "#ffb347",
    lightIntensity: 30,
    accentColor: "#ffb347",
    wallColor: "#2a4a2a",
    floorColor: "#1a2a1a",
    roomType: "ganti",
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
    fogColor: "#0a0d1a",
    ambientColor: "#3a4a5a",
    lightColor: "#4a9be8",
    lightIntensity: 25,
    accentColor: "#4a9be8",
    wallColor: "#1a2a3a",
    floorColor: "#0d1828",
    roomType: "studio",
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
    fogColor: "#1a1a0d",
    ambientColor: "#5a5a3a",
    lightColor: "#ffd9a0",
    lightIntensity: 20,
    accentColor: "#ffd9a0",
    wallColor: "#383828",
    floorColor: "#2a2a18",
    roomType: "kafe",
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
    fogColor: "#0d0d0d",
    ambientColor: "#4a4a2a",
    lightColor: "#c9a35a",
    lightIntensity: 18,
    accentColor: "#c9a35a",
    wallColor: "#3a3a20",
    floorColor: "#2a2a18",
    roomType: "arsip",
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
    fogColor: "#0d1a0d",
    ambientColor: "#2a4a2a",
    lightColor: "#00ff66",
    lightIntensity: 20,
    accentColor: "#00ff66",
    wallColor: "#1a2a1a",
    floorColor: "#0d180d",
    roomType: "server",
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

export default function LocationExplorer() {
  const [activeLocation, setActiveLocation] = useState<Location>(LOCATIONS[0]);
  const [examinedClues, setExaminedClues] = useState<Set<string>>(new Set());
  const [activeClueDetail, setActiveClueDetail] = useState<RoomClue | null>(null);

  const handleClueClick = useCallback((clue: RoomClue) => {
    setActiveClueDetail(clue);
    setExaminedClues((prev) => new Set(prev).add(clue.id));
  }, []);

  const babylonOptions = useMemo(
    () => ({
      fogColor: activeLocation.fogColor,
      ambientColor: activeLocation.ambientColor,
      lightColor: activeLocation.lightColor,
      lightIntensity: activeLocation.lightIntensity,
      accentColor: activeLocation.accentColor,
      wallColor: activeLocation.wallColor,
      floorColor: activeLocation.floorColor,
      roomType: activeLocation.roomType,
    }),
    [activeLocation]
  );

  return (
    <section
      id="lokasi-3d"
      className="relative py-16 sm:py-24 px-4 sm:px-6"
      aria-label="Eksplorasi Lokasi 3D"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold">
            · Eksplorasi TKP ·
          </span>
          <h2
            className="font-stamp text-2xl sm:text-4xl font-black text-noir-paper mt-2 mb-2"
            style={{ textShadow: "0 0 24px rgba(255,179,71,0.3)" }}
          >
            TEMPAT KEJADIAN 3D
          </h2>
          <p className="font-typewriter text-xs sm:text-sm text-noir-paper/60 max-w-md mx-auto">
            Jelajahi ruangan 3D dengan Babylon.js. Drag untuk rotate, scroll/pinch untuk zoom.
            Karakter ditampilkan di posisinya malam itu.
          </p>
        </div>

        {/* 3D Canvas — Babylon.js */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] border-2 border-noir-coffee/60 overflow-hidden rounded-sm bg-noir-ink">
          <BabylonScene
            options={babylonOptions}
            clues={activeLocation.clues}
            characters={activeLocation.characters}
            onClueClick={handleClueClick}
          />

          {/* Location name overlay */}
          <div className="absolute top-4 left-4 pointer-events-none z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-noir-ink/80 backdrop-blur border border-noir-brass/30 rounded">
              <span className="text-xl">{activeLocation.glyph}</span>
              <div>
                <p className="font-stamp text-sm font-bold text-noir-brass">
                  {activeLocation.name}
                </p>
                <p className="font-typewriter text-[9px] text-noir-paper/50">
                  TKP · JKT-48-001 · Babylon.js
                </p>
              </div>
            </div>
          </div>

          {/* Examined counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
            <div className="px-3 py-1.5 bg-noir-ink/80 backdrop-blur border border-noir-brass/30 rounded">
              <p className="font-stamp text-[10px] text-noir-brass">
                DIPERIKSA: {examinedClues.size}/{LOCATIONS.reduce((s, l) => s + l.clues.length, 0)}
              </p>
            </div>
          </div>

          {/* Character info */}
          {activeLocation.characters.length > 0 && (
            <div className="absolute bottom-4 right-4 pointer-events-none z-10">
              <div className="px-3 py-1.5 bg-noir-ink/80 backdrop-blur border border-noir-brass/30 rounded">
                <p className="font-stamp text-[10px] text-noir-brass">
                  🧍 {activeLocation.characters.map((c) => c.name).join(", ")}
                </p>
                <p className="font-typewriter text-[8px] text-noir-paper/50">di ruangan ini</p>
              </div>
            </div>
          )}

          {/* Clue detail popup */}
          {activeClueDetail && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-noir-ink via-noir-ink/95 to-transparent z-20"
            >
              <div className="border-l-2 border-noir-brass pl-3">
                <p className="font-stamp text-[9px] tracking-widest text-noir-brass font-bold uppercase">
                  ✓ {activeClueDetail.label}
                </p>
                <p className="font-typewriter text-xs text-noir-paper/90 italic">
                  {activeClueDetail.detail}
                </p>
                <button
                  onClick={() => setActiveClueDetail(null)}
                  className="font-typewriter text-[9px] text-noir-crimson hover:text-noir-blood underline mt-1"
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
              <p className="font-stamp text-[9px] text-noir-brass/60 tracking-widest uppercase">
                🔍 Drag untuk rotate · Scroll untuk zoom · Klik orb untuk petunjuk
              </p>
            </div>
          )}
        </div>

        {/* Location selector */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mt-4">
          {LOCATIONS.map((loc) => {
            const isActive = activeLocation.id === loc.id;
            const locClueCount = loc.clues.length;
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
                    ? "border-noir-brass bg-noir-brass/10 shadow-[0_0_12px_rgba(201,163,90,0.3)]"
                    : "border-noir-coffee/50 hover:border-noir-brass/50"
                }`}
              >
                <div className="text-lg sm:text-2xl mb-1">{loc.glyph}</div>
                <p
                  className={`font-stamp text-[8px] sm:text-[10px] font-bold leading-tight ${
                    isActive ? "text-noir-brass" : "text-noir-paper/60"
                  }`}
                >
                  {loc.name.split(" ")[0].toUpperCase()}
                </p>
                {examinedInLoc === locClueCount && locClueCount > 0 && (
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
