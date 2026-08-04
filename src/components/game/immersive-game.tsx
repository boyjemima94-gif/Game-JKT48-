"use client";

import { useEffect, useRef, useState } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  Color3,
  Color4,
  HemisphericLight,
  DirectionalLight,
  PointLight,
  ShadowGenerator,
  MeshBuilder,
  StandardMaterial,
  GlowLayer,
} from "@babylonjs/core";

// ============================================================
// GAME DATA
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
  { id: "lobby", name: "Lobi Theater", color: "#2a2218", accent: "#ffd9a0", x: 0, z: 0 },
  { id: "stage", name: "Panggung Utama", color: "#2a1810", accent: "#ffcb7a", x: 0, z: -15 },
  { id: "dressing", name: "Ruang Ganti", color: "#1a2818", accent: "#ffb347", x: -12, z: -8 },
  { id: "cafe", name: "Kafe Lobi", color: "#282818", accent: "#ffd9a0", x: 12, z: -8 },
  { id: "studio", name: "Studio Rekaman", color: "#0d1828", accent: "#4a9be8", x: -12, z: -15 },
  { id: "archive", name: "Ruang Arsip", color: "#1a1a10", accent: "#c9a35a", x: 12, z: -15 },
  { id: "server", name: "Ruang Server", color: "#0d180d", accent: "#00ff66", x: 0, z: -25 },
];

const CLUES = [
  { id: "clue_shoe", room: "stage", label: "Bekas Sepatu", detail: "Bekas sepatu ukuran 42 di belakang tirai — bukan milik korban.", pos: [-1, 0.3, -3] as [number, number, number] },
  { id: "clue_perfume", room: "dressing", label: "Botol Parfum", detail: "Parfum mawar setengah kosong — baru dipakai malam itu.", pos: [-1, 0.8, -1] as [number, number, number] },
  { id: "clue_usb", room: "studio", label: "Drive USB", detail: "USB dengan sidik jari Fiony. File terenkripsi.", pos: [0, 0.5, -2] as [number, number, number] },
  { id: "clue_tissue", room: "cafe", label: "Tisu Bekas", detail: "Tisu dengan lipstik pink — bukan milik Abigail.", pos: [1, 0.9, 0] as [number, number, number] },
  { id: "clue_safe", room: "archive", label: "Brankas Terbuka", detail: "Brankas terbuka — dokumen kontrak Hillary hilang.", pos: [2, 0.5, -3] as [number, number, number] },
  { id: "clue_cctv", room: "server", label: "Log CCTV", detail: "CCTV dimatikan 23:17-23:26. 9 menit kegelapan.", pos: [0, 1.2, -3] as [number, number, number] },
  { id: "clue_curtain", room: "stage", label: "Tirai Robek", detail: "Tirai beludru robek — tanda perjuangan.", pos: [2, 2, -4] as [number, number, number] },
  { id: "clue_note", room: "dressing", label: "Note Tersembunyi", detail: "Note: 'Aku tahu apa kau lakukan.'", pos: [1, 0.5, -3] as [number, number, number] },
];

