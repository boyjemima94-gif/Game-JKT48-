"use client";

import { useRef, useMemo, useState, Suspense, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

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
  action: "stand" | "sit" | "type" | "cry" | "lean";
}

interface Location {
  id: string;
  name: string;
  glyph: string;
  fogColor: string;
  ambientColor: string;
  lightColor: string;
  lightIntensity: number;
  accent: string;
  wallColor: string;
  floorColor: string;
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
    accent: "#ffcb7a",
    wallColor: "#4a3020",
    floorColor: "#2a1810",
    description: "Panggung utama Teatro. Tirai beludru merah, lampu sorot hangat. Korban ditemukan di belakang tirai.",
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
    accent: "#ffb347",
    wallColor: "#2a4a2a",
    floorColor: "#1a2a1a",
    description: "Ruang ganti dengan cermin bingkai lampu. Meja rias berisi kosmetik. Tempat Catherina berdebat dengan korban.",
    clues: [
      { id: "parfum", label: "Botol Parfum", position: [-1, -0.3, -3.5], detail: "Botol parfum mawar setengah kosong — baru dipakai malam itu." },
      { id: "note", label: "Note Tersembunyi", position: [1.5, 0, -3.8], detail: "Note kecil di balik meja rias: 'Aku tahu apa kau lakukan.'" },
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
    accent: "#4a9be8",
    wallColor: "#1a2a3a",
    floorColor: "#0d1828",
    description: "Studio suntingan video. Monitor biru dingin, meja mixing, kabel berserakan. Fiony bekerja di sini.",
    clues: [
      { id: "usb", label: "Drive USB", position: [0.5, -0.4, -3.5], detail: "Drive USB hitam di bawah meja — sidik jari Fiony terdeteksi." },
      { id: "log", label: "Log Komputer", position: [-1, 0.2, -3.8], detail: "Log menunjukkan akses 23:05-23:12 — 7 menit tanpa input keyboard." },
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
    accent: "#ffd9a0",
    wallColor: "#3a3a28",
    floorColor: "#2a2a18",
    description: "Kafe kecil di lobi theater. Meja bundar, cangkir kopi, tanaman hias. Abigail duduk sendirian.",
    clues: [
      { id: "tisu", label: "Tisu Bekas", position: [0.8, -0.5, -2], detail: "Tisu basah dengan lipstik pink — bukan milik Abigail." },
      { id: "ponsel", label: "Ponsel Terkunci", position: [-0.8, -0.5, -2], detail: "Ponsel Abigail — aplikasi pesan terenkripsi terbuka." },
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
    accent: "#c9a35a",
    wallColor: "#3a3a20",
    floorColor: "#2a2a18",
    description: "Ruang arsip gelap berdebu. Rak buku tinggi, brankas baja, kotak arsip. Hillary menyusup ke sini.",
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
    accent: "#00ff66",
    wallColor: "#1a2a1a",
    floorColor: "#0d180d",
    description: "Ruang server keamanan. Rack server dengan LED hijau berkedip. Terminal CCTV. Marsha mengakses malam itu.",
    clues: [
      { id: "terminal", label: "Terminal CCTV", position: [0, 0, -3.5], detail: "Log terminal: CCTV dimatikan 23:17, dihidupkan 23:26." },
      { id: "stiker", label: "Stiker Laptop", position: [-1.5, -0.3, -3], detail: "Stiker Valkyrie48 tertutup stiker pizza — milik Marsha." },
    ],
    characters: [
      { suspectId: "marsha", name: "Marsha", color: "#d46a9b", position: [0, -0.8, -3], rotation: 0, action: "type" },
    ],
  },
];

// ============================================================
// STYLIZED CHARACTER MODEL — low-poly figure with color
// ============================================================
function StylizedCharacter({ char }: { char: RoomChar }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // idle animation based on action
    if (char.action === "stand") {
      groupRef.current.position.y = char.position[1] + Math.sin(t * 1.5) * 0.02;
    } else if (char.action === "type") {
      groupRef.current.rotation.x = Math.sin(t * 8) * 0.03;
    } else if (char.action === "cry") {
      groupRef.current.position.y = char.position[1] + Math.sin(t * 0.8) * 0.04;
      groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    } else if (char.action === "lean") {
      groupRef.current.rotation.z = 0.15 + Math.sin(t * 0.6) * 0.02;
    } else if (char.action === "sit") {
      // sitting is static
    }
  });

