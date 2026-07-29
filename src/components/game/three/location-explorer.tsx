"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Location {
  id: string;
  name: string;
  glyph: string;
  fogColor: string;
  lightColor: string;
  lightIntensity: number;
  accent: string;
  description: string;
  clue: string;
}

const LOCATIONS: Location[] = [
  {
    id: "panggung",
    name: "Panggung Utama",
    glyph: "🎭",
    fogColor: "#1a0d0a",
    lightColor: "#ffcb7a",
    lightIntensity: 8,
    accent: "#ffcb7a",
    description: "Tempat pertunjukan utama. Lampu sorot berkedip. Tempat korban ditemukan.",
    clue: "Bekas sepatu di belakang tirai — ukuran 42, bukan milik korban.",
  },
  {
    id: "ruang-ganti",
    name: "Ruang Ganti No.4",
    glyph: "🚪",
    fogColor: "#0d1a0d",
    lightColor: "#ffb347",
    lightIntensity: 5,
    accent: "#ffb347",
    description: "Ruang ganti para member. Cermin dengan lampu bohlam. Tempat debat Catherina & korban.",
    clue: "Parfum mawar di meja rias Catherina — botol setengah kosong, baru dipakai.",
  },
  {
    id: "studio",
    name: "Studio Rekaman B",
    glyph: "🎥",
    fogColor: "#0a0d1a",
    lightColor: "#4a9be8",
    lightIntensity: 4,
    accent: "#4a9be8",
    description: "Studio suntingan video Fiony. Layar komputer biru dingin. Drive USB ditemukan di sini.",
    clue: "Log komputer menunjukkan aktivitas 23:05-23:12 — 7 menit tanpa input tapi file diakses.",
  },
  {
    id: "kafe",
    name: "Kafe Lobi",
    glyph: "☕",
    fogColor: "#1a1a0d",
    lightColor: "#ffd9a0",
    lightIntensity: 3,
    accent: "#ffd9a0",
    description: "Kafe di lobi theater. Tempat Abigail duduk sendirian. Aroma kopi basi.",
    clue: "Tisu basah di tempat sampah — ada lipstik pink, bukan milik Abigail.",
  },
  {
    id: "arsip",
    name: "Ruang Arsip",
    glyph: "📂",
    fogColor: "#0d0d0d",
    lightColor: "#c9a35a",
    lightIntensity: 2,
    accent: "#c9a35a",
    description: "Ruang arsip dokumen lama. Gelap, berdebu. Brankas dokumen di pojok. Hillary mengakses malam itu.",
    clue: "Brankas terbuka — dokumen kontrak Hillary hilang. Sidik jari di gagang.",
  },
  {
    id: "server",
    name: "Ruang Server",
    glyph: "🖥️",
    fogColor: "#0d1a0d",
    lightColor: "#00ff66",
    lightIntensity: 3,
    accent: "#00ff66",
    description: "Ruang server keamanan. Lampu LED hijau berkedip. Terminal CCTV — Marsha mengakses malam itu.",
    clue: "Log terminal: CCTV dimatikan 23:17, dihidupkan 23:26. 9 menit kegelapan.",
  },
];

/* 3D Room — a procedural room with walls, floor, lighting, and particles */
function Room3D({ location }: { location: Location }) {
  const meshRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Room geometry — floor, back wall, left wall, right wall
  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: location.fogColor,
        roughness: 0.9,
        metalness: 0.1,
      }),
    [location.fogColor]
  );

  const wallMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: location.fogColor,
        roughness: 0.85,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
    [location.fogColor]
  );

  // Dust particles
  const particleGeo = useMemo(() => {
    const count = 150;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = Math.random() * 4 - 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // gentle room sway
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * 0.1) * 0.02;
    }
    // particle drift
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.003;
        if (positions[i + 1] > 3.5) positions[i + 1] = -0.5;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Floor */}
      <mesh material={floorMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
      </mesh>
      {/* Back wall */}
      <mesh material={wallMat} position={[0, 1, -4]} receiveShadow>
        <planeGeometry args={[12, 6]} />
      </mesh>
      {/* Left wall */}
      <mesh material={wallMat} rotation={[0, Math.PI / 2, 0]} position={[-5, 1, 0]} receiveShadow>
        <planeGeometry args={[10, 6]} />
      </mesh>
      {/* Right wall */}
      <mesh material={wallMat} rotation={[0, -Math.PI / 2, 0]} position={[5, 1, 0]} receiveShadow>
        <planeGeometry args={[10, 6]} />
      </mesh>

      {/* Main light source (location-specific) */}
      <pointLight
        position={[0, 3, 2]}
        color={location.lightColor}
        intensity={location.lightIntensity}
        distance={15}
        decay={1.5}
        castShadow
      />

      {/* Accent light — mysterious glow */}
      <pointLight
        position={[2, 0.5, -2]}
        color={location.accent}
        intensity={location.lightIntensity * 0.4}
        distance={8}
        decay={2}
      />

      {/* Decorative pillar (3D depth element) */}
      <mesh position={[-3, 0, -2]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 4, 12]} />
        <meshStandardMaterial color={location.fogColor} roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[3, 0, -2]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 4, 12]} />
        <meshStandardMaterial color={location.fogColor} roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Central object — a glowing clue marker */}
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.4]} />
        <meshStandardMaterial
          color={location.accent}
          emissive={location.accent}
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      <pointLight
        position={[0, -0.3, 0]}
        color={location.accent}
        intensity={2}
        distance={3}
        decay={2}
      />

      {/* Dust particles */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.03}
          color={location.accent}
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* Camera controller — slow orbit based on mouse */
function CameraRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    const targetX = mouse.x * 1.5;
    const targetY = 1 + mouse.y * 0.8;
    camera.position.set(
      THREE.MathUtils.lerp(camera.position.x, targetX, 0.05),
      THREE.MathUtils.lerp(camera.position.y, targetY, 0.05),
      camera.position.z
    );
    camera.lookAt(0, 0.5, -2);
  });
  return null;
}

