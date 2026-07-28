"use client";

import { useEffect, useState } from "react";

export default function SiteFooter() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative mt-auto border-t border-noir-coffee/60 bg-noir-ink/95 backdrop-blur">
      {/* top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-noir-crimson/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-noir-crimson animate-pulse" />
              <span className="font-stamp text-sm tracking-[0.3em] text-noir-brass uppercase">
                Teatro del Misteri
              </span>
            </div>
            <p className="font-typewriter text-[11px] text-noir-paper/50 leading-relaxed max-w-xs">
              Game misteri pembunuhan interaktif. Setiap keputusan membuka
              cabang cerita baru. Identitas tersangka berubah setiap musim.
            </p>
          </div>

          {/* nav */}
          <div>
            <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-paper/40 uppercase mb-3">
              Navigasi Kasus
            </p>
            <ul className="space-y-2 font-typewriter text-xs">
              <li>
                <a
                  href="#hero"
                  className="text-noir-paper/70 hover:text-noir-brass transition-colors"
                >
                  → Ruang Detektif
                </a>
              </li>
              <li>
                <a
                  href="#berkas"
                  className="text-noir-paper/70 hover:text-noir-brass transition-colors"
                >
                  → Berkas Kasus
                </a>
              </li>
              <li>
                <a
                  href="#papan"
                  className="text-noir-paper/70 hover:text-noir-brass transition-colors"
                >
                  → Papan Benang Merah
                </a>
              </li>
              <li>
                <a
                  href="#bukti"
                  className="text-noir-paper/70 hover:text-noir-brass transition-colors"
                >
                  → Loker Bukti
                </a>
              </li>
              <li>
                <a
                  href="#tuduhan"
                  className="text-noir-paper/70 hover:text-noir-brass transition-colors"
                >
                  → Tuduhan Akhir
                </a>
              </li>
              <li>
                <a
                  href="#stamp"
                  className="text-noir-paper/70 hover:text-noir-brass transition-colors"
                >
                  → Bergabung dalam Game
                </a>
              </li>
            </ul>
          </div>

          {/* status panel */}
          <div>
            <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-paper/40 uppercase mb-3">
              Status Penyelidikan
            </p>
            <div className="paper-texture paper-edge rounded-sm p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-typewriter text-[10px] text-noir-paper-ink/70">
                  Kasus Aktif
                </span>
                <span className="font-stamp text-[10px] text-noir-crimson font-bold">
                  JKT-48-001
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-typewriter text-[10px] text-noir-paper-ink/70">
                  Tersangka
                </span>
                <span className="font-stamp text-[10px] text-noir-paper-ink font-bold">
                  04 / 04
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-typewriter text-[10px] text-noir-paper-ink/70">
                  Jam Teater
                </span>
                <span className="font-typewriter text-[10px] text-noir-paper-ink font-mono">
                  {time} WIB
                </span>
              </div>
              <div className="h-1.5 bg-noir-paper-ink/10 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-noir-crimson to-noir-brass" />
              </div>
              <p className="font-typewriter text-[9px] text-noir-paper-ink/50 mt-1.5">
                Penyelidikan 67% selesai
              </p>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-8 pt-6 border-t border-noir-coffee/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-typewriter text-[10px] text-noir-paper/40">
            © {new Date().getFullYear()} Teatro del Misteri · Karakter fiksi
            untuk permainan.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-typewriter text-[10px] text-noir-paper/40">
              Dibuat dengan
            </span>
            <span className="font-stamp text-[10px] tracking-widest text-noir-crimson">
              NEXT.JS · THREE.JS · WEB AUDIO
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
