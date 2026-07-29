"use client";

import { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

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
  clue: string;
}

const LOCATIONS: Location[] = [
  {
    id: "panggung",
    name: "Panggung Utama",
    glyph: "🎭",
    fogColor: "#1a0d0a",
    ambientColor: "#3a2a1a",
    lightColor: "#ffcb7a",
    lightIntensity: 25,
    accent: "#ffcb7a",
    wallColor: "#2a1a10",
    floorColor: "#1a1008",
    description: "Tempat pertunjukan utama. Lampu sorot berkedip. Tempat korban ditemukan di belakang tirai.",
    clue: "Bekas sepatu di belakang tirai — ukuran 42, bukan milik korban.",
  },
  {
    id: "ruang-ganti",
    name: "Ruang Ganti No.4",
    glyph: "🚪",
    fogColor: "#0d1a0d",
    ambientColor: "#2a3a2a",
    lightColor: "#ffb347",
    lightIntensity: 18,
    accent: "#ffb347",
    wallColor: "#1a2a1a",
    floorColor: "#0d180d",
    description: "Ruang ganti para member. Cermin dengan lampu bohlam. Tempat debat Catherina & korban.",
    clue: "Parfum mawar di meja rias Catherina — botol setengah kosong, baru dipakai.",
  },
  {
    id: "studio",
    name: "Studio Rekaman B",
    glyph: "🎥",
    fogColor: "#0a0d1a",
    ambientColor: "#1a2a3a",
    lightColor: "#4a9be8",
    lightIntensity: 15,
    accent: "#4a9be8",
    wallColor: "#0d1828",
    floorColor: "#080d18",
    description: "Studio suntingan video Fiony. Layar komputer biru dingin. Drive USB ditemukan di sini.",
    clue: "Log komputer menunjukkan aktivitas 23:05-23:12 — 7 menit tanpa input tapi file diakses.",
  },
  {
    id: "kafe",
    name: "Kafe Lobi",
    glyph: "☕",
    fogColor: "#1a1a0d",
    ambientColor: "#3a3a2a",
    lightColor: "#ffd9a0",
    lightIntensity: 12,
    accent: "#ffd9a0",
    wallColor: "#282818",
    floorColor: "#181808",
    description: "Kafe di lobi theater. Tempat Abigail duduk sendirian. Aroma kopi basi.",
    clue: "Tisu basah di tempat sampah — ada lipstik pink, bukan milik Abigail.",
  },
  {
    id: "arsip",
    name: "Ruang Arsip",
    glyph: "📂",
    fogColor: "#0d0d0d",
    ambientColor: "#2a2a1a",
    lightColor: "#c9a35a",
    lightIntensity: 10,
    accent: "#c9a35a",
    wallColor: "#1a1a10",
    floorColor: "#0d0d08",
    description: "Ruang arsip dokumen lama. Gelap, berdebu. Brankas dokumen di pojok. Hillary mengakses malam itu.",
    clue: "Brankas terbuka — dokumen kontrak Hillary hilang. Sidik jari di gagang.",
  },
  {
    id: "server",
    name: "Ruang Server",
    glyph: "🖥️",
    fogColor: "#0d1a0d",
    ambientColor: "#1a2a1a",
    lightColor: "#00ff66",
    lightIntensity: 12,
    accent: "#00ff66",
    wallColor: "#0d1a0d",
    floorColor: "#080f08",
    description: "Ruang server keamanan. Lampu LED hijau berkedip. Terminal CCTV — Marsha mengakses malam itu.",
    clue: "Log terminal: CCTV dimatikan 23:17, dihidupkan 23:26. 9 menit kegelapan.",
  },
];

/* ============================================================
   3D Room — high quality procedural room with proper lighting,
   textured materials, furniture, and atmospheric particles.
   ============================================================ */