export default function LocationExplorer() {
  const [activeLocation, setActiveLocation] = useState<Location>(LOCATIONS[0]);
  const [examinedClues, setExaminedClues] = useState<Set<string>>(new Set());

  const examineClue = (locId: string) => {
    setExaminedClues((prev) => new Set(prev).add(locId));
  };

  return (
    <section
      id="lokasi-3d"
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      aria-label="Eksplorasi Lokasi 3D"
    >
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="text-center mb-10">
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Eksplorasi TKP ·
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3"
            style={{
              textShadow: "0 0 24px rgba(255,179,71,0.3), 0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            TEMPAT KEJADIAN 3D
          </h2>
          <p className="font-typewriter text-sm text-noir-paper/70 max-w-lg mx-auto">
            Jelajahi setiap lokasi dalam 3D. Gerakkan mouse untuk melihat sekeliling.
            Klik petunjuk yang bercahaya untuk memeriksa.
          </p>
        </div>

        {/* 3D Canvas + overlay */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] border-2 border-noir-coffee/60 overflow-hidden rounded-sm bg-noir-ink">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [0, 1, 4], fov: 55 }}
            gl={{ antialias: true, alpha: true }}
          >
            <fog attach="fog" args={[activeLocation.fogColor, 2, 12]} />
            <ambientLight intensity={0.08} />
            <hemisphereLight
              args={[activeLocation.fogColor, "#000000", 0.1]}
            />
            <Room3D location={activeLocation} />
            <CameraRig />
          </Canvas>

          {/* location name overlay */}
          <div className="absolute top-4 left-4 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-noir-ink/80 backdrop-blur border border-noir-brass/30">
              <span className="text-xl">{activeLocation.glyph}</span>
              <div>
                <p className="font-stamp text-sm font-bold text-noir-brass">
                  {activeLocation.name}
                </p>
                <p className="font-typewriter text-[9px] text-noir-paper/50">
                  TKP · JKT-48-001
                </p>
              </div>
            </div>
          </div>

          {/* examined counter */}
          <div className="absolute top-4 right-4 pointer-events-none">
            <div className="px-3 py-1.5 bg-noir-ink/80 backdrop-blur border border-noir-brass/30">
              <p className="font-stamp text-[10px] text-noir-brass">
                DIPERIKSA: {examinedClues.size}/{LOCATIONS.length}
              </p>
            </div>
          </div>

          {/* clue overlay (click to examine) */}
          <button
            onClick={() => examineClue(activeLocation.id)}
            data-cursor-active
            className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-8 group"
            aria-label="Periksa petunjuk"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-noir-brass bg-noir-brass/20 backdrop-blur flex items-center justify-center animate-pulse group-hover:scale-110 transition-transform">
                <span className="text-xl">🔍</span>
              </div>
              {!examinedClues.has(activeLocation.id) && (
                <div className="absolute -inset-2 rounded-full border-2 border-noir-brass/50 animate-ping" />
              )}
            </div>
          </button>

          {/* description + clue */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-noir-ink via-noir-ink/90 to-transparent">
            <p className="font-typewriter text-xs text-noir-paper/70 mb-2 leading-relaxed">
              {activeLocation.description}
            </p>
            {examinedClues.has(activeLocation.id) ? (
              <div className="border-l-2 border-noir-brass pl-3">
                <p className="font-stamp text-[9px] tracking-widest text-noir-brass font-bold uppercase">
                  ✓ Petunjuk Ditemukan:
                </p>
                <p className="font-typewriter text-xs text-noir-paper/90 italic">
                  {activeLocation.clue}
                </p>
              </div>
            ) : (
              <p className="font-stamp text-[10px] text-noir-brass/60 tracking-widest uppercase animate-pulse">
                🔍 Klik lingkaran untuk memeriksa petunjuk
              </p>
            )}
          </div>
        </div>

        {/* location selector */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mt-4">
          {LOCATIONS.map((loc) => {
            const isActive = activeLocation.id === loc.id;
            const isExamined = examinedClues.has(loc.id);
            return (
              <button
                key={loc.id}
                onClick={() => setActiveLocation(loc)}
                data-cursor-active
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
                {isExamined && (
                  <span className="absolute top-1 right-1 text-[8px] text-green-400 font-bold">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
