"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ============================================================
   Desk lamp model — built from primitives.
   ============================================================ */
function DeskLamp({ bulbRef, lightRef }: {
  bulbRef: React.MutableRefObject<THREE.Mesh | null>;
  lightRef: React.MutableRefObject<THREE.PointLight | null>;
}) {
  const armRef = useRef<THREE.Group>(null);
  const shadeRef = useRef<THREE.Group>(null);

  // gentle sweep of the lamp head
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (shadeRef.current) {
      shadeRef.current.rotation.z = -0.35 + Math.sin(t * 0.4) * 0.18;
    }
  });

  const brass = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#6b4f2a",
        metalness: 0.85,
        roughness: 0.35,
      }),
    []
  );
  const darkMetal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2a1d12",
        metalness: 0.7,
        roughness: 0.5,
      }),
    []
  );
  const shadeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#3a2c20",
        metalness: 0.6,
        roughness: 0.6,
        side: THREE.DoubleSide,
      }),
    []
  );
  const bulbMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fff4d6",
        emissive: "#ffb347",
        emissiveIntensity: 2.4,
        roughness: 0.2,
      }),
    []
  );

  return (
    <group position={[0, -1.2, 0]}>
      {/* base */}
      <mesh material={brass} castShadow receiveShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.55, 0.65, 0.1, 32]} />
      </mesh>
      <mesh material={brass} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.2, 0.35, 0.15, 24]} />
      </mesh>

      {/* lower arm */}
      <group position={[0, 0.22, 0]} rotation={[0, 0, 0.15]}>
        <mesh material={brass} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.2, 16]} />
        </mesh>
        {/* joint */}
        <mesh material={darkMetal} position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.12, 20, 20]} />
        </mesh>

        {/* upper arm */}
        <group position={[0, 1.2, 0]} ref={armRef}>
          <mesh material={brass} castShadow rotation={[0, 0, -0.5]}>
            <cylinderGeometry args={[0.05, 0.06, 1.1, 16]} />
          </mesh>
          {/* head joint */}
          <mesh material={darkMetal} position={[-0.5, 0.5, 0]}>
            <sphereGeometry args={[0.11, 20, 20]} />
          </mesh>

          {/* shade group — pivots from joint */}
          <group ref={shadeRef} position={[-0.5, 0.5, 0]}>
            {/* shade cone */}
            <mesh material={shadeMat} castShadow position={[-0.35, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.32, 0.55, 32, 1, true]} />
            </mesh>
            {/* shade rim */}
            <mesh material={brass} position={[-0.6, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.31, 0.025, 12, 32]} />
            </mesh>
            <mesh material={brass} position={[-0.33, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.18, 0.02, 12, 32]} />
            </mesh>
            {/* bulb */}
            <mesh
              ref={bulbRef}
              material={bulbMat}
              position={[-0.45, 0.05, 0]}
            >
              <sphereGeometry args={[0.11, 20, 20]} />
            </mesh>
            {/* point light at bulb */}
            <pointLight
              ref={lightRef}
              position={[-0.5, 0.05, 0]}
              color="#ffcb7a"
              intensity={6}
              distance={12}
              decay={1.6}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            {/* subtle inner glow */}
            <mesh position={[-0.5, 0.05, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshBasicMaterial color="#ffb347" transparent opacity={0.18} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

/* ============================================================
   Volumetric light cone (fake) — translucent cone from shade.
   ============================================================ */
function LightCone({ followRef }: { followRef: React.MutableRefObject<THREE.Group | null> }) {
  const coneRef = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffb347",
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );
  useFrame((state) => {
    if (coneRef.current && followRef.current) {
      coneRef.current.position.copy(followRef.current.position);
      coneRef.current.rotation.copy(followRef.current.rotation);
    }
  });
  return (
    <mesh ref={coneRef} material={mat} position={[0, 0, 0]}>
      <coneGeometry args={[2.2, 4.5, 32, 1, true]} />
    </mesh>
  );
}

/* ============================================================
   Dust particles drifting in the light beam.
   ============================================================ */
function DustParticles({ count = 220 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 6 - 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      speeds[i * 3] = (Math.random() - 0.5) * 0.08;
      speeds[i * 3 + 1] = Math.random() * 0.12 + 0.02;
      speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const arr = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += speeds[i * 3] * delta * 8;
      arr[i * 3 + 1] += speeds[i * 3 + 1] * delta * 8;
      arr[i * 3 + 2] += speeds[i * 3 + 2] * delta * 8;
      // wrap
      if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -2;
      if (arr[i * 3] > 5) arr[i * 3] = -5;
      if (arr[i * 3] < -5) arr[i * 3] = 5;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffcb7a"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ============================================================
   Desk surface + props for atmosphere.
   ============================================================ */
function DeskProps() {
  const paperMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c9b896",
        roughness: 0.9,
        metalness: 0,
      }),
    []
  );
  const woodMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#211a14",
        roughness: 0.85,
        metalness: 0.05,
      }),
    []
  );
  return (
    <group>
      {/* desk top */}
      <mesh material={woodMat} receiveShadow position={[0, -1.32, 0]}>
        <boxGeometry args={[8, 0.1, 4]} />
      </mesh>
      {/* scattered papers */}
      <mesh material={paperMat} position={[-1.6, -1.22, 0.4]} rotation={[0, 0.3, 0.05]}>
        <planeGeometry args={[1.1, 1.4]} />
      </mesh>
      <mesh material={paperMat} position={[-1.4, -1.21, 0.7]} rotation={[0, -0.2, -0.08]}>
        <planeGeometry args={[0.9, 1.2]} />
      </mesh>
      <mesh material={paperMat} position={[1.8, -1.22, -0.3]} rotation={[0, 0.1, 0.1]}>
        <planeGeometry args={[1, 1.3]} />
      </mesh>
      {/* coffee mug */}
      <mesh position={[2.2, -1.05, 0.8]} castShadow>
        <cylinderGeometry args={[0.18, 0.15, 0.3, 24]} />
        <meshStandardMaterial color="#3a2c20" roughness={0.6} />
      </mesh>
      {/* closed folder / book */}
      <mesh position={[1.5, -1.18, 0.9]} rotation={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.9, 0.08, 0.6]} />
        <meshStandardMaterial color="#5a2a1a" roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ============================================================
   Flicker controller — drives the bulb emissive + light intensity.
   Calls onFlicker callback for synchronized HTML overlay + buzz sfx.
   ============================================================ */
