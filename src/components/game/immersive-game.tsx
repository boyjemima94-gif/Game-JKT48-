"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Lazy load Babylon only when component mounts (not during SSR)
let babylonLoaded = false;
async function loadBabylon() {
  if (babylonLoaded) return;
  await import("@babylonjs/core/Engines/engine");
  await import("@babylonjs/core/scene");
  await import("@babylonjs/core/Cameras/arcRotateCamera");
  await import("@babylonjs/core/Cameras/universalCamera");
  await import("@babylonjs/core/Maths/math");
  await import("@babylonjs/core/Lights/hemisphericLight");
  await import("@babylonjs/core/Lights/directionalLight");
  await import("@babylonjs/core/Lights/pointLight");
  await import("@babylonjs/core/Lights/Shadows/shadowGenerator");
  await import("@babylonjs/core/Meshes/meshBuilder");
  await import("@babylonjs/core/Materials/standardMaterial");
  await import("@babylonjs/core/Materials/PBR/pbrMaterial");
  await import("@babylonjs/core/Particles/particleSystem");
  await import("@babylonjs/core/Materials/Textures/texture");
  await import("@babylonjs/core/Layers/glowLayer");
  babylonLoaded = true;
}

// ============================================================
// GAME DATA — Story & Characters (same as existing)
// ============================================================
const SUSPECTS = [
  { id: "oline", name: "Oline Manuel", codename: "BURUNG MERAK", color: "#e0a83c", room: "stage", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2b3454ce4879.jpg" },
  { id: "catherina", name: "Catherina Valencia", codename: "MERAH MUDA", color: "#c0392b", room: "dressing", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9ea50407c914.jpg" },
  { id: "abigail", name: "Abigail Rachel", codename: "ANGSA PUTIH", color: "#9a7b4f", room: "cafe", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/25175d128e83.jpg" },
  { id: "fiony", name: "Fiony Alveria", codename: "BAYANG MALAM", color: "#7a5c8a", room: "studio", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/070d4143804a.jpg" },
  { id: "hillary", name: "Hillary Abigail", codename: "BAYANGAN TIRAI", color: "#5a8a6a", room: "archive", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5a2d1c0d1f99.jpg" },
  { id: "victoria", name: "Victoria Kimberly", codename: "BUMI TERATAI", color: "#6a9bd4", room: "lobby", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ebd9572a3092.jpg" },
  { id: "marsha", name: "Marsha Lenathea", codename: "PIZZA DREAMER", color: "#d46a9b", room: "server", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b509794743f0.jpg" },
  { id: "adeline", name: "Adeline Wijaya", codename: "MATA SENJA", color: "#8a7ad4", room: "stage", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c2f8cd60fbb1.jpg" },
];

const ROOMS = [
  { id: "lobby", name: "Lobi Theater", color: "#1a1a0d", accent: "#ffd9a0", x: 0, z: 0 },
  { id: "stage", name: "Panggung Utama", color: "#1a0d0a", accent: "#ffcb7a", x: 0, z: -15 },
  { id: "dressing", name: "Ruang Ganti", color: "#0d1a0d", accent: "#ffb347", x: -12, z: -8 },
  { id: "cafe", name: "Kafe Lobi", color: "#1a1a0d", accent: "#ffd9a0", x: 12, z: -8 },
  { id: "studio", name: "Studio Rekaman", color: "#0a0d1a", accent: "#4a9be8", x: -12, z: -15 },
  { id: "archive", name: "Ruang Arsip", color: "#0d0d0d", accent: "#c9a35a", x: 12, z: -15 },
  { id: "server", name: "Ruang Server", color: "#0d1a0d", accent: "#00ff66", x: 0, z: -25 },
];

interface GameState {
  currentRoom: string;
  examinedClues: Set<string>;
  interrogated: Set<string>;
  score: number;
  activeClue: string | null;
  activeSuspect: string | null;
  showNotebook: boolean;
}

export default function ImmersiveGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentRoom: "lobby",
    examinedClues: new Set(),
    interrogated: new Set(),
    score: 0,
    activeClue: null,
    activeSuspect: null,
    showNotebook: false,
  });
  const [fps, setFps] = useState(60);
  const [uiOverlay, setUiOverlay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cluePopup, setCluePopup] = useState<{ label: string; detail: string } | null>(null);
  const [suspectPopup, setSuspectPopup] = useState<typeof SUSPECTS[0] | null>(null);
  const [roomLabel, setRoomLabel] = useState("Lobi Theater");
  const [cluesFound, setCluesFound] = useState(0);

  // Initialize Babylon scene
  useEffect(() => {
    let disposed = false;
    let engine: any = null;
    let scene: any = null;
    let camera: any = null;
    let resizeObserver: ResizeObserver | null = null;
    let fpsTimer: any = null;

    async function init() {
      if (!canvasRef.current) return;
      
      try {
        await loadBabylon();
        if (disposed) return;

        // Dynamic import Babylon modules
        const { Engine } = await import("@babylonjs/core/Engines/engine");
        const { Scene } = await import("@babylonjs/core/scene");
        const { ArcRotateCamera } = await import("@babylonjs/core/Cameras/arcRotateCamera");
        const { Vector3, Color3, Color4 } = await import("@babylonjs/core/Maths/math");
        const { HemisphericLight } = await import("@babylonjs/core/Lights/hemisphericLight");
        const { DirectionalLight } = await import("@babylonjs/core/Lights/directionalLight");
        const { PointLight } = await import("@babylonjs/core/Lights/pointLight");
        const { ShadowGenerator } = await import("@babylonjs/core/Lights/Shadows/shadowGenerator");
        const { MeshBuilder } = await import("@babylonjs/core/Meshes/meshBuilder");
        const { StandardMaterial } = await import("@babylonjs/core/Materials/standardMaterial");
        const { GlowLayer } = await import("@babylonjs/core/Layers/glowLayer");

        const canvas = canvasRef.current;
        engine = new Engine(canvas, true, {
          preserveDrawingBuffer: false,
          stencil: false,
          antialias: true,
          powerPreference: "high-performance",
        });
        engineRef.current = engine;

        scene = new Scene(engine);
        sceneRef.current = scene;

        scene.clearColor = new Color4(0.04, 0.03, 0.03, 1);
        scene.fogMode = Scene.FOGMODE_EXP2;
        scene.fogDensity = 0.02;
        scene.fogColor = new Color3(0.04, 0.03, 0.03);

        // Camera — ArcRotate for touch + mouse
        camera = new ArcRotateCamera(
          "cam",
          -Math.PI / 2,
          Math.PI / 2.8,
          8,
          new Vector3(0, 1, 0),
          canvas
        );
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = 3;
        camera.upperRadiusLimit = 15;
        camera.lowerBetaLimit = Math.PI / 6;
        camera.upperBetaLimit = Math.PI / 2.1;
        camera.wheelDeltaPercentage = 0.01;
        camera.pinchDeltaPercentage = 0.01;
        camera.useAutoRotationBehavior = false;

        // Lights
        const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
        hemi.intensity = 0.4;
        hemi.diffuse = new Color3(0.5, 0.4, 0.3);
        hemi.groundColor = new Color3(0.1, 0.08, 0.06);

        const dirLight = new DirectionalLight("dir", new Vector3(-0.3, -1, 0.2), scene);
        dirLight.position = new Vector3(5, 10, 5);
        dirLight.intensity = 0.3;

        const shadowGen = new ShadowGenerator(512, dirLight);
        shadowGen.useBlurExponentialShadowMap = true;
        shadowGen.blurKernel = 8;

        const glow = new GlowLayer("glow", scene);
        glow.intensity = 0.5;

        // === BUILD ROOMS ===
        const roomMeshes: Record<string, any> = {};

        ROOMS.forEach((room) => {
          const group: any[] = [];

          // Floor
          const floor = MeshBuilder.CreateGround(`floor_${room.id}`, { width: 10, height: 10 }, scene);
          floor.position.set(room.x, 0, room.z);
          const floorMat = new StandardMaterial(`floorMat_${room.id}`, scene);
          floorMat.diffuseColor = Color3.FromHexString(room.color);
          floorMat.specularColor = new Color3(0.05, 0.05, 0.05);
          floor.material = floorMat;
          floor.receiveShadows = true;
          group.push(floor);

          // Walls (3 walls, open front)
          const wallMat = new StandardMaterial(`wallMat_${room.id}`, scene);
          wallMat.diffuseColor = Color3.FromHexString(room.color).add(new Color3(0.05, 0.05, 0.05));
          wallMat.specularColor = new Color3(0.02, 0.02, 0.02);

          // Back wall
          const backWall = MeshBuilder.CreateGround(`bw_${room.id}`, { width: 10, height: 5 }, scene);
          backWall.rotation.x = Math.PI / 2;
          backWall.position.set(room.x, 2.5, room.z - 5);
          backWall.material = wallMat;
          backWall.receiveShadows = true;
          group.push(backWall);

          // Left wall
          const leftWall = MeshBuilder.CreateGround(`lw_${room.id}`, { width: 10, height: 5 }, scene);
          leftWall.rotation.z = Math.PI / 2;
          leftWall.position.set(room.x - 5, 2.5, room.z);
          leftWall.material = wallMat;
          leftWall.receiveShadows = true;
          group.push(leftWall);

          // Right wall
          const rightWall = leftWall.clone(`rw_${room.id}`);
          rightWall.position.x = room.x + 5;
          rightWall.rotation.z = -Math.PI / 2;
          group.push(rightWall);

          // Room light
          const roomLight = new PointLight(`light_${room.id}`, new Vector3(room.x, 4, room.z), scene);
          roomLight.diffuse = Color3.FromHexString(room.accent);
          roomLight.intensity = 15;
          roomLight.range = 12;
          group.push(roomLight);

          // Room-specific props
          if (room.id === "stage") {
            // Curtain
            const curtain = MeshBuilder.CreateGround("curtain", { width: 8, height: 4 }, scene);
            curtain.rotation.x = Math.PI / 2;
            curtain.position.set(room.x, 3, room.z - 4.8);
            const curMat = new StandardMaterial("curMat", scene);
            curMat.diffuseColor = new Color3(0.35, 0.1, 0.1);
            curtain.material = curMat;
            group.push(curtain);

            // Stage platform
            const stage = MeshBuilder.CreateBox("stage", { width: 8, height: 0.5, depth: 4 }, scene);
            stage.position.set(room.x, 0.25, room.z - 1);
            stage.material = floorMat;
            shadowGen.addShadowCaster(stage);
            group.push(stage);
          }

          if (room.id === "server") {
            // Server racks
            [-2, 0, 2].forEach((xOff, idx) => {
              const rack = MeshBuilder.CreateBox(`rack_${idx}`, { width: 0.8, height: 3, depth: 0.6 }, scene);
              rack.position.set(room.x + xOff, 1.5, room.z - 4);
              const rackMat = new StandardMaterial(`rackMat_${idx}`, scene);
              rackMat.diffuseColor = new Color3(0.05, 0.1, 0.05);
              rackMat.emissiveColor = new Color3(0, 0.1, 0.03);
              rack.material = rackMat;
              shadowGen.addShadowCaster(rack);
              group.push(rack);
            });
          }

          if (room.id === "cafe") {
            // Table
            const table = MeshBuilder.CreateCylinder("cafeTable", { height: 0.1, diameter: 1.5 }, scene);
            table.position.set(room.x, 0.8, room.z);
            const tMat = new StandardMaterial("tMat", scene);
            tMat.diffuseColor = new Color3(0.2, 0.15, 0.1);
            table.material = tMat;
            shadowGen.addShadowCaster(table);
            group.push(table);

            // Table leg
            const leg = MeshBuilder.CreateCylinder("cafeLeg", { height: 0.8, diameter: 0.1 }, scene);
            leg.position.set(room.x, 0.4, room.z);
            leg.material = tMat;
            group.push(leg);
          }

          roomMeshes[room.id] = group;
        });

        // === HALLWAYS (connect rooms with floor strips) ===
        const hallwayMat = new StandardMaterial("hallMat", scene);
        hallwayMat.diffuseColor = new Color3(0.08, 0.06, 0.04);
        hallwayMat.specularColor = new Color3(0.01, 0.01, 0.01);

        // Lobby to Stage
        const hall1 = MeshBuilder.CreateGround("hall1", { width: 4, height: 5 }, scene);
        hall1.position.set(0, 0, -7.5);
        hall1.material = hallwayMat;
        hall1.receiveShadows = true;

        // Lobby to Dressing (left)
        const hall2 = MeshBuilder.CreateGround("hall2", { width: 5, height: 4 }, scene);
        hall2.position.set(-6, 0, -4);
        hall2.material = hallwayMat;

        // Lobby to Cafe (right)
        const hall3 = hall2.clone("hall3");
        hall3.position.x = 6;

        // Stage to Server
        const hall4 = MeshBuilder.CreateGround("hall4", { width: 4, height: 5 }, scene);
        hall4.position.set(0, 0, -20);
        hall4.material = hallwayMat;

        // === CHARACTER NPCs ===
        SUSPECTS.forEach((suspect) => {
          const room = ROOMS.find((r) => r.id === suspect.room);
          if (!room) return;

          // Body (capsule)
          const body = MeshBuilder.CreateCapsule(`body_${suspect.id}`, { height: 1.6, radius: 0.25 }, scene);
          body.position.set(room.x + (Math.random() - 0.5) * 3, 0.8, room.z + (Math.random() - 0.5) * 3);
          const bodyMat = new StandardMaterial(`bodyMat_${suspect.id}`, scene);
          bodyMat.diffuseColor = Color3.FromHexString(suspect.color);
          bodyMat.emissiveColor = Color3.FromHexString(suspect.color).scale(0.15);
          body.material = bodyMat;
          shadowGen.addShadowCaster(body);

          // Head
          const head = MeshBuilder.CreateSphere(`head_${suspect.id}`, { diameter: 0.4 }, scene);
          head.position = body.position.add(new Vector3(0, 1, 0));
          const headMat = new StandardMaterial(`headMat_${suspect.id}`, scene);
          headMat.diffuseColor = new Color3(0.83, 0.66, 0.5);
          head.material = headMat;
          shadowGen.addShadowCaster(head);

          // Glow light at feet
          const charLight = new PointLight(`cl_${suspect.id}`, body.position.clone(), scene);
          charLight.diffuse = Color3.FromHexString(suspect.color);
          charLight.intensity = 2;
          charLight.range = 3;

          // Click interaction
          // Use scene.onPointerObservable for click detection (set via metadata)
          body.metadata = { type: "suspect", id: suspect.id };
          head.metadata = { type: "suspect", id: suspect.id };

          // Idle animation
          let animTime = Math.random() * 10;
          scene.onBeforeRenderObservable.add(() => {
            animTime += engine.getDeltaTime() / 1000;
            body.position.y = 0.8 + Math.sin(animTime * 1.2) * 0.02;
            body.rotation.y = Math.sin(animTime * 0.3) * 0.3;
            head.position.y = body.position.y + 1 + Math.sin(animTime * 1.2) * 0.02;
            head.rotation.y = body.rotation.y;
          });
        });

        // === CLUE ORBS ===
        const clueData = [
          { id: "clue_shoe", room: "stage", label: "Bekas Sepatu", detail: "Bekas sepatu ukuran 42 di belakang tirai — bukan milik korban.", pos: [0, 0.3, -3] },
          { id: "clue_perfume", room: "dressing", label: "Botol Parfum", detail: "Parfum mawar setengah kosong — baru dipakai malam itu.", pos: [-1, 0.8, -1] },
          { id: "clue_usb", room: "studio", label: "Drive USB", detail: "USB dengan sidik jari Fiony. File terenkripsi.", pos: [0, 0.5, -2] },
          { id: "clue_tissue", room: "cafe", label: "Tisu Bekas", detail: "Tisu dengan lipstik pink — bukan milik Abigail.", pos: [1, 0.9, 0] },
          { id: "clue_safe", room: "archive", label: "Brankas Terbuka", detail: "Brankas terbuka — dokumen kontrak Hillary hilang.", pos: [2, 0.5, -3] },
          { id: "clue_cctv", room: "server", label: "Log CCTV", detail: "CCTV dimatikan 23:17-23:26. 9 menit kegelapan.", pos: [0, 1.2, -3] },
          { id: "clue_curtain", room: "stage", label: "Tirai Robek", detail: "Tirai beludru robek — tanda perjuangan.", pos: [2, 2, -4] },
          { id: "clue_note", room: "dressing", label: "Note Tersembunyi", detail: "Note: 'Aku tahu apa kau lakukan.'", pos: [1, 0.5, -3] },
        ];

        clueData.forEach((clue) => {
          const room = ROOMS.find((r) => r.id === clue.room);
          if (!room) return;

          const orb = MeshBuilder.CreateSphere(`clue_${clue.id}`, { diameter: 0.25 }, scene);
          orb.position.set(room.x + clue.pos[0], clue.pos[1], room.z + clue.pos[2]);
          const orbMat = new StandardMaterial(`clueMat_${clue.id}`, scene);
          orbMat.emissiveColor = new Color3(1, 0.8, 0.3);
          orbMat.disableLighting = true;
          orb.material = orbMat;
          orb.metadata = { type: "clue", id: clue.id, label: clue.label, detail: clue.detail };

          // Glow light
          const orbLight = new PointLight(`clueLight_${clue.id}`, orb.position.clone(), scene);
          orbLight.diffuse = new Color3(1, 0.8, 0.3);
          orbLight.intensity = 1.5;
          orbLight.range = 2;

          // Animation
          let t = Math.random() * 5;
          scene.onBeforeRenderObservable.add(() => {
            t += engine.getDeltaTime() / 1000;
            orb.position.y = clue.pos[1] + Math.sin(t * 2) * 0.08;
            orb.rotation.y = t * 0.5;
            orb.scaling.setAll(1 + Math.sin(t * 3) * 0.1);
          });
        });

        // === CLICK HANDLER ===
        scene.onPointerObservable.add((info: any) => {
          if (info.type === 1) { // POINTERTAP
            const pickInfo = info.pickInfo;
            if (pickInfo && pickInfo.hit && pickInfo.pickedMesh) {
              const meta = pickInfo.pickedMesh.metadata;
              if (meta) {
                if (meta.type === "clue") {
                  setCluePopup({ label: meta.label, detail: meta.detail });
                  setGameState((s) => {
                    const newClues = new Set(s.examinedClues);
                    newClues.add(meta.id);
                    setCluesFound(newClues.size);
                    return { ...s, examinedClues: newClues };
                  });
                } else if (meta.type === "suspect") {
                  const suspect = SUSPECTS.find((s) => s.id === meta.id);
                  if (suspect) setSuspectPopup(suspect);
                }
              }
            }
          }
        });

        // === ROOM DETECTION (which room is camera in) ===
        scene.onBeforeRenderObservable.add(() => {
          const camPos = camera.target;
          let nearestRoom = null;
          let nearestDist = Infinity;
          ROOMS.forEach((room) => {
            const dx = camPos.x - room.x;
            const dz = camPos.z - room.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < nearestDist && dist < 6) {
              nearestDist = dist;
              nearestRoom = room;
            }
          });
          if (nearestRoom && nearestRoom.id !== gameState.currentRoom) {
            setRoomLabel(nearestRoom.name);
          }
        });

        // === FPS MONITOR ===
        let lowFpsCount = 0;
        fpsTimer = setInterval(() => {
          if (disposed) return;
          const currentFps = engine.getFps();
          setFps(Math.round(currentFps));
          if (currentFps < 30) {
            lowFpsCount++;
            if (lowFpsCount >= 3) {
              engine.setHardwareScalingLevel(1.5);
              shadowGen.mapSize = 256;
            }
          } else {
            lowFpsCount = 0;
          }
        }, 1000);

        // === RESIZE ===
        resizeObserver = new ResizeObserver(() => {
          if (!disposed) engine.resize();
        });
        resizeObserver.observe(canvas);

        // === RENDER LOOP ===
        engine.runRenderLoop(() => {
          if (!disposed) scene.render();
        });

        setLoading(false);
      } catch (err) {
        console.error("Babylon init error:", err);
        setLoading(false);
      }
    }

    init();

    return () => {
      disposed = true;
      if (fpsTimer) clearInterval(fpsTimer);
      if (resizeObserver) resizeObserver.disconnect();
      if (engine) {
        engine.stopRenderLoop();
        if (scene) scene.dispose();
        engine.dispose();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[200]">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: "none", outline: "none" }}
      />

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-noir-ink z-50">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">🎭</div>
            <p className="font-stamp text-lg text-noir-brass">MEMUAT THEATER...</p>
            <p className="font-typewriter text-xs text-noir-paper/40 mt-2">Misteri Theater Berdarah</p>
          </div>
        </div>
      )}

      {/* Top bar — room name + FPS + clues */}
      {!loading && (
        <div className="absolute top-0 inset-x-0 p-3 flex items-center justify-between pointer-events-none z-30">
          <div className="px-3 py-1.5 bg-noir-ink/80 backdrop-blur border border-noir-brass/30 rounded">
            <p className="font-stamp text-sm font-bold text-noir-brass">📍 {roomLabel}</p>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1.5 bg-noir-ink/80 backdrop-blur border border-noir-brass/30 rounded">
              <p className="font-stamp text-xs text-noir-brass">🔍 {cluesFound}/8</p>
            </div>
            <div className="px-2 py-1.5 bg-noir-ink/80 backdrop-blur border border-noir-brass/30 rounded">
              <p className="font-mono text-xs" style={{ color: fps >= 50 ? "#0f0" : fps >= 30 ? "#fa0" : "#f00" }}>{fps}fps</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls hint */}
      {!loading && !cluePopup && !suspectPopup && (
        <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none z-30">
          <p className="font-typewriter text-[10px] text-noir-paper/40 tracking-widest uppercase">
            Drag untuk rotate · Pinch/Scroll untuk zoom · Klik orb/karakter untuk interaksi
          </p>
        </div>
      )}

      {/* Clue popup */}
      {cluePopup && (
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-noir-ink to-transparent z-40">
          <div className="max-w-md mx-auto bg-noir-coal/95 border border-noir-brass/40 rounded p-4">
            <p className="font-stamp text-xs text-noir-brass font-bold uppercase mb-1">🔍 {cluePopup.label}</p>
            <p className="font-typewriter text-sm text-noir-paper/90 italic mb-3">{cluePopup.detail}</p>
            <button
              onClick={() => setCluePopup(null)}
              className="font-stamp text-xs text-noir-crimson hover:text-red-400 underline"
            >
              tutup
            </button>
          </div>
        </div>
      )}

      {/* Suspect popup */}
      {suspectPopup && (
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-noir-ink/80 backdrop-blur z-40">
          <div className="max-w-sm w-full bg-noir-coal border-2 rounded overflow-hidden" style={{ borderColor: suspectPopup.color }}>
            <div className="relative h-48 overflow-hidden">
              <img src={suspectPopup.portrait} alt={suspectPopup.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-coal to-transparent" />
              <button
                onClick={() => setSuspectPopup(null)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-noir-ink/80 rounded-full text-noir-paper hover:text-red-400"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <p className="font-stamp text-xs tracking-widest uppercase font-bold" style={{ color: suspectPopup.color }}>
                {suspectPopup.codename}
              </p>
              <h3 className="font-stamp text-xl font-black text-noir-paper">{suspectPopup.name}</h3>
              <p className="font-typewriter text-xs text-noir-paper/60 mt-2">
                Tersangka malam pembunuhan. Klik untuk interogasi.
              </p>
              <button
                onClick={() => {
                  setGameState((s) => {
                    const newInt = new Set(s.interrogated);
                    newInt.add(suspectPopup.id);
                    return { ...s, interrogated: newInt };
                  });
                  setSuspectPopup(null);
                }}
                className="mt-3 w-full py-2 font-stamp text-xs uppercase tracking-widest text-noir-ink rounded"
                style={{ background: suspectPopup.color }}
              >
                🗣️ Interogasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