function Room3D({ location }: { location: Location }) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const spotlightRef = useRef<THREE.SpotLight>(null);

  // Procedural textures (canvas-based) for walls and floor
  const wallTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    // base color
    ctx.fillStyle = location.wallColor;
    ctx.fillRect(0, 0, 256, 256);
    // noise texture
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const brightness = Math.random() * 30 - 15;
      ctx.fillStyle = `rgba(${brightness > 0 ? 255 : 0}, ${brightness > 0 ? 255 : 0}, ${brightness > 0 ? 255 : 0}, ${Math.abs(brightness) / 100})`;
      ctx.fillRect(x, y, 2, 2);
    }
    // vertical streaks (water damage / age)
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
    // wood plank lines
    for (let i = 0; i < 8; i++) {
      const y = i * 32;
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, y, 256, 1);
      // plank noise
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

  // Materials
  const wallMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: wallTexture,
        roughness: 0.9,
        metalness: 0.05,
      }),
    [wallTexture]
  );

  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: floorTexture,
        roughness: 0.85,
        metalness: 0.1,
      }),
    [floorTexture]
  );

  // Dust particles — soft round points
  const particleGeo = useMemo(() => {
    const count = 200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 5 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      sizes[i] = Math.random() * 0.04 + 0.01;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, []);

  // Animation
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // gentle room sway
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.015;
    }
    // spotlight flicker
    if (spotlightRef.current) {
      const flicker = 0.92 + Math.sin(t * 15) * 0.04 + Math.sin(t * 7.3) * 0.03;
      spotlightRef.current.intensity = location.lightIntensity * flicker;
    }
    // particle drift
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(t * 0.3 + i) * delta * 0.05;
        positions[i + 1] += delta * 0.08;
        positions[i + 2] += Math.cos(t * 0.2 + i) * delta * 0.03;
        if (positions[i + 1] > 4) positions[i + 1] = -1;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
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
      {/* Ceiling (subtle) */}
      <mesh material={wallMat} rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[14, 12]} />
      </mesh>

      {/* Main spotlight from ceiling */}
      <spotLight
        ref={spotlightRef}
        position={[0, 4.5, 1]}
        angle={0.5}
        penumbra={0.6}
        intensity={location.lightIntensity}
        color={location.lightColor}
        distance={20}
        decay={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
      />

      {/* Ambient fill light */}
      <ambientLight intensity={0.15} color={location.ambientColor} />

      {/* Accent glow light — near the clue */}
      <pointLight
        position={[0, -0.3, 0.5]}
        color={location.accent}
        intensity={3}
        distance={4}
        decay={2}
      />

      {/* Decorative pillars with proper geometry */}
      <Pillar position={[-3.5, 0, -3]} color={location.wallColor} />
      <Pillar position={[3.5, 0, -3]} color={location.wallColor} />

      {/* Central clue pedestal */}
      <group position={[0, -1, 0.5]}>
        {/* pedestal base */}
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.6, 0.6, 16]} />
          <meshStandardMaterial color="#3a2c20" roughness={0.8} metalness={0.2} />
        </mesh>
        {/* glowing clue orb */}
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={location.accent}
            emissive={location.accent}
            emissiveIntensity={2.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* glow halo */}
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial
            color={location.accent}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Furniture — location-specific props */}
      {location.id === "panggung" && <StageProps />}
      {location.id === "ruang-ganti" && <DressingRoomProps />}
      {location.id === "studio" && <StudioProps />}
      {location.id === "kafe" && <CafeProps />}
      {location.id === "arsip" && <ArchiveProps />}
      {location.id === "server" && <ServerProps />}

      {/* Volumetric light cone (fake) */}
      <mesh position={[0, 2.5, 0.5]} rotation={[0, 0, 0]}>
        <coneGeometry args={[1.8, 4, 24, 1, true]} />
        <meshBasicMaterial
          color={location.lightColor}
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Dust particles */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.05}
          color={location.accent}
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* Pillar — proper 3D pillar with base + shaft + capital */
function Pillar({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* base */}
      <mesh position={[0, -0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* shaft */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.22, 3.4, 12]} />
        <meshStandardMaterial color={color} roughness={0.75} metalness={0.15} />
      </mesh>
      {/* capital */}
      <mesh position={[0, 1.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

/* Location-specific furniture props */
function StageProps() {
  return (
    <group>
      {/* curtain */}
      <mesh position={[0, 1.5, -4.5]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#5a1a1a" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* stage platform */}
      <mesh position={[0, -0.7, -2]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.6, 3]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.8} />
      </mesh>
    </group>
  );
}

function DressingRoomProps() {
  return (
    <group>
      {/* mirror with lights */}
      <mesh position={[0, 1, -4.5]} receiveShadow>
        <planeGeometry args={[2.5, 2]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* mirror frame lights */}
      {Array.from({ length: 8 }).map((_, i) => (
        <pointLight
          key={i}
          position={[
            -1.2 + (i % 4) * 0.8,
            i < 4 ? 2 : 0,
            -4.3,
          ]}
          color="#ffb347"
          intensity={0.3}
          distance={1.5}
        />
      ))}
      {/* dressing table */}
      <mesh position={[0, -0.5, -4]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.1, 1]} />
        <meshStandardMaterial color="#3a2c20" roughness={0.7} />
      </mesh>
    </group>
  );
}

function StudioProps() {
  return (
    <group>
      {/* monitor */}
      <mesh position={[0, 0, -4]} castShadow>
        <boxGeometry args={[2, 1.2, 0.1]} />
        <meshStandardMaterial
          color="#0a1525"
          emissive="#1a3a6a"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* monitor glow */}
      <pointLight position={[0, 0, -3.5]} color="#4a9be8" intensity={2} distance={4} />
      {/* desk */}
      <mesh position={[0, -0.7, -4]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.1, 1.5]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.7} />
      </mesh>
      {/* chair */}
      <mesh position={[0, -0.5, -3]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.6]} />
        <meshStandardMaterial color="#0d0d18" roughness={0.8} />
      </mesh>
    </group>
  );
}