  const bodyColor = useMemo(() => new THREE.Color(char.color), [char.color]);
  const skinColor = useMemo(() => new THREE.Color("#d4a880"), []);

  return (
    <group ref={groupRef} position={char.position} rotation={[0, char.rotation, 0]}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]} >
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>
      {/* Hair (colored cap) */}
      <mesh position={[0, 1.6, 0]} >
        <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>
      {/* Body/torso */}
      <mesh position={[0, 0.8, 0]} >
        <capsuleGeometry args={[0.22, 0.6, 8, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.3, 0.9, 0]} rotation={[0, 0, 0.3]} >
        <capsuleGeometry args={[0.08, 0.5, 8, 12]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.3, 0.9, 0]} rotation={[0, 0, -0.3]} >
        <capsuleGeometry args={[0.08, 0.5, 8, 12]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.12, 0.15, 0]} >
        <capsuleGeometry args={[0.1, 0.4, 8, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      <mesh position={[0.12, 0.15, 0]} >
        <capsuleGeometry args={[0.1, 0.4, 8, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      {/* Name label glow under feet */}
      <pointLight position={[0, 0, 0]} color={char.color} intensity={1.5} distance={1.5} decay={2} />
    </group>
  );
}

// ============================================================
// ROOM-SPECIFIC PROPS — detailed geometry per location
// ============================================================
function StageProps() {
  return (
    <group>
      {/* Curtain — velvet red, pleated */}
      <mesh position={[0, 1.5, -4.5]} receiveShadow>
        <planeGeometry args={[10, 5, 8, 1]} />
        <meshStandardMaterial color="#5a1a1a" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* Stage platform — wood */}
      <mesh position={[0, -0.7, -2]} receiveShadow>
        <boxGeometry args={[6, 0.6, 3]} />
        <meshStandardMaterial color="#3a2410" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Stage edge — brass trim */}
      <mesh position={[0, -0.4, -0.5]}>
        <boxGeometry args={[6, 0.05, 0.1]} />
        <meshStandardMaterial color="#c9a35a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Spotlight bar overhead */}
      <mesh position={[0, 3.5, -1]} >
        <boxGeometry args={[4, 0.1, 0.15]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Two spotlights on bar */}
      <mesh position={[-1.5, 3.4, -1]}>
        <cylinderGeometry args={[0.12, 0.15, 0.25, 12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1.5, 3.4, -1]}>
        <cylinderGeometry args={[0.12, 0.15, 0.25, 12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Audience chairs (simple) */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-3 + i * 1.5, -0.7, 1.5]} >
          <boxGeometry args={[0.4, 0.5, 0.4]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function DressingRoomProps() {
  return (
    <group>
      {/* Mirror with light bulb frame */}
      <mesh position={[0, 1, -4.3]} receiveShadow>
        <planeGeometry args={[2.5, 2]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Mirror frame */}
      <mesh position={[0, 1, -4.35]}>
        <boxGeometry args={[2.7, 2.2, 0.05]} />
        <meshStandardMaterial color="#c9a35a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Light bulbs around mirror */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const x = Math.cos(angle) * 1.3;
        const y = 1 + Math.sin(angle) * 1.05;
        return (
          <mesh key={i} position={[x, y, -4.25]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ffb347" emissive="#ffb347" emissiveIntensity={1.5} />
          </mesh>
        );
      })}
      {/* Dressing table */}
      <mesh position={[0, -0.5, -4]} receiveShadow>
        <boxGeometry args={[3.5, 0.1, 1.2]} />
        <meshStandardMaterial color="#3a2c20" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Table legs */}
      <mesh position={[-1.5, -0.85, -4]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#2a1a10" />
      </mesh>
      <mesh position={[1.5, -0.85, -4]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#2a1a10" />
      </mesh>
      {/* Perfume bottle on table */}
      <mesh position={[-1, -0.4, -3.8]} >
        <cylinderGeometry args={[0.08, 0.1, 0.2, 12]} />
        <meshStandardMaterial color="#ff69b4" transparent opacity={0.6} roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Makeup items */}
      <mesh position={[0.5, -0.42, -3.7]}>
        <boxGeometry args={[0.15, 0.08, 0.08]} />
        <meshStandardMaterial color="#d4a880" roughness={0.5} />
      </mesh>
      <mesh position={[1, -0.4, -3.9]}>
        <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
        <meshStandardMaterial color="#8b1a1a" roughness={0.4} />
      </mesh>
      {/* Hanging costume */}
      <mesh position={[-2.5, 0.5, -3.5]} >
        <boxGeometry args={[0.5, 1.5, 0.1]} />
        <meshStandardMaterial color="#4a2a4a" roughness={0.8} />
      </mesh>
    </group>
  );
}

function StudioProps() {
  return (
    <group>
      {/* Triple monitor setup */}
      {[-1, 0, 1].map((x) => (
        <mesh key={x} position={[x, 0.1, -4]} >
          <boxGeometry args={[1, 0.6, 0.08]} />
          <meshStandardMaterial
            color="#0a1525"
            emissive="#1a3a6a"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.5}
          />
        </mesh>
      ))}
      {/* Monitor glow lights */}
      <pointLight position={[0, 0.1, -3.5]} color="#4a9be8" intensity={3} distance={4} />
      {/* Desk */}
      <mesh position={[0, -0.7, -4]} receiveShadow>
        <boxGeometry args={[4, 0.1, 1.5]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Desk legs */}
      {[-1.8, 1.8].map((x) => (
        <mesh key={x} position={[x, -1, -4]}>
          <boxGeometry args={[0.08, 0.5, 0.08]} />
          <meshStandardMaterial color="#0d0d18" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* Office chair */}
      <mesh position={[0, -0.6, -3]} >
        <boxGeometry args={[0.5, 0.6, 0.5]} />
        <meshStandardMaterial color="#0d0d18" roughness={0.7} />
      </mesh>
      {/* Keyboard */}
      <mesh position={[0, -0.6, -3.8]}>
        <boxGeometry args={[0.8, 0.03, 0.25]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
      </mesh>
      {/* Cables on floor */}
      <mesh position={[1.5, -0.95, -3]} rotation={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      {/* Speakers */}
      <mesh position={[-2, 0.5, -3.5]} >
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      <mesh position={[2, 0.5, -3.5]} >
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
    </group>
  );
}

function CafeProps() {
  return (
    <group>
      {/* Round table */}
      <mesh position={[0, -0.6, -2]} receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.06, 24]} />
        <meshStandardMaterial color="#3a2c20" roughness={0.6} />
      </mesh>
      {/* Table leg */}
      <mesh position={[0, -0.9, -2]}>
        <cylinderGeometry args={[0.06, 0.08, 0.5, 12]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.7} />
      </mesh>
      {/* Table base */}
      <mesh position={[0, -1.1, -2]}>
        <cylinderGeometry args={[0.3, 0.35, 0.05, 16]} />
        <meshStandardMaterial color="#2a1a10" />
      </mesh>
      {/* Coffee cup */}
      <mesh position={[0.3, -0.52, -2]} >
        <cylinderGeometry args={[0.08, 0.06, 0.12, 12]} />
        <meshStandardMaterial color="#e8dcc0" roughness={0.4} />
      </mesh>
      {/* Coffee (dark liquid) */}
      <mesh position={[0.3, -0.48, -2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.02, 12]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.3} />
      </mesh>
      {/* Saucer */}
      <mesh position={[0.3, -0.55, -2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 12]} />
        <meshStandardMaterial color="#e8dcc0" roughness={0.4} />
      </mesh>
      {/* Chair */}
      <mesh position={[0, -0.7, -1.2]} >
        <boxGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color="#2a2a1a" roughness={0.8} />
      </mesh>
      {/* Plant in corner */}
      <mesh position={[-2.5, -0.3, -3]} >
        <cylinderGeometry args={[0.15, 0.2, 0.4, 8]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.8} />
      </mesh>
      <mesh position={[-2.5, 0.1, -3]} >
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial color="#2a5a2a" roughness={0.9} />
      </mesh>
      {/* Window with light */}
      <mesh position={[2.5, 1, -4]} receiveShadow>
        <planeGeometry args={[1.5, 2]} />
        <meshStandardMaterial color="#ffd9a0" emissive="#ffd9a0" emissiveIntensity={0.3} />
      </mesh>
      <pointLight position={[2.5, 1, -3.5]} color="#ffd9a0" intensity={1} distance={3} />
    </group>
  );
}

function ArchiveProps() {
  return (
    <group>
      {/* Tall bookshelves (3 shelves) */}
      {Array.from({ length: 3 }).map((_, i) => (
        <group key={i}>
          <mesh position={[-2, -0.5 + i * 0.9, -4]} receiveShadow>
            <boxGeometry args={[2.5, 0.08, 0.6]} />
            <meshStandardMaterial color="#2a1a10" roughness={0.85} />
          </mesh>
          {/* Books on shelf */}
          {Array.from({ length: 6 }).map((_, j) => (
            <mesh key={j} position={[-3 + j * 0.4, -0.3 + i * 0.9, -3.9]} >
              <boxGeometry args={[0.08, 0.35, 0.2]} />
              <meshStandardMaterial
                color={["#5a1a1a", "#1a3a5a", "#5a5a1a", "#3a1a3a", "#1a5a3a", "#5a3a1a"][j]}
                roughness={0.8}
              />
            </mesh>
          ))}
        </group>
      ))}
      {/* Shelf side panels */}
      <mesh position={[-3.2, 0.4, -3.8]}>
        <boxGeometry args={[0.08, 2.8, 0.5]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.85} />
      </mesh>
      <mesh position={[-0.8, 0.4, -3.8]}>
        <boxGeometry args={[0.08, 2.8, 0.5]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.85} />
      </mesh>
      {/* Brankas (safe) */}
      <mesh position={[2, -0.2, -3.8]} receiveShadow>
        <boxGeometry args={[0.9, 1.4, 0.7]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Safe dial */}
      <mesh position={[2, 0.2, -3.4]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        <meshStandardMaterial color="#c9a35a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Safe handle */}
      <mesh position={[2, -0.1, -3.4]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.05, 0.05]} />
        <meshStandardMaterial color="#c9a35a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Archive boxes on floor */}
      <mesh position={[1, -0.85, -2]} >
        <boxGeometry args={[0.5, 0.3, 0.4]} />
        <meshStandardMaterial color="#4a3a20" roughness={0.9} />
      </mesh>
      <mesh position={[1.5, -0.85, -2.5]} >
        <boxGeometry args={[0.4, 0.25, 0.35]} />
        <meshStandardMaterial color="#3a2a18" roughness={0.9} />
      </mesh>
      {/* Desk lamp */}
      <mesh position={[-1.5, -0.5, -3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} />
      </mesh>
      <mesh position={[-1.5, -0.2, -3.1]}>
        <coneGeometry args={[0.12, 0.15, 12]} />
        <meshStandardMaterial color="#c9a35a" emissive="#c9a35a" emissiveIntensity={0.5} />
      </mesh>
      <pointLight position={[-1.5, -0.2, -2.8]} color="#c9a35a" intensity={1} distance={2} />
    </group>
  );
}

function ServerProps() {
  return (
    <group>
      {/* Server racks (3 tall racks) */}
      {[-2, 0, 2].map((x, rackIdx) => (
        <group key={rackIdx} position={[x, 0, -4]}>
          {/* Rack body */}
          <mesh receiveShadow>
            <boxGeometry args={[0.7, 2.8, 0.6]} />
            <meshStandardMaterial color="#0d1a0d" roughness={0.5} metalness={0.5} />
          </mesh>
          {/* LED rows (blinking) */}
          {Array.from({ length: 6 }).map((_, j) => (
            <group key={j} position={[0, -1.2 + j * 0.4, 0.31]}>
              {Array.from({ length: 4 }).map((_, k) => (
                <mesh key={k} position={[-0.2 + k * 0.13, 0, 0]}>
                  <sphereGeometry args={[0.025, 8, 8]} />
                  <meshStandardMaterial
                    color={k % 2 === 0 ? "#00ff66" : "#00aa44"}
                    emissive={k % 2 === 0 ? "#00ff66" : "#00aa44"}
                    emissiveIntensity={Math.random() * 2 + 1}
                  />
                </mesh>
              ))}
            </group>
          ))}
          {/* Rack ventilation lines */}
          {Array.from({ length: 3 }).map((_, j) => (
            <mesh key={`v${j}`} position={[0, 1 + j * 0.15, 0.31]}>
              <boxGeometry args={[0.5, 0.02, 0.01]} />
              <meshStandardMaterial color="#0a1a0a" />
            </mesh>
          ))}
        </group>
      ))}
      {/* CCTV monitor on wall */}
      <mesh position={[0, 1.5, -4.4]} >
        <boxGeometry args={[1.2, 0.8, 0.08]} />
        <meshStandardMaterial color="#0a1525" emissive="#00ff66" emissiveIntensity={0.2} roughness={0.2} />
      </mesh>
      {/* Monitor glow */}
      <pointLight position={[0, 1.5, -4]} color="#00ff66" intensity={1.5} distance={3} />
      {/* Terminal desk */}
      <mesh position={[0, -0.7, -3]} receiveShadow>
        <boxGeometry args={[1.5, 0.08, 0.8]} />
        <meshStandardMaterial color="#1a2a1a" roughness={0.6} />
      </mesh>
      {/* Keyboard */}
      <mesh position={[0, -0.6, -2.8]}>
        <boxGeometry args={[0.5, 0.03, 0.15]} />
        <meshStandardMaterial color="#0a1a0a" roughness={0.5} />
      </mesh>
      {/* Cables on floor */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[-1.5 + i, -0.98, -2.5 + i * 0.3]} rotation={[0, i * 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1 + i * 0.3, 6]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================
// CLUE ORB — clickable glowing marker in 3D
// ============================================================
function ClueOrb({
  clue,
  onHover,
  onUnhover,
  onClick,
}: {
  clue: RoomClue;
  onHover: (clue: RoomClue | null) => void;
  onUnhover: () => void;
  onClick: (clue: RoomClue) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.position.y = clue.position[1] + Math.sin(t * 2) * 0.05;
      meshRef.current.rotation.y = t * 0.5;
    }
    if (haloRef.current) {
      const scale = 1 + Math.sin(t * 3) * 0.1;
      haloRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={clue.position}>
      {/* Glowing orb */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(clue);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onUnhover();
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(clue);
        }}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#ffcb7a"
          emissive="#ffcb7a"
          emissiveIntensity={3}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial
          color="#ffcb7a"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Point light to illuminate surroundings */}
      <pointLight color="#ffcb7a" intensity={2} distance={2} decay={2} />
    </group>
  );
}

// ============================================================
// 3D ROOM — assembles walls, floor, lighting, props, characters, clues
// ============================================================
function Room3D({
  location,
  onClueHover,
  onClueUnhover,
  onClueClick,
}: {
  location: Location;
  onClueHover: (clue: RoomClue | null) => void;
  onClueUnhover: () => void;
  onClueClick: (clue: RoomClue) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const spotlightRef = useRef<THREE.SpotLight>(null);

  // Procedural wall texture
  const wallTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = location.wallColor;
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const b = Math.random() * 30 - 15;
      ctx.fillStyle = `rgba(${b > 0 ? 255 : 0},${b > 0 ? 255 : 0},${b > 0 ? 255 : 0},${Math.abs(b) / 100})`;
      ctx.fillRect(x, y, 2, 2);
    }
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * 256;
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(x, 0, 3 + Math.random() * 5, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    return tex;
  }, [location.wallColor]);

  const floorTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = location.floorColor;
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 8; i++) {
      const y = i * 32;
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, y, 256, 1);
      for (let j = 0; j < 100; j++) {
        const px = Math.random() * 256;
        const py = y + Math.random() * 32;
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
        ctx.fillRect(px, py, 2, 1);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 3);
    return tex;
  }, [location.floorColor]);

  const wallMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: wallTexture, roughness: 0.9, metalness: 0.05 }),
    [wallTexture]
  );
  const floorMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.85, metalness: 0.1 }),
    [floorTexture]
  );

  // Particle system
  const particleGeo = useMemo(() => {
    const count = 80;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 5 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.06) * 0.01;
    }
    if (spotlightRef.current) {
      const flicker = 0.92 + Math.sin(t * 15) * 0.04 + Math.sin(t * 7.3) * 0.03;
      spotlightRef.current.intensity = location.lightIntensity * flicker;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <mesh material={floorMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
      </mesh>
      {/* Back wall */}
      <mesh material={wallMat} position={[0, 1.5, -5]} receiveShadow>
        <planeGeometry args={[14, 7]} />
      </mesh>
      {/* Left wall */}
      <mesh material={wallMat} rotation={[0, Math.PI / 2, 0]} position={[-6, 1.5, 0]} receiveShadow>
        <planeGeometry args={[12, 7]} />
      </mesh>
      {/* Right wall */}
      <mesh material={wallMat} rotation={[0, -Math.PI / 2, 0]} position={[6, 1.5, 0]} receiveShadow>
        <planeGeometry args={[12, 7]} />
      </mesh>
      {/* Ceiling */}
      <mesh material={wallMat} rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[14, 12]} />
      </mesh>

      {/* Main spotlight */}
      <spotLight
        ref={spotlightRef}
        position={[0, 4.5, 1]}
        angle={0.8}
        penumbra={0.4}
        intensity={location.lightIntensity}
        color={location.lightColor}
        distance={30}
        decay={0.8}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
      />

      {/* Directional fill */}
      <directionalLight position={[2, 5, 3]} intensity={0.4} color={location.ambientColor} />

      {/* Ambient + hemisphere */}
      <ambientLight intensity={0.6} color={location.ambientColor} />
      <hemisphereLight args={[location.ambientColor, location.floorColor, 0.5]} />

      {/* Wall fill lights */}
      <pointLight position={[-3, 2, 1]} color={location.ambientColor} intensity={8} distance={12} decay={1.5} />
      <pointLight position={[3, 2, 1]} color={location.ambientColor} intensity={8} distance={12} decay={1.5} />
      <pointLight position={[0, 2, -3]} color={location.ambientColor} intensity={6} distance={10} decay={1.5} />

      {/* Pillars */}
      <group position={[-3.5, 0, -3]}>
        <mesh position={[0, -0.7, 0]} ><boxGeometry args={[0.5, 0.2, 0.5]} /><meshStandardMaterial color={location.wallColor} /></mesh>
        <mesh position={[0, 0, 0]} ><cylinderGeometry args={[0.18, 0.22, 3.4, 12]} /><meshStandardMaterial color={location.wallColor} roughness={0.75} metalness={0.15} /></mesh>
        <mesh position={[0, 1.85, 0]} ><boxGeometry args={[0.5, 0.2, 0.5]} /><meshStandardMaterial color={location.wallColor} /></mesh>
      </group>
      <group position={[3.5, 0, -3]}>
        <mesh position={[0, -0.7, 0]} ><boxGeometry args={[0.5, 0.2, 0.5]} /><meshStandardMaterial color={location.wallColor} /></mesh>
        <mesh position={[0, 0, 0]} ><cylinderGeometry args={[0.18, 0.22, 3.4, 12]} /><meshStandardMaterial color={location.wallColor} roughness={0.75} metalness={0.15} /></mesh>
        <mesh position={[0, 1.85, 0]} ><boxGeometry args={[0.5, 0.2, 0.5]} /><meshStandardMaterial color={location.wallColor} /></mesh>
      </group>

      {/* Room-specific props */}
      {location.id === "panggung" && <StageProps />}
      {location.id === "ruang-ganti" && <DressingRoomProps />}
      {location.id === "studio" && <StudioProps />}
      {location.id === "kafe" && <CafeProps />}
      {location.id === "arsip" && <ArchiveProps />}
      {location.id === "server" && <ServerProps />}

      {/* Character models */}
      {location.characters.map((char) => (
        <StylizedCharacter key={char.suspectId} char={char} />
      ))}

      {/* Clue orbs */}
      {location.clues.map((clue) => (
        <ClueOrb
          key={clue.id}
          clue={clue}
          onHover={onClueHover}
          onUnhover={onClueUnhover}
          onClick={onClueClick}
        />
      ))}

      {/* Volumetric light cone */}
      <mesh position={[0, 2.5, 0.5]}>
        <coneGeometry args={[1.8, 4, 24, 1, true]} />
        <meshBasicMaterial color={location.lightColor} transparent opacity={0.04} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Dust particles */}
      <points geometry={particleGeo}>
        <pointsMaterial size={0.05} color={location.accent} transparent opacity={0.6} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