export default function ImmersiveGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [fps, setFps] = useState(60);
  const [roomLabel, setRoomLabel] = useState("Lobi Theater");
  const [cluesFound, setCluesFound] = useState(0);
  const [cluePopup, setCluePopup] = useState<{ label: string; detail: string } | null>(null);
  const [suspectPopup, setSuspectPopup] = useState<typeof SUSPECTS[0] | null>(null);
  const [interrogated, setInterrogated] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let disposed = false;

    // === ENGINE ===
    const engine = new Engine(canvas, true, {
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
      stencil: false,
    });

    // === SCENE ===
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.03, 0.02, 0.02, 1);
    scene.fogMode = Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.015;
    scene.fogColor = new Color3(0.03, 0.02, 0.02);

    // === CAMERA ===
    const camera = new ArcRotateCamera(
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

    // === LIGHTS ===
    const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
    hemi.intensity = 0.5;
    hemi.diffuse = new Color3(0.6, 0.5, 0.4);
    hemi.groundColor = new Color3(0.1, 0.08, 0.06);

    const dirLight = new DirectionalLight("dir", new Vector3(-0.3, -1, 0.2), scene);
    dirLight.position = new Vector3(5, 10, 5);
    dirLight.intensity = 0.4;

    const shadowGen = new ShadowGenerator(512, dirLight);
    shadowGen.useBlurExponentialShadowMap = true;
    shadowGen.blurKernel = 8;

    const glow = new GlowLayer("glow", scene);
    glow.intensity = 0.6;

    // === BUILD ROOMS ===
    ROOMS.forEach((room) => {
      const floorMat = new StandardMaterial(`fm_${room.id}`, scene);
      floorMat.diffuseColor = Color3.FromHexString(room.color);
      floorMat.specularColor = new Color3(0.05, 0.05, 0.05);

      // Floor
      const floor = MeshBuilder.CreateGround(`f_${room.id}`, { width: 10, height: 10 }, scene);
      floor.position.set(room.x, 0, room.z);
      floor.material = floorMat;
      floor.receiveShadows = true;

      // Walls
      const wallMat = new StandardMaterial(`wm_${room.id}`, scene);
      const wc = Color3.FromHexString(room.color);
      wallMat.diffuseColor = new Color3(wc.r + 0.05, wc.g + 0.05, wc.b + 0.05);
      wallMat.specularColor = new Color3(0.02, 0.02, 0.02);

      const back = MeshBuilder.CreateGround(`bw_${room.id}`, { width: 10, height: 5 }, scene);
      back.rotation.x = Math.PI / 2;
      back.position.set(room.x, 2.5, room.z - 5);
      back.material = wallMat;
      back.receiveShadows = true;

      const left = MeshBuilder.CreateGround(`lw_${room.id}`, { width: 10, height: 5 }, scene);
      left.rotation.z = Math.PI / 2;
      left.position.set(room.x - 5, 2.5, room.z);
      left.material = wallMat;
      left.receiveShadows = true;

      const right = left.clone(`rw_${room.id}`);
      right.position.x = room.x + 5;
      right.rotation.z = -Math.PI / 2;

      // Room light
      const rl = new PointLight(`rl_${room.id}`, new Vector3(room.x, 4, room.z), scene);
      rl.diffuse = Color3.FromHexString(room.accent);
      rl.intensity = 20;
      rl.range = 14;

      // Ceiling light fixture
      const fixture = MeshBuilder.CreateSphere(`fix_${room.id}`, { diameter: 0.3 }, scene);
      fixture.position.set(room.x, 4.5, room.z);
      const fixMat = new StandardMaterial(`fixM_${room.id}`, scene);
      fixMat.emissiveColor = Color3.FromHexString(room.accent);
      fixMat.disableLighting = true;
      fixture.material = fixMat;

      // Room props
      if (room.id === "stage") {
        const curtain = MeshBuilder.CreateGround("curtain", { width: 8, height: 4 }, scene);
        curtain.rotation.x = Math.PI / 2;
        curtain.position.set(room.x, 3, room.z - 4.8);
        const cm = new StandardMaterial("cm", scene);
        cm.diffuseColor = new Color3(0.35, 0.1, 0.1);
        curtain.material = cm;

        const stage = MeshBuilder.CreateBox("stage_plat", { width: 8, height: 0.5, depth: 4 }, scene);
        stage.position.set(room.x, 0.25, room.z - 1);
        stage.material = floorMat;
        shadowGen.addShadowCaster(stage);
      }

      if (room.id === "server") {
        [-2, 0, 2].forEach((xOff, i) => {
          const rack = MeshBuilder.CreateBox(`rack_${i}`, { width: 0.8, height: 3, depth: 0.6 }, scene);
          rack.position.set(room.x + xOff, 1.5, room.z - 4);
          const rm = new StandardMaterial(`rm_${i}`, scene);
          rm.diffuseColor = new Color3(0.05, 0.1, 0.05);
          rm.emissiveColor = new Color3(0, 0.15, 0.05);
          rack.material = rm;
          shadowGen.addShadowCaster(rack);
        });
      }

      if (room.id === "cafe") {
        const table = MeshBuilder.CreateCylinder("ctable", { height: 0.1, diameter: 1.5 }, scene);
        table.position.set(room.x, 0.8, room.z);
        const tm = new StandardMaterial("tm", scene);
        tm.diffuseColor = new Color3(0.2, 0.15, 0.1);
        table.material = tm;
        shadowGen.addShadowCaster(table);

        const leg = MeshBuilder.CreateCylinder("cleg", { height: 0.8, diameter: 0.1 }, scene);
        leg.position.set(room.x, 0.4, room.z);
        leg.material = tm;
      }

      if (room.id === "archive") {
        [-2, 0, 2].forEach((xOff, i) => {
          const shelf = MeshBuilder.CreateBox(`shelf_${i}`, { width: 2, height: 3, depth: 0.5 }, scene);
          shelf.position.set(room.x + xOff, 1.5, room.z - 4.5);
          const sm = new StandardMaterial(`sm_${i}`, scene);
          sm.diffuseColor = new Color3(0.2, 0.15, 0.08);
          shelf.material = sm;
          shadowGen.addShadowCaster(shelf);
        });

        const safe = MeshBuilder.CreateBox("safe", { width: 1, height: 1.4, depth: 0.8 }, scene);
        safe.position.set(room.x + 3, 0.7, room.z - 4);
        const safM = new StandardMaterial("safM", scene);
        safM.diffuseColor = new Color3(0.1, 0.1, 0.1);
        safM.specularColor = new Color3(0.3, 0.3, 0.3);
        safe.material = safM;
        shadowGen.addShadowCaster(safe);
      }

      if (room.id === "studio") {
        [-1, 0, 1].forEach((xOff) => {
          const mon = MeshBuilder.CreateBox(`mon_${xOff}`, { width: 0.8, height: 0.5, depth: 0.05 }, scene);
          mon.position.set(room.x + xOff, 1.2, room.z - 4.8);
          const mm = new StandardMaterial(`mm_${xOff}`, scene);
          mm.emissiveColor = new Color3(0.1, 0.2, 0.4);
          mm.disableLighting = true;
          mon.material = mm;
        });

        const desk = MeshBuilder.CreateBox("sdesk", { width: 3, height: 0.1, depth: 1 }, scene);
        desk.position.set(room.x, 0.8, room.z - 4.5);
        const dm = new StandardMaterial("dm", scene);
        dm.diffuseColor = new Color3(0.1, 0.1, 0.15);
        desk.material = dm;
        shadowGen.addShadowCaster(desk);
      }

      if (room.id === "dressing") {
        // Mirror
        const mirror = MeshBuilder.CreateGround("mirror", { width: 2, height: 1.5 }, scene);
        mirror.rotation.x = Math.PI / 2;
        mirror.position.set(room.x, 1.5, room.z - 4.8);
        const mm = new StandardMaterial("mirM", scene);
        mm.diffuseColor = new Color3(0.1, 0.1, 0.15);
        mm.specularColor = new Color3(0.8, 0.8, 0.8);
        mirror.material = mm;

        // Dressing table
        const dt = MeshBuilder.CreateBox("dtable", { width: 3, height: 0.1, depth: 0.8 }, scene);
        dt.position.set(room.x, 0.8, room.z - 4.5);
        const dtm = new StandardMaterial("dtm", scene);
        dtm.diffuseColor = new Color3(0.2, 0.15, 0.1);
        dt.material = dtm;
        shadowGen.addShadowCaster(dt);

        // Light bulbs around mirror
        for (let i = 0; i < 6; i++) {
          const bulb = MeshBuilder.CreateSphere(`bulb_${i}`, { diameter: 0.12 }, scene);
          const angle = (i / 6) * Math.PI * 2;
          bulb.position.set(room.x + Math.cos(angle) * 1.2, 1.5 + Math.sin(angle) * 0.8, room.z - 4.6);
          const bm = new StandardMaterial(`bm_${i}`, scene);
          bm.emissiveColor = new Color3(1, 0.7, 0.3);
          bm.disableLighting = true;
          bulb.material = bm;
        }
      }

      if (room.id === "lobby") {
        // Reception desk
        const desk = MeshBuilder.CreateBox("lobby_desk", { width: 2, height: 1, depth: 0.8 }, scene);
        desk.position.set(room.x, 0.5, room.z - 3);
        const dm = new StandardMaterial("ldm", scene);
        dm.diffuseColor = new Color3(0.2, 0.18, 0.12);
        desk.material = dm;
        shadowGen.addShadowCaster(desk);

        // Welcome sign
        const sign = MeshBuilder.CreateBox("sign", { width: 2, height: 0.5, depth: 0.1 }, scene);
        sign.position.set(room.x, 2.5, room.z - 4.9);
        const sm = new StandardMaterial("sigM", scene);
        sm.emissiveColor = new Color3(0.8, 0.6, 0.2);
        sm.disableLighting = true;
        sign.material = sm;
      }
    });

    // === HALLWAYS ===
    const hallMat = new StandardMaterial("hallMat", scene);
    hallMat.diffuseColor = new Color3(0.08, 0.06, 0.04);
    hallMat.specularColor = new Color3(0.01, 0.01, 0.01);

    const halls = [
      { w: 4, h: 5, x: 0, z: -7.5 },
      { w: 5, h: 4, x: -6, z: -4 },
      { w: 5, h: 4, x: 6, z: -4 },
      { w: 4, h: 5, x: 0, z: -20 },
      { w: 5, h: 4, x: -6, z: -12 },
      { w: 5, h: 4, x: 6, z: -12 },
    ];
    halls.forEach((h, i) => {
      const hall = MeshBuilder.CreateGround(`hall_${i}`, { width: h.w, height: h.h }, scene);
      hall.position.set(h.x, 0, h.z);
      hall.material = hallMat;
      hall.receiveShadows = true;
    });

    // === CHARACTER NPCs ===
    SUSPECTS.forEach((suspect) => {
      const room = ROOMS.find((r) => r.id === suspect.room);
      if (!room) return;

      const px = room.x + (Math.random() - 0.5) * 3;
      const pz = room.z + (Math.random() - 0.5) * 3;

      // Body
      const body = MeshBuilder.CreateCapsule(`b_${suspect.id}`, { height: 1.6, radius: 0.25 }, scene);
      body.position.set(px, 0.8, pz);
      const bm = new StandardMaterial(`bm_${suspect.id}`, scene);
      bm.diffuseColor = Color3.FromHexString(suspect.color);
      bm.emissiveColor = Color3.FromHexString(suspect.color).scale(0.12);
      body.material = bm;
      shadowGen.addShadowCaster(body);
      body.metadata = { type: "suspect", id: suspect.id };

      // Head
      const head = MeshBuilder.CreateSphere(`h_${suspect.id}`, { diameter: 0.4 }, scene);
      head.position.set(px, 1.8, pz);
      const hm = new StandardMaterial(`hm_${suspect.id}`, scene);
      hm.diffuseColor = new Color3(0.83, 0.66, 0.5);
      head.material = hm;
      shadowGen.addShadowCaster(head);
      head.metadata = { type: "suspect", id: suspect.id };

      // Character light
      const cl = new PointLight(`cl_${suspect.id}`, new Vector3(px, 1, pz), scene);
      cl.diffuse = Color3.FromHexString(suspect.color);
      cl.intensity = 2.5;
      cl.range = 3;

      // Idle animation
      let t = Math.random() * 10;
      scene.onBeforeRenderObservable.add(() => {
        if (disposed) return;
        t += engine.getDeltaTime() / 1000;
        body.position.y = 0.8 + Math.sin(t * 1.2) * 0.03;
        body.rotation.y = Math.sin(t * 0.3) * 0.3;
        head.position.y = body.position.y + 1;
        head.rotation.y = body.rotation.y;
      });
    });

    // === CLUE ORBS ===
    CLUES.forEach((clue) => {
      const room = ROOMS.find((r) => r.id === clue.room);
      if (!room) return;

      const orb = MeshBuilder.CreateSphere(`clue_${clue.id}`, { diameter: 0.3 }, scene);
      orb.position.set(room.x + clue.pos[0], clue.pos[1], room.z + clue.pos[2]);
      const om = new StandardMaterial(`clm_${clue.id}`, scene);
      om.emissiveColor = new Color3(1, 0.8, 0.3);
      om.disableLighting = true;
      orb.material = om;
      orb.metadata = { type: "clue", id: clue.id, label: clue.label, detail: clue.detail };

      // Glow light
      const ol = new PointLight(`ol_${clue.id}`, orb.position.clone(), scene);
      ol.diffuse = new Color3(1, 0.8, 0.3);
      ol.intensity = 2;
      ol.range = 2.5;

      // Animation
      let t = Math.random() * 5;
      scene.onBeforeRenderObservable.add(() => {
        if (disposed) return;
        t += engine.getDeltaTime() / 1000;
        orb.position.y = clue.pos[1] + Math.sin(t * 2) * 0.1;
        orb.rotation.y = t * 0.5;
        orb.scaling.setAll(1 + Math.sin(t * 3) * 0.12);
      });
    });

    // === CLICK HANDLER ===
    scene.onPointerObservable.add((info: any) => {
      if (disposed) return;
      if (info.type === 1) {
        const pick = info.pickInfo;
        if (pick && pick.hit && pick.pickedMesh && pick.pickedMesh.metadata) {
          const meta = pick.pickedMesh.metadata;
          if (meta.type === "clue") {
            setCluePopup({ label: meta.label, detail: meta.detail });
            setCluesFound((c) => c + 1);
          } else if (meta.type === "suspect") {
            const s = SUSPECTS.find((x) => x.id === meta.id);
            if (s) setSuspectPopup(s);
          }
        }
      }
    });

    // === ROOM DETECTION ===
    let lastRoom = "lobby";
    scene.onBeforeRenderObservable.add(() => {
      if (disposed) return;
      const cp = camera.target;
      let nearest = null;
      let minDist = 999;
      ROOMS.forEach((r) => {
        const d = Math.sqrt((cp.x - r.x) ** 2 + (cp.z - r.z) ** 2);
        if (d < minDist && d < 6) {
          minDist = d;
          nearest = r;
        }
      });
      if (nearest && nearest.id !== lastRoom) {
        lastRoom = nearest.id;
        setRoomLabel(nearest.name);
      }
    });

    // === FPS MONITOR ===
    let lowCount = 0;
    let qualityReduced = false;
    const fpsTimer = setInterval(() => {
      if (disposed) return;
      const f = engine.getFps();
      setFps(Math.round(f));
      if (f < 30 && !qualityReduced) {
        lowCount++;
        if (lowCount >= 3) {
          engine.setHardwareScalingLevel(1.5);
          shadowGen.mapSize = 256;
          qualityReduced = true;
        }
      } else {
        lowCount = 0;
      }
    }, 1000);

    // === RESIZE ===
    const ro = new ResizeObserver(() => {
      if (!disposed) engine.resize();
    });
    ro.observe(canvas);

    // === RENDER LOOP ===
    engine.runRenderLoop(() => {
      if (!disposed) scene.render();
    });

    setLoading(false);

    // Cleanup
    return () => {
      disposed = true;
      clearInterval(fpsTimer);
      ro.disconnect();
      engine.stopRenderLoop();
      scene.dispose();
      engine.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ touchAction: "none", outline: "none" }}
      />

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <div className="text-center">
            <div className="text-5xl mb-4 animate-pulse">🎭</div>
            <p className="font-mono text-sm text-amber-400 tracking-wider">
              MEMUAT MISTERI THEATER BERDARAH...
            </p>
            <div className="mt-4 w-48 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-amber-500 animate-pulse" style={{ width: "60%" }} />
            </div>
          </div>
        </div>
      )}

      {/* HUD */}
      {!loading && (
        <>
          {/* Top bar */}
          <div className="absolute top-0 inset-x-0 p-3 flex items-center justify-between pointer-events-none z-30">
            <div className="px-3 py-1.5 bg-black/70 backdrop-blur border border-amber-600/30 rounded">
              <p className="font-mono text-sm font-bold text-amber-400">📍 {roomLabel}</p>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-black/70 backdrop-blur border border-amber-600/30 rounded">
                <p className="font-mono text-xs text-amber-400">🔍 {cluesFound}/8</p>
              </div>
              <div className="px-2 py-1.5 bg-black/70 backdrop-blur border border-amber-600/30 rounded">
                <p
                  className="font-mono text-xs font-bold"
                  style={{ color: fps >= 50 ? "#0f0" : fps >= 30 ? "#fa0" : "#f00" }}
                >
                  {fps}
                </p>
              </div>
            </div>
          </div>

          {/* Controls hint */}
          {!cluePopup && !suspectPopup && (
            <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none z-30">
              <p className="font-mono text-[10px] text-white/40 tracking-wider uppercase">
                Drag rotate · Pinch zoom · Klik orb/karakter
              </p>
            </div>
          )}

          {/* Clue popup */}
          {cluePopup && (
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black to-transparent z-40">
              <div className="max-w-md mx-auto bg-gray-900/95 border border-amber-600/40 rounded-lg p-4">
                <p className="font-mono text-xs text-amber-400 font-bold uppercase mb-1">
                  🔍 {cluePopup.label}
                </p>
                <p className="font-mono text-sm text-white/90 italic mb-3">
                  {cluePopup.detail}
                </p>
                <button
                  onClick={() => setCluePopup(null)}
                  className="font-mono text-xs text-red-400 hover:text-red-300 underline"
                >
                  tutup
                </button>
              </div>
            </div>
          )}

          {/* Suspect popup */}
          {suspectPopup && (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur z-40">
              <div
                className="max-w-xs w-full bg-gray-900 border-2 rounded-lg overflow-hidden"
                style={{ borderColor: suspectPopup.color }}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={suspectPopup.portrait}
                    alt={suspectPopup.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                  <button
                    onClick={() => setSuspectPopup(null)}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/80 rounded-full text-white hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4">
                  <p
                    className="font-mono text-[10px] tracking-widest uppercase font-bold"
                    style={{ color: suspectPopup.color }}
                  >
                    {suspectPopup.codename}
                  </p>
                  <h3 className="font-mono text-lg font-black text-white">
                    {suspectPopup.name}
                  </h3>
                  <p className="font-mono text-xs text-white/60 mt-2">
                    Tersangka malam pembunuhan.
                  </p>
                  <button
                    onClick={() => {
                      setInterrogated((prev) => new Set(prev).add(suspectPopup.id));
                      setSuspectPopup(null);
                    }}
                    className="mt-3 w-full py-2 font-mono text-xs uppercase tracking-wider text-black rounded font-bold"
                    style={{ background: suspectPopup.color }}
                  >
                    🗣️ Interogasi
                  </button>
                  {interrogated.has(suspectPopup.id) && (
                    <p className="font-mono text-[10px] text-green-400 mt-2 text-center">
                      ✓ Sudah diinterogasi
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
