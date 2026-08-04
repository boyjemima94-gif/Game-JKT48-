"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ============================================================
// GAME DATA — 8 Suspects (dipertahankan dari versi sebelumnya)
// ============================================================
const SUSPECTS = [
  { id: "oline", name: "Oline Manuel", codename: "BURUNG MERAK", color: "#e0a83c", room: "stage", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2b3454ce4879.jpg", role: "The Lead Star", quote: "Panggung ini milikku. Selalu milikku." },
  { id: "catherina", name: "Catherina Valencia", codename: "MERAH MUDA", color: "#c0392b", room: "dressing", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9ea50407c914.jpg", role: "The Rival", quote: "Aku tidak pernah memaafkan pengkhianatan." },
  { id: "abigail", name: "Abigail Rachel", codename: "ANGSA PUTIH", color: "#9a7b4f", room: "cafe", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/25175d128e83.jpg", role: "The Confidante", quote: "Ada rahasia yang lebih baik kubur." },
  { id: "fiony", name: "Fiony Alveria", codename: "BAYANG MALAM", color: "#7a5c8a", room: "studio", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/070d4143804a.jpg", role: "The Strategist", quote: "Setiap langkah sudah kuhitung." },
  { id: "hillary", name: "Hillary Abigail", codename: "BAYANGAN TIRAI", color: "#5a8a6a", room: "archive", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5a2d1c0d1f99.jpg", role: "The Whisper", quote: "Kebenaran terkadang lebih baik disembunyikan." },
  { id: "victoria", name: "Victoria Kimberly", codename: "BUMI TERATAI", color: "#6a9bd4", room: "lobby", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ebd9572a3092.jpg", role: "The Innocent", quote: "Aku hanya ingin menjadi bintang." },
  { id: "marsha", name: "Marsha Lenathea", codename: "PIZZA DREAMER", color: "#d46a9b", room: "server", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b509794743f0.jpg", role: "The Gamer", quote: "Setiap game punya cheat code." },
  { id: "adeline", name: "Adeline Wijaya", codename: "MATA SENJA", color: "#8a7ad4", room: "stage", portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c2f8cd60fbb1.jpg", role: "The Witness", quote: "Setiap orang punya bayangan." },
];

const ROOMS = [
  { id: "lobby", name: "Lobi Theater", bg: "#1a1410", accent: "#ffd9a0", icon: "🏛️", desc: "Lobi utama theater. Meja resepsionis, poster pertunjukan. Victoria duduk di sini." },
  { id: "stage", name: "Panggung Utama", bg: "#1a0d0a", accent: "#ffcb7a", icon: "🎭", desc: "Panggung dengan tirai beludru merah. Korban ditemukan di sini. Oline dan Adeline berada di sini." },
  { id: "dressing", name: "Ruang Ganti", bg: "#0d1a0d", accent: "#ffb347", icon: "🪞", desc: "Cermin dengan lampu bohlam. Meja rias penuh kosmetik. Catherina di sini." },
  { id: "cafe", name: "Kafe Lobi", bg: "#1a1a0d", accent: "#ffd9a0", icon: "☕", desc: "Kafe kecil dengan meja bundar. Aroma kopi. Abigail duduk sendirian." },
  { id: "studio", name: "Studio Rekaman", bg: "#0a0d1a", accent: "#4a9be8", icon: "🎥", desc: "Monitor biru dingin, meja editing. Fiony bekerja di sini." },
  { id: "archive", name: "Ruang Arsip", bg: "#0d0d0d", accent: "#c9a35a", icon: "📂", desc: "Rak buku tinggi, brankas baja. Hillary menyusup ke sini." },
  { id: "server", name: "Ruang Server", bg: "#0d1a0d", accent: "#00ff66", icon: "🖥️", desc: "Rack server dengan LED hijau. Terminal CCTV. Marsha di sini." },
];

const CLUES = [
  { id: "c1", room: "stage", label: "Bekas Sepatu", detail: "Bekas sepatu ukuran 42 di belakang tirai — bukan milik korban.", x: 30, y: 60 },
  { id: "c2", room: "stage", label: "Tirai Robek", detail: "Tirai beludru robek di bagian bawah — tanda perjuangan.", x: 70, y: 40 },
  { id: "c3", room: "dressing", label: "Botol Parfum", detail: "Parfum mawar setengah kosong — baru dipakai malam itu.", x: 25, y: 55 },
  { id: "c4", room: "dressing", label: "Note Tersembunyi", detail: "Note: 'Aku tahu apa kau lakukan.'", x: 75, y: 65 },
  { id: "c5", room: "studio", label: "Drive USB", detail: "USB dengan sidik jari Fiony. File terenkripsi.", x: 50, y: 50 },
  { id: "c6", room: "cafe", label: "Tisu Bekas", detail: "Tisu dengan lipstik pink — bukan milik Abigail.", x: 60, y: 60 },
  { id: "c7", room: "archive", label: "Brankas Terbuka", detail: "Brankas terbuka — dokumen kontrak Hillary hilang.", x: 70, y: 55 },
  { id: "c8", room: "server", label: "Log CCTV", detail: "CCTV dimatikan 23:17-23:26. 9 menit kegelapan.", x: 50, y: 45 },
];

export default function ImmersiveGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentRoom, setCurrentRoom] = useState("lobby");
  const [examinedClues, setExaminedClues] = useState<Set<string>>(new Set());
  const [interrogated, setInterrogated] = useState<Set<string>>(new Set());
  const [cluePopup, setCluePopup] = useState<{ label: string; detail: string } | null>(null);
  const [suspectPopup, setSuspectPopup] = useState<typeof SUSPECTS[0] | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showNotebook, setShowNotebook] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animFrame = useRef<number>(0);

  const room = ROOMS.find((r) => r.id === currentRoom)!;
  const roomSuspects = SUSPECTS.filter((s) => s.room === currentRoom);
  const roomClues = CLUES.filter((c) => c.room === currentRoom);

  // Canvas rendering — pseudo-3D room with perspective
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const render = () => {
      t += 0.016;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Clear
      ctx.fillStyle = room.bg;
      ctx.fillRect(0, 0, w, h);

      // Floor with perspective grid
      const horizon = h * 0.35;
      const floorH = h - horizon;
      ctx.fillStyle = room.bg;
      ctx.fillRect(0, horizon, w, floorH);

      // Perspective floor lines
      ctx.strokeStyle = `${room.accent}15`;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const fx = (i / 10) * w;
        ctx.beginPath();
        ctx.moveTo(fx, h);
        ctx.lineTo(cx + (fx - cx) * 0.3, horizon);
        ctx.stroke();
      }
      // Horizontal floor lines (perspective)
      for (let i = 1; i <= 5; i++) {
        const fy = horizon + (floorH * (i / 5) * (i / 5));
        ctx.beginPath();
        ctx.moveTo(0, fy);
        ctx.lineTo(w, fy);
        ctx.stroke();
      }

      // Back wall
      const wallH = horizon;
      const wallGrad = ctx.createLinearGradient(0, 0, 0, wallH);
      wallGrad.addColorStop(0, room.bg);
      wallGrad.addColorStop(1, `${room.accent}10`);
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, w, wallH);

      // Spotlight from top
      const breath = 0.85 + Math.sin(t * 0.8) * 0.1 + Math.sin(t * 2.1) * 0.05;
      const spotGrad = ctx.createRadialGradient(cx, 0, 0, cx, h * 0.5, h * 0.6);
      spotGrad.addColorStop(0, `${room.accent}${Math.round(breath * 30).toString(16).padStart(2, "0")}`);
      spotGrad.addColorStop(0.5, `${room.accent}08`);
      spotGrad.addColorStop(1, "transparent");
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, w, h);

      // Ceiling light fixture
      ctx.fillStyle = room.accent;
      ctx.globalAlpha = breath;
      ctx.beginPath();
      ctx.arc(cx, 20, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(cx, 20, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Light cone (volumetric)
      ctx.fillStyle = `${room.accent}08`;
      ctx.beginPath();
      ctx.moveTo(cx - 5, 20);
      ctx.lineTo(cx - 80, h * 0.7);
      ctx.lineTo(cx + 80, h * 0.7);
      ctx.lineTo(cx + 5, 20);
      ctx.closePath();
      ctx.fill();

      // Room props (simple 2D representations)
      ctx.save();
      if (currentRoom === "stage") {
        // Curtain
        ctx.fillStyle = "#3a1010";
        ctx.fillRect(0, 0, w, wallH * 0.7);
        // Curtain folds
        for (let i = 0; i < 8; i++) {
          ctx.fillStyle = i % 2 === 0 ? "#4a1515" : "#2a0808";
          ctx.fillRect((i / 8) * w, 0, w / 8, wallH * 0.7);
        }
        // Stage platform
        ctx.fillStyle = "#2a1810";
        ctx.fillRect(0, horizon - 10, w, 20);
        ctx.fillStyle = "#3a2218";
        ctx.fillRect(0, horizon - 10, w, 5);
      }

      if (currentRoom === "server") {
        // Server racks
        [-1, 0, 1].forEach((xOff) => {
          const rx = cx + xOff * 80;
          ctx.fillStyle = "#0a1a0a";
          ctx.fillRect(rx - 25, horizon - 100, 50, 100);
          // LEDs
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 3; j++) {
              const blink = Math.sin(t * 3 + i + j) > 0.3;
              ctx.fillStyle = blink ? "#00ff44" : "#005522";
              ctx.fillRect(rx - 18 + j * 12, horizon - 95 + i * 10, 6, 4);
            }
          }
        });
      }

      if (currentRoom === "dressing") {
        // Mirror
        ctx.fillStyle = "#1a1a2a";
        ctx.fillRect(cx - 60, horizon - 80, 120, 70);
        ctx.strokeStyle = "#c9a35a";
        ctx.lineWidth = 3;
        ctx.strokeRect(cx - 60, horizon - 80, 120, 70);
        // Light bulbs
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const bx = cx + Math.cos(angle) * 65;
          const by = horizon - 45 + Math.sin(angle) * 40;
          const glow = 0.7 + Math.sin(t * 4 + i) * 0.3;
          ctx.fillStyle = `rgba(255, 180, 70, ${glow})`;
          ctx.beginPath();
          ctx.arc(bx, by, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (currentRoom === "cafe") {
        // Table
        ctx.fillStyle = "#2a1a10";
        ctx.beginPath();
        ctx.ellipse(cx, h * 0.65, 50, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx - 3, h * 0.65, 6, 40);
        // Coffee cup
        ctx.fillStyle = "#e8dcc0";
        ctx.beginPath();
        ctx.arc(cx + 15, h * 0.62, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#2a1a10";
        ctx.beginPath();
        ctx.arc(cx + 15, h * 0.62, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (currentRoom === "studio") {
        // Monitors
        [-1, 0, 1].forEach((xOff) => {
          const mx = cx + xOff * 60;
          ctx.fillStyle = "#0a1525";
          ctx.fillRect(mx - 25, horizon - 70, 50, 35);
          ctx.fillStyle = `rgba(74, 155, 232, ${0.3 + Math.sin(t * 2 + xOff) * 0.1})`;
          ctx.fillRect(mx - 22, horizon - 67, 44, 29);
        });
        // Desk
        ctx.fillStyle = "#0d0d18";
        ctx.fillRect(cx - 80, horizon - 10, 160, 8);
      }

      if (currentRoom === "archive") {
        // Shelves
        [-1, 0, 1].forEach((xOff) => {
          const sx = cx + xOff * 70;
          ctx.fillStyle = "#1a1408";
          ctx.fillRect(sx - 30, horizon - 90, 60, 90);
          // Books
          const colors = ["#5a1a1a", "#1a3a5a", "#5a5a1a", "#3a1a3a"];
          for (let i = 0; i < 6; i++) {
            ctx.fillStyle = colors[i % 4];
            ctx.fillRect(sx - 25, horizon - 85 + i * 13, 50, 10);
          }
        });
        // Safe
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(cx + 100, h * 0.55, 40, 50);
        ctx.fillStyle = "#c9a35a";
        ctx.beginPath();
        ctx.arc(cx + 120, h * 0.7, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (currentRoom === "lobby") {
        // Reception desk
        ctx.fillStyle = "#2a2018";
        ctx.fillRect(cx - 50, h * 0.6, 100, 30);
        ctx.fillStyle = "#3a3028";
        ctx.fillRect(cx - 50, h * 0.6, 100, 5);
        // Welcome sign
        ctx.fillStyle = `${room.accent}40`;
        ctx.fillRect(cx - 40, horizon - 50, 80, 25);
      }

      ctx.restore();

      // Dust particles
      for (let i = 0; i < 20; i++) {
        const px = ((i * 73 + t * 20) % w);
        const py = ((i * 37 + t * 15) % h);
        const alpha = (Math.sin(t + i) + 1) * 0.15;
        ctx.fillStyle = `${room.accent}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Character silhouettes
      roomSuspects.forEach((s, i) => {
        const sx = cx + (i - roomSuspects.length / 2 + 0.5) * 120;
        const sy = h * 0.62;
        const breathe = Math.sin(t * 1.5 + i) * 2;

        // Glow
        const glowGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 60);
        glowGrad.addColorStop(0, `${s.color}30`);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(sx - 60, sy - 60, 120, 120);

        // Body
        ctx.fillStyle = s.color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.ellipse(sx, sy + breathe, 12, 35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(sx, sy - 35 + breathe, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Label
        ctx.fillStyle = s.color;
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(s.name.split(" ")[0], sx, sy + 55);
      });

      // Clue orbs
      roomClues.forEach((clue) => {
        const examined = examinedClues.has(clue.id);
        const ox = (clue.x / 100) * w;
        const oy = (clue.y / 100) * h;
        const pulse = 1 + Math.sin(t * 3) * 0.15;
        const float = Math.sin(t * 2) * 5;

        // Glow
        const orbGrad = ctx.createRadialGradient(ox, oy + float, 0, ox, oy + float, 30 * pulse);
        orbGrad.addColorStop(0, examined ? "rgba(0, 255, 100, 0.4)" : "rgba(255, 200, 50, 0.5)");
        orbGrad.addColorStop(1, "transparent");
        ctx.fillStyle = orbGrad;
        ctx.fillRect(ox - 30, oy - 30 + float, 60, 60);

        // Orb
        ctx.fillStyle = examined ? "#00ff66" : "#ffc832";
        ctx.beginPath();
        ctx.arc(ox, oy + float, 8 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Ring
        ctx.strokeStyle = examined ? "#00ff6650" : "#ffc83250";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ox, oy + float, 15 * pulse, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Vignette
      const vigGrad = ctx.createRadialGradient(cx, cy, h * 0.3, cx, cy, h * 0.8);
      vigGrad.addColorStop(0, "transparent");
      vigGrad.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, w, h);

      animFrame.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animFrame.current);
      window.removeEventListener("resize", resize);
    };
  }, [currentRoom, room, roomSuspects, roomClues, examinedClues]);

  // Click handler
  const onCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Check clue clicks
    roomClues.forEach((clue) => {
      const dx = x - clue.x;
      const dy = y - clue.y;
      if (Math.sqrt(dx * dx + dy * dy) < 8) {
        setCluePopup({ label: clue.label, detail: clue.detail });
        setExaminedClues((prev) => new Set(prev).add(clue.id));
      }
    });
  }, [roomClues]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden select-none">
      {/* Canvas — pseudo-3D room */}
      <canvas
        ref={canvasRef}
        onClick={onCanvasClick}
        className="w-full h-full block cursor-pointer"
        style={{ touchAction: "manipulation" }}
      />

      {/* Top HUD */}
      <div className="absolute top-0 inset-x-0 p-3 flex items-center justify-between pointer-events-none z-30">
        <div className="px-3 py-1.5 bg-black/70 backdrop-blur border border-amber-600/30 rounded-lg">
          <p className="font-mono text-sm font-bold text-amber-400">
            📍 {room.icon} {room.name}
          </p>
        </div>
        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={() => setShowMap(true)}
            className="px-3 py-1.5 bg-black/70 backdrop-blur border border-amber-600/30 rounded-lg hover:border-amber-500 transition-colors"
          >
            <span className="font-mono text-xs text-amber-400">🗺️ MAP</span>
          </button>
          <button
            onClick={() => setShowNotebook(true)}
            className="px-3 py-1.5 bg-black/70 backdrop-blur border border-amber-600/30 rounded-lg hover:border-amber-500 transition-colors"
          >
            <span className="font-mono text-xs text-amber-400">📓 {examinedClues.size}/8</span>
          </button>
        </div>
      </div>

      {/* Room description */}
      <div className="absolute bottom-20 inset-x-0 text-center pointer-events-none z-20">
        <p className="font-mono text-xs text-white/50 max-w-md mx-auto px-4">
          {room.desc}
        </p>
      </div>

      {/* Suspect interaction buttons */}
      {roomSuspects.length > 0 && (
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-30">
          {roomSuspects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSuspectPopup(s)}
              className="px-3 py-2 bg-black/70 backdrop-blur border rounded-lg hover:scale-105 transition-transform"
              style={{ borderColor: s.color }}
            >
              <span className="font-mono text-xs font-bold" style={{ color: s.color }}>
                {s.name.split(" ")[0]}
              </span>
              {interrogated.has(s.id) && (
                <span className="ml-1 text-green-400 text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Clue popup */}
      {cluePopup && (
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-40">
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
            <div className="relative h-48 overflow-hidden">
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
                {suspectPopup.codename} · {suspectPopup.role}
              </p>
              <h3 className="font-mono text-lg font-black text-white">
                {suspectPopup.name}
              </h3>
              <p className="font-mono text-xs text-white/60 italic mt-2">
                &ldquo;{suspectPopup.quote}&rdquo;
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

      {/* Map overlay */}
      {showMap && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <h2 className="font-mono text-lg font-bold text-amber-400 mb-4 text-center">
              🗺️ PETA THEATER
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {ROOMS.map((r) => {
                const isActive = r.id === currentRoom;
                const suspectsInRoom = SUSPECTS.filter((s) => s.room === r.id);
                const cluesInRoom = CLUES.filter((c) => c.room === r.id);
                const examinedInRoom = cluesInRoom.filter((c) => examinedClues.has(c.id)).length;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setCurrentRoom(r.id);
                      setShowMap(false);
                    }}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      isActive
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-gray-700 hover:border-amber-600/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{r.icon}</span>
                      <span className={`font-mono text-xs font-bold ${isActive ? "text-amber-400" : "text-white/70"}`}>
                        {r.name}
                      </span>
                    </div>
                    <div className="flex gap-2 text-[10px] font-mono text-white/40">
                      <span>🧍{suspectsInRoom.length}</span>
                      <span>🔍{examinedInRoom}/{cluesInRoom.length}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowMap(false)}
              className="mt-4 w-full py-2 font-mono text-xs text-white/60 hover:text-white border border-gray-700 rounded"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Notebook overlay */}
      {showNotebook && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-900 border border-amber-600/30 rounded-lg p-4">
            <h2 className="font-mono text-lg font-bold text-amber-400 mb-3">
              📓 BUKU CATATAN
            </h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {CLUES.map((clue) => {
                const examined = examinedClues.has(clue.id);
                const roomName = ROOMS.find((r) => r.id === clue.room)?.name;
                return (
                  <div
                    key={clue.id}
                    className={`p-2 border rounded ${examined ? "border-green-600/40 bg-green-900/10" : "border-gray-700 opacity-40"}`}
                  >
                    <p className="font-mono text-xs font-bold text-amber-400">
                      {examined ? `✓ ${clue.label}` : "🔒 ???"}
                    </p>
                    {examined && (
                      <p className="font-mono text-[10px] text-white/60 mt-1">
                        {clue.detail}
                      </p>
                    )}
                    <p className="font-mono text-[9px] text-white/30 mt-1">
                      📍 {roomName}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="font-mono text-xs text-white/60">
                Tersangka diinterogasi: {interrogated.size}/8
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {SUSPECTS.map((s) => (
                  <span
                    key={s.id}
                    className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${interrogated.has(s.id) ? "text-green-400" : "text-white/30"}`}
                    style={{ background: interrogated.has(s.id) ? `${s.color}20` : "transparent" }}
                  >
                    {s.name.split(" ")[0]}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowNotebook(false)}
              className="mt-3 w-full py-2 font-mono text-xs text-white/60 hover:text-white border border-gray-700 rounded"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