// ============================================================
// CAMERA RIG
// ============================================================
function CameraRig() {
  const { camera, mouse } = useThree();
  const target = useRef(new THREE.Vector3(0, 1.2, 4.5));
  useFrame(() => {
    target.current.x = mouse.x * 2;
    target.current.y = 1.2 + mouse.y * 1;
    camera.position.set(
      THREE.MathUtils.lerp(camera.position.x, target.current.x, 0.04),
      THREE.MathUtils.lerp(camera.position.y, target.current.y, 0.04),
      camera.position.z
    );
    camera.lookAt(0, 0.3, -2);
  });
  return null;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function LocationExplorer() {
  const [activeLocation, setActiveLocation] = useState<Location>(LOCATIONS[0]);
  const [examinedClues, setExaminedClues] = useState<Set<string>>(new Set());
  const [hoveredClue, setHoveredClue] = useState<RoomClue | null>(null);
  const [activeClueDetail, setActiveClueDetail] = useState<RoomClue | null>(null);

  const handleClueClick = useCallback((clue: RoomClue) => {
    setActiveClueDetail(clue);
    setExaminedClues((prev) => new Set(prev).add(clue.id));
  }, []);

  return (
    <section id="lokasi-3d" className="relative py-20 sm:py-28 px-4 sm:px-6" aria-label="Eksplorasi Lokasi 3D">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="text-center mb-10">
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Eksplorasi TKP ·
          </span>
          <h2 className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3"
            style={{ textShadow: "0 0 24px rgba(255,179,71,0.3), 0 4px 12px rgba(0,0,0,0.9)" }}>
            TEMPAT KEJADIAN 3D
          </h2>
          <p className="font-typewriter text-sm text-noir-paper/70 max-w-lg mx-auto">
            Jelajahi ruangan 3D detail. Gerakkan mouse untuk melihat sekeliling.
            Klik orb bercahaya untuk periksa petunjuk. Karakter ditampilkan di posisinya malam itu.
          </p>
        </div>

        {/* 3D Canvas */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] border-2 border-noir-coffee/60 overflow-hidden rounded-sm bg-noir-ink">
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 1.2, 4.5], fov: 50 }}
            gl={{
              antialias: true,
              alpha: false,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.6,
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(new THREE.Color(activeLocation.fogColor).multiplyScalar(1.5));
            }}
          >
            <fog attach="fog" args={[activeLocation.fogColor, 10, 30]} />
            <Suspense fallback={null}>
              <Room3D
                location={activeLocation}
                onClueHover={setHoveredClue}
                onClueUnhover={() => setHoveredClue(null)}
                onClueClick={handleClueClick}
              />
              <CameraRig />
            </Suspense>
          </Canvas>

          {/* Location name overlay */}
          <div className="absolute top-4 left-4 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-noir-ink/80 backdrop-blur border border-noir-brass/30">
              <span className="text-xl">{activeLocation.glyph}</span>
              <div>
                <p className="font-stamp text-sm font-bold text-noir-brass">{activeLocation.name}</p>
                <p className="font-typewriter text-[9px] text-noir-paper/50">TKP · JKT-48-001</p>
              </div>
            </div>
          </div>

          {/* Examined counter */}
          <div className="absolute top-4 right-4 pointer-events-none">
            <div className="px-3 py-1.5 bg-noir-ink/80 backdrop-blur border border-noir-brass/30">
              <p className="font-stamp text-[10px] text-noir-brass">
                DIPERIKSA: {examinedClues.size}/{LOCATIONS.reduce((s, l) => s + l.clues.length, 0)}
              </p>
            </div>
          </div>

          {/* Character info */}
          {activeLocation.characters.length > 0 && (
            <div className="absolute bottom-20 right-4 pointer-events-none">
              <div className="px-3 py-1.5 bg-noir-ink/80 backdrop-blur border border-noir-brass/30">
                <p className="font-stamp text-[10px] text-noir-brass">
                  🧍 {activeLocation.characters.map(c => c.name).join(", ")}
                </p>
                <p className="font-typewriter text-[8px] text-noir-paper/50">di ruangan ini</p>
              </div>
            </div>
          )}

          {/* Hover tooltip */}
          {hoveredClue && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-16 pointer-events-none">
              <div className="px-3 py-1.5 bg-noir-ink/95 border border-noir-brass/50">
                <p className="font-stamp text-[10px] text-noir-brass">🔍 {hoveredClue.label}</p>
                <p className="font-typewriter text-[8px] text-noir-paper/50">Klik untuk periksa</p>
              </div>
            </div>
          )}

          {/* Clue detail popup */}
          {activeClueDetail && (
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-noir-ink via-noir-ink/95 to-transparent">
              <div className="border-l-2 border-noir-brass pl-3">
                <p className="font-stamp text-[9px] tracking-widest text-noir-brass font-bold uppercase">
                  ✓ {activeClueDetail.label}
                </p>
                <p className="font-typewriter text-xs text-noir-paper/90 italic">{activeClueDetail.detail}</p>
                <button
                  onClick={() => setActiveClueDetail(null)}
                  data-cursor-active
                  className="font-typewriter text-[9px] text-noir-crimson hover:text-noir-blood underline mt-1"
                >
                  tutup
                </button>
              </div>
            </div>
          )}

          {/* Description (when no clue active) */}
          {!activeClueDetail && (
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-noir-ink via-noir-ink/90 to-transparent">
              <p className="font-typewriter text-xs text-noir-paper/70 mb-1 leading-relaxed">
                {activeLocation.description}
              </p>
              <p className="font-stamp text-[9px] text-noir-brass/60 tracking-widest uppercase animate-pulse">
                🔍 Klik orb bercahaya untuk memeriksa petunjuk
              </p>
            </div>
          )}
        </div>

        {/* Location selector */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mt-4">
          {LOCATIONS.map((loc) => {
            const isActive = activeLocation.id === loc.id;
            const locClueCount = loc.clues.length;
            const examinedInLoc = loc.clues.filter(c => examinedClues.has(c.id)).length;
            return (
              <button
                key={loc.id}
                onClick={() => {
                  setActiveLocation(loc);
                  setActiveClueDetail(null);
                }}
                data-cursor-active
                className={`relative p-2 sm:p-3 border-2 transition-all text-center ${
                  isActive
                    ? "border-noir-brass bg-noir-brass/10 shadow-[0_0_12px_rgba(201,163,90,0.3)]"
                    : "border-noir-coffee/50 hover:border-noir-brass/50"
                }`}
              >
                <div className="text-lg sm:text-2xl mb-1">{loc.glyph}</div>
                <p className={`font-stamp text-[8px] sm:text-[10px] font-bold leading-tight ${
                  isActive ? "text-noir-brass" : "text-noir-paper/60"
                }`}>
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