function FlickerController({
  bulbRef,
  lightRef,
  onFlicker,
  onSweep,
}: {
  bulbRef: React.MutableRefObject<THREE.Mesh | null>;
  lightRef: React.MutableRefObject<THREE.PointLight | null>;
  onFlicker: (intensity: number) => void;
  onSweep: (t: number) => void;
}) {
  const seed = useRef(Math.random() * 100);
  useFrame((state) => {
    const t = state.clock.elapsedTime + seed.current;
    // base breathing
    let intensity = 0.85 + Math.sin(t * 2.3) * 0.05 + Math.sin(t * 7.1) * 0.03;
    // random dropouts — lamp flicker
    const f = Math.sin(t * 13) * Math.sin(t * 5.3);
    if (f > 0.92) intensity *= 0.25;
    else if (f > 0.85) intensity *= 0.55;
    // occasional hard flicker
    const hard = Math.sin(t * 0.7);
    if (hard > 0.99) intensity *= 0.1;

    if (bulbRef.current) {
      const mat = bulbRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = intensity * 2.6;
    }
    if (lightRef.current) {
      lightRef.current.intensity = intensity * 7;
    }
    onFlicker(intensity);
    onSweep(state.clock.elapsedTime);
  });
  return null;
}

/* ============================================================
   Portrait wall — 4 frames lit by the lamp sweep.
   Uses HTML overlay instead (see HeroScene wrapper) for crisp text,
   but here we add simple frame meshes on the back wall for depth.
   ============================================================ */
function BackWall() {
  return (
    <mesh position={[0, 1.5, -3]} receiveShadow>
      <planeGeometry args={[16, 10]} />
      <meshStandardMaterial color="#14100d" roughness={1} />
    </mesh>
  );
}

/* ============================================================
   Main exported scene.
   ============================================================ */
export default function HeroLampScene({
  onFlicker,
  onSweep,
}: {
  onFlicker: (intensity: number) => void;
  onSweep: (t: number) => void;
}) {
  const bulbRef = useRef<THREE.Mesh | null>(null);
  const lightRef = useRef<THREE.PointLight | null>(null);
  const shadeGroupRef = useRef<THREE.Group | null>(null);

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.5, 5.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#0a0807", 4, 14]} />
      <ambientLight intensity={0.06} color="#4a3a2a" />
      <hemisphereLight args={["#3a2c20", "#0a0807", 0.15]} />

      <BackWall />
      <DeskProps />
      <DeskLamp bulbRef={bulbRef} lightRef={lightRef} />
      {/* track shade group for light cone follow — re-grab via ref hack */}
      <group ref={shadeGroupRef} />
      <DustParticles count={180} />
      <FlickerController
        bulbRef={bulbRef}
        lightRef={lightRef}
        onFlicker={onFlicker}
        onSweep={onSweep}
      />
    </Canvas>
  );
}
