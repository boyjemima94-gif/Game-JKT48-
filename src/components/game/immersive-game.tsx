"use client";

import { useEffect, useRef, useState } from "react";

// Load Babylon.js from CDN — avoids Turbopack compile issues
const BABYLON_CDN = "https://cdn.babylonjs.com/babylon.js";

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
  { id: "clue_shoe", room: "stage", label: "Bekas Sepatu", detail: "Bekas sepatu ukuran 42 di belakang tirai — bukan milik korban.", pos: [-1, 0.3, -3] },
  { id: "clue_perfume", room: "dressing", label: "Botol Parfum", detail: "Parfum mawar setengah kosong — baru dipakai malam itu.", pos: [-1, 0.8, -1] },
  { id: "clue_usb", room: "studio", label: "Drive USB", detail: "USB dengan sidik jari Fiony. File terenkripsi.", pos: [0, 0.5, -2] },
  { id: "clue_tissue", room: "cafe", label: "Tisu Bekas", detail: "Tisu dengan lipstik pink — bukan milik Abigail.", pos: [1, 0.9, 0] },
  { id: "clue_safe", room: "archive", label: "Brankas Terbuka", detail: "Brankas terbuka — dokumen kontrak Hillary hilang.", pos: [2, 0.5, -3] },
  { id: "clue_cctv", room: "server", label: "Log CCTV", detail: "CCTV dimatikan 23:17-23:26. 9 menit kegelapan.", pos: [0, 1.2, -3] },
  { id: "clue_curtain", room: "stage", label: "Tirai Robek", detail: "Tirai beludru robek — tanda perjuangan.", pos: [2, 2, -4] },
  { id: "clue_note", room: "dressing", label: "Note Tersembunyi", detail: "Note: 'Aku tahu apa kau lakukan.'", pos: [1, 0.5, -3] },
];

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).BABYLON) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export default function ImmersiveGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState(60);
  const [roomLabel, setRoomLabel] = useState("Lobi Theater");
  const [cluesFound, setCluesFound] = useState(0);
  const [cluePopup, setCluePopup] = useState<{ label: string; detail: string } | null>(null);
  const [suspectPopup, setSuspectPopup] = useState<typeof SUSPECTS[0] | null>(null);
  const [interrogated, setInterrogated] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!canvasRef.current) return;
    let disposed = false;
    let engine: any = null;
    let scene: any = null;

    loadScript(BABYLON_CDN)
      .then(() => {
        if (disposed || !canvasRef.current) return;
        const B = (window as any).BABYLON;

        // === ENGINE ===
        engine = new B.Engine(canvasRef.current, true, {
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          stencil: false,
        });

        // === SCENE ===
        scene = new B.Scene(engine);
        scene.clearColor = new B.Color4(0.03, 0.02, 0.02, 1);
        scene.fogMode = B.Scene.FOGMODE_EXP2;
        scene.fogDensity = 0.015;
        scene.fogColor = new B.Color3(0.03, 0.02, 0.02);

        // === CAMERA ===
        const camera = new B.ArcRotateCamera("cam", -Math.PI / 2, Math.PI / 2.8, 8, new B.Vector3(0, 1, 0), canvasRef.current);
        camera.attachControl(canvasRef.current, true);
        camera.lowerRadiusLimit = 3;
        camera.upperRadiusLimit = 15;
        camera.lowerBetaLimit = Math.PI / 6;
        camera.upperBetaLimit = Math.PI / 2.1;
        camera.wheelDeltaPercentage = 0.01;
        camera.pinchDeltaPercentage = 0.01;

        // === LIGHTS ===
        const hemi = new B.HemisphericLight("hemi", new B.Vector3(0, 1, 0), scene);
        hemi.intensity = 0.5;
        hemi.diffuse = new B.Color3(0.6, 0.5, 0.4);
        hemi.groundColor = new B.Color3(0.1, 0.08, 0.06);

        const dirLight = new B.DirectionalLight("dir", new B.Vector3(-0.3, -1, 0.2), scene);
        dirLight.position = new B.Vector3(5, 10, 5);
        dirLight.intensity = 0.4;

        const shadowGen = new B.ShadowGenerator(512, dirLight);
        shadowGen.useBlurExponentialShadowMap = true;
        shadowGen.blurKernel = 8;

        const glow = new B.GlowLayer("glow", scene);
        glow.intensity = 0.6;

        // === BUILD ROOMS ===
        ROOMS.forEach((room) => {
          const floorMat = new B.StandardMaterial(`fm_${room.id}`, scene);
          floorMat.diffuseColor = B.Color3.FromHexString(room.color);
          floorMat.specularColor = new B.Color3(0.05, 0.05, 0.05);

          const floor = B.MeshBuilder.CreateGround(`f_${room.id}`, { width: 10, height: 10 }, scene);
          floor.position.set(room.x, 0, room.z);
          floor.material = floorMat;
          floor.receiveShadows = true;

          const wallMat = new B.StandardMaterial(`wm_${room.id}`, scene);
          const wc = B.Color3.FromHexString(room.color);
          wallMat.diffuseColor = new B.Color3(wc.r + 0.05, wc.g + 0.05, wc.b + 0.05);
          wallMat.specularColor = new B.Color3(0.02, 0.02, 0.02);

          const back = B.MeshBuilder.CreateGround(`bw_${room.id}`, { width: 10, height: 5 }, scene);
          back.rotation.x = Math.PI / 2;
          back.position.set(room.x, 2.5, room.z - 5);
          back.material = wallMat;
          back.receiveShadows = true;

          const left = B.MeshBuilder.CreateGround(`lw_${room.id}`, { width: 10, height: 5 }, scene);
          left.rotation.z = Math.PI / 2;
          left.position.set(room.x - 5, 2.5, room.z);
          left.material = wallMat;
          left.receiveShadows = true;

          const right = left.clone(`rw_${room.id}`);
          right.position.x = room.x + 5;
          right.rotation.z = -Math.PI / 2;

          // Room light
          const rl = new B.PointLight(`rl_${room.id}`, new B.Vector3(room.x, 4, room.z), scene);
          rl.diffuse = B.Color3.FromHexString(room.accent);
          rl.intensity = 20;
          rl.range = 14;

          // Ceiling light fixture (glowing sphere)
          const fixture = B.MeshBuilder.CreateSphere(`fix_${room.id}`, { diameter: 0.3 }, scene);
          fixture.position.set(room.x, 4.5, room.z);
          const fixMat = new B.StandardMaterial(`fixM_${room.id}`, scene);
          fixMat.emissiveColor = B.Color3.FromHexString(room.accent);
          fixMat.disableLighting = true;
          fixture.material = fixMat;

          // Room-specific props
          if (room.id === "stage") {
            const curtain = B.MeshBuilder.CreateGround("curtain", { width: 8, height: 4 }, scene);
            curtain.rotation.x = Math.PI / 2;
            curtain.position.set(room.x, 3, room.z - 4.8);
            const cm = new B.StandardMaterial("cm", scene);
            cm.diffuseColor = new B.Color3(0.35, 0.1, 0.1);
            curtain.material = cm;

            const stage = B.MeshBuilder.CreateBox("stage_plat", { width: 8, height: 0.5, depth: 4 }, scene);
            stage.position.set(room.x, 0.25, room.z - 1);
            stage.material = floorMat;
            shadowGen.addShadowCaster(stage);
          }

          if (room.id === "server") {
            [-2, 0, 2].forEach((xOff, i) => {
              const rack = B.MeshBuilder.CreateBox(`rack_${i}`, { width: 0.8, height: 3, depth: 0.6 }, scene);
              rack.position.set(room.x + xOff, 1.5, room.z - 4);
              const rm = new B.StandardMaterial(`rm_${i}`, scene);
              rm.diffuseColor = new B.Color3(0.05, 0.1, 0.05);
              rm.emissiveColor = new B.Color3(0, 0.15, 0.05);
              rack.material = rm;
              shadowGen.addShadowCaster(rack);
            });
          }

          if (room.id === "cafe") {
            const table = B.MeshBuilder.CreateCylinder("ctable", { height: 0.1, diameter: 1.5 }, scene);
            table.position.set(room.x, 0.8, room.z);
            const tm = new B.StandardMaterial("tm", scene);
            tm.diffuseColor = new B.Color3(0.2, 0.15, 0.1);
            table.material = tm;
            shadowGen.addShadowCaster(table);

            const leg = B.MeshBuilder.CreateCylinder("cleg", { height: 0.8, diameter: 0.1 }, scene);
            leg.position.set(room.x, 0.4, room.z);
            leg.material = tm;
          }

          if (room.id === "archive") {
            [-2, 0, 2].forEach((xOff, i) => {
              const shelf = B.MeshBuilder.CreateBox(`shelf_${i}`, { width: 2, height: 3, depth: 0.5 }, scene);
              shelf.position.set(room.x + xOff, 1.5, room.z - 4.5);
              const sm = new B.StandardMaterial(`sm_${i}`, scene);
              sm.diffuseColor = new B.Color3(0.2, 0.15, 0.08);
              shelf.material = sm;
              shadowGen.addShadowCaster(shelf);
            });

            const safe = B.MeshBuilder.CreateBox("safe", { width: 1, height: 1.4, depth: 0.8 }, scene);
            safe.position.set(room.x + 3, 0.7, room.z - 4);
            const safM = new B.StandardMaterial("safM", scene);
            safM.diffuseColor = new B.Color3(0.1, 0.1, 0.1);
            safe.material = safM;
            shadowGen.addShadowCaster(safe);
          }

          if (room.id === "studio") {
            [-1, 0, 1].forEach((xOff) => {
              const mon = B.MeshBuilder.CreateBox(`mon_${xOff}`, { width: 0.8, height: 0.5, depth: 0.05 }, scene);
              mon.position.set(room.x + xOff, 1.2, room.z - 4.8);
              const mm = new B.StandardMaterial(`mm_${xOff}`, scene);
              mm.emissiveColor = new B.Color3(0.1, 0.2, 0.4);
              mm.disableLighting = true;
              mon.material = mm;
            });

            const desk = B.MeshBuilder.CreateBox("sdesk", { width: 3, height: 0.1, depth: 1 }, scene);
            desk.position.set(room.x, 0.8, room.z - 4.5);
            const dm = new B.StandardMaterial("dm", scene);
            dm.diffuseColor = new B.Color3(0.1, 0.1, 0.15);
            desk.material = dm;
            shadowGen.addShadowCaster(desk);
          }

          if (room.id === "dressing") {
            const mirror = B.MeshBuilder.CreateGround("mirror", { width: 2, height: 1.5 }, scene);
            mirror.rotation.x = Math.PI / 2;
            mirror.position.set(room.x, 1.5, room.z - 4.8);
            const mm = new B.StandardMaterial("mirM", scene);
            mm.diffuseColor = new B.Color3(0.1, 0.1, 0.15);
            mm.specularColor = new B.Color3(0.8, 0.8, 0.8);
            mirror.material = mm;

            const dt = B.MeshBuilder.CreateBox("dtable", { width: 3, height: 0.1, depth: 0.8 }, scene);
            dt.position.set(room.x, 0.8, room.z - 4.5);
            const dtm = new B.StandardMaterial("dtm", scene);
            dtm.diffuseColor = new B.Color3(0.2, 0.15, 0.1);
            dt.material = dtm;
            shadowGen.addShadowCaster(dt);

            for (let i = 0; i < 6; i++) {
              const bulb = B.MeshBuilder.CreateSphere(`bulb_${i}`, { diameter: 0.12 }, scene);
              const angle = (i / 6) * Math.PI * 2;
              bulb.position.set(room.x + Math.cos(angle) * 1.2, 1.5 + Math.sin(angle) * 0.8, room.z - 4.6);
              const bm = new B.StandardMaterial(`bm_${i}`, scene);
              bm.emissiveColor = new B.Color3(1, 0.7, 0.3);
              bm.disableLighting = true;
              bulb.material = bm;
            }
          }

          if (room.id === "lobby") {
            const desk = B.MeshBuilder.CreateBox("lobby_desk", { width: 2, height: 1, depth: 0.8 }, scene);
            desk.position.set(room.x, 0.5, room.z - 3);
            const dm = new B.StandardMaterial("ldm", scene);
            dm.diffuseColor = new B.Color3(0.2, 0.18, 0.12);
            desk.material = dm;
            shadowGen.addShadowCaster(desk);
          }
        });

        // === HALLWAYS ===
        const hallMat = new B.StandardMaterial("hallMat", scene);
        hallMat.diffuseColor = new B.Color3(0.08, 0.06, 0.04);
        hallMat.specularColor = new B.Color3(0.01, 0.01, 0.01);

        const halls = [
          { w: 4, h: 5, x: 0, z: -7.5 },
          { w: 5, h: 4, x: -6, z: -4 },
          { w: 5, h: 4, x: 6, z: -4 },
          { w: 4, h: 5, x: 0, z: -20 },
          { w: 5, h: 4, x: -6, z: -12 },
          { w: 5, h: 4, x: 6, z: -12 },
        ];
        halls.forEach((h, i) => {
          const hall = B.MeshBuilder.CreateGround(`hall_${i}`, { width: h.w, height: h.h }, scene);
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

          const body = B.MeshBuilder.CreateCapsule(`b_${suspect.id}`, { height: 1.6, radius: 0.25 }, scene);
          body.position.set(px, 0.8, pz);
          const bm = new B.StandardMaterial(`bm_${suspect.id}`, scene);
          bm.diffuseColor = B.Color3.FromHexString(suspect.color);
          bm.emissiveColor = B.Color3.FromHexString(suspect.color).scale(0.12);
          body.material = bm;
          shadowGen.addShadowCaster(body);
          body.metadata = { type: "suspect", id: suspect.id };

          const head = B.MeshBuilder.CreateSphere(`h_${suspect.id}`, { diameter: 0.4 }, scene);
          head.position.set(px, 1.8, pz);
          const hm = new B.StandardMaterial(`hm_${suspect.id}`, scene);
          hm.diffuseColor = new B.Color3(0.83, 0.66, 0.5);
          head.material = hm;
          shadowGen.addShadowCaster(head);
          head.metadata = { type: "suspect", id: suspect.id };

          const cl = new B.PointLight(`cl_${suspect.id}`, new B.Vector3(px, 1, pz), scene);
          cl.diffuse = B.Color3.FromHexString(suspect.color);
          cl.intensity = 2.5;
          cl.range = 3;

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

          const orb = B.MeshBuilder.CreateSphere(`clue_${clue.id}`, { diameter: 0.3 }, scene);
          orb.position.set(room.x + clue.pos[0], clue.pos[1], room.z + clue.pos[2]);
          const om = new B.StandardMaterial(`clm_${clue.id}`, scene);
          om.emissiveColor = new B.Color3(1, 0.8, 0.3);
          om.disableLighting = true;
          orb.material = om;
          orb.metadata = { type: "clue", id: clue.id, label: clue.label, detail: clue.detail };

          const ol = new B.PointLight(`ol_${clue.id}`, orb.position.clone(), scene);
          ol.diffuse = new B.Color3(1, 0.8, 0.3);
          ol.intensity = 2;
          ol.range = 2.5;

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
          let nearest: any = null;
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
        ro.observe(canvasRef.current);

        // === RENDER LOOP ===
        engine.runRenderLoop(() => {
          if (!disposed) scene.render();
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Babylon load error:", err);
        setError("Gagal memuat Babylon.js. Periksa koneksi internet.");
        setLoading(false);
      });

    return () => {
      disposed = true;
      if (engine) {
        engine.stopRenderLoop();
        if (scene) scene.dispose();
        engine.dispose();
      }
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

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="font-mono text-sm text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-amber-600 text-black font-mono text-xs uppercase rounded"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* HUD */}
      {!loading && !error && (
        <>
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

          {!cluePopup && !suspectPopup && (
            <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none z-30">
              <p className="font-mono text-[10px] text-white/40 tracking-wider uppercase">
                Drag rotate · Pinch zoom · Klik orb kuning/karakter berwarna
              </p>
            </div>
          )}

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