function CafeProps() {
  return (
    <group>
      {/* table */}
      <mesh position={[0, -0.6, -2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.08, 16]} />
        <meshStandardMaterial color="#3a2c20" roughness={0.7} />
      </mesh>
      {/* table leg */}
      <mesh position={[0, -0.9, -2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.8} />
      </mesh>
      {/* coffee cup */}
      <mesh position={[0.3, -0.5, -2]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.15, 12]} />
        <meshStandardMaterial color="#e8dcc0" roughness={0.5} />
      </mesh>
      {/* pendant light */}
      <pointLight position={[0, 1.5, -2]} color="#ffd9a0" intensity={1.5} distance={3} />
    </group>
  );
}

function ArchiveProps() {
  return (
    <group>
      {/* shelves */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[-2, -0.5 + i * 0.8, -4]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.08, 0.6]} />
          <meshStandardMaterial color="#2a1a10" roughness={0.85} />
        </mesh>
      ))}
      {/* brankas */}
      <mesh position={[2, -0.3, -4]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 1.2, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
      </mesh>
      {/* brankas dial */}
      <mesh position={[2, 0, -3.65]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        <meshStandardMaterial color="#c9a35a" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

function ServerProps() {
  return (
    <group>
      {/* server racks */}
      {Array.from({ length: 3 }).map((_, i) => (
        <group key={i} position={[-2 + i * 2, 0, -4]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.8, 2.5, 0.6]} />
            <meshStandardMaterial color="#0d1a0d" roughness={0.6} metalness={0.4} />
          </mesh>
          {/* LED blinks */}
          {Array.from({ length: 5 }).map((_, j) => (
            <mesh key={j} position={[0.3, -0.8 + j * 0.4, 0.31]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial
                color="#00ff66"
                emissive="#00ff66"
                emissiveIntensity={2}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* Camera controller — smooth orbit based on mouse */
function CameraRig() {
  const { camera, mouse } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 1.2, 4.5));
  useFrame(() => {
    targetPos.current.x = mouse.x * 2;
    targetPos.current.y = 1.2 + mouse.y * 1;
    camera.position.set(
      THREE.MathUtils.lerp(camera.position.x, targetPos.current.x, 0.04),
      THREE.MathUtils.lerp(camera.position.y, targetPos.current.y, 0.04),
      camera.position.z
    );
    camera.lookAt(0, 0.3, -2);
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
            Klik orb bercahaya untuk memeriksa petunjuk.
          </p>
        </div>

        {/* 3D Canvas + overlay */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] border-2 border-noir-coffee/60 overflow-hidden rounded-sm bg-noir-ink">
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 1.2, 4.5], fov: 50 }}
            gl={{
              antialias: true,
              alpha: false,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(activeLocation.fogColor);
            }}
          >
            <fog attach="fog" args={[activeLocation.fogColor, 3, 14]} />
            <Suspense fallback={null}>
              <Room3D location={activeLocation} />
              <CameraRig />
            </Suspense>
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

          {/* clue examination button (orb in 3D maps to this overlay button) */}
          <button
            onClick={() => examineClue(activeLocation.id)}
            data-cursor-active
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group"
            aria-label="Periksa petunjuk"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-noir-brass/80 bg-noir-brass/20 backdrop-blur flex items-center justify-center group-hover:scale-125 transition-transform">
                <span className="text-base">🔍</span>
              </div>
              {!examinedClues.has(activeLocation.id) && (
                <div className="absolute -inset-3 rounded-full border border-noir-brass/40 animate-ping" />
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
                🔍 Klik orb bercahaya untuk memeriksa petunjuk
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
