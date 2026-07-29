"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  playPaperRustle,
  playStampSlam,
  playLampBuzz,
  playDrawer,
  playClick,
  unlockAudio,
} from "@/lib/audio";

interface SfxItem {
  id: string;
  name: string;
  glyph: string;
  description: string;
  play: () => void;
}

const SFX_ITEMS: SfxItem[] = [
  {
    id: "paper",
    name: "Gemerisik Kertas",
    glyph: "📄",
    description: "Suara kertas dibalik dan dikumpulkan.",
    play: () => playPaperRustle(0.85, 0.7),
  },
  {
    id: "stamp",
    name: "Hantaman Cap",
    glyph: "🔨",
    description: "Cap besar dihantam ke kertas.",
    play: () => playStampSlam(),
  },
  {
    id: "lamp",
    name: "Dengung Lampu",
    glyph: "💡",
    description: "Listrik mendengung saat lampu berkedip.",
    play: () => playLampBuzz(),
  },
  {
    id: "drawer",
    name: "Laci Geser",
    glyph: "🗄️",
    description: "Laci kayu ditarik keluar.",
    play: () => playDrawer(),
  },
  {
    id: "click",
    name: "Klik Tombol",
    glyph: "🔘",
    description: "Klik mekanis pendek.",
    play: () => playClick(),
  },
  {
    id: "rustle-soft",
    name: "Kertas Lembut",
    glyph: "✉️",
    description: "Gemerisik kertas halus, singkat.",
    play: () => playPaperRustle(0.4, 0.4),
  },
];

/**
 * Soundboard — lets users preview all synthesized SFX.
 * Accessible via a floating button (bottom area, above hint bulb).
 * Useful for testing audio and enjoying the sound design.
 */
export default function Soundboard() {
  const [open, setOpen] = useState(false);

  const handlePlay = (item: SfxItem) => {
    unlockAudio();
    item.play();
  };

  return (
    <>
      {/* floating trigger */}
      <button
        type="button"
        onClick={() => {
          unlockAudio();
          playClick();
          setOpen(true);
        }}
        data-cursor-active
        aria-label="Buka soundboard"
        className="fixed safe-bottom-lg safe-right z-[78] w-11 h-11 rounded-full bg-noir-coal/90 border border-noir-brass/40 backdrop-blur flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.8)] hover:border-noir-brass transition-colors"
      >
        <span className="text-lg">🔊</span>
      </button>

      {/* modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[99] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              playClick();
              setOpen(false);
            }}
          >
            <div className="absolute inset-0 bg-noir-ink/95 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative paper-texture paper-edge paper-burn rounded-sm max-w-lg w-full p-6"
            >
              {/* close */}
              <button
                onClick={() => {
                  playClick();
                  setOpen(false);
                }}
                data-cursor-active
                aria-label="Tutup"
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-noir-paper-ink/60 hover:text-noir-crimson transition-colors font-stamp text-lg"
              >
                ✕
              </button>

              {/* header */}
              <div className="text-center mb-5">
                <span className="text-4xl">🔊</span>
                <h3 className="font-stamp text-2xl font-black text-noir-paper-ink mt-2">
                  SOUND BOARD
                </h3>
                <p className="font-typewriter text-[11px] text-noir-paper-ink/60 mt-1">
                  Pratinjau efek suara yang disintesis via Web Audio API
                </p>
              </div>

              {/* sfx grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SFX_ITEMS.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handlePlay(item)}
                    data-cursor-active
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="group p-3 border-2 border-noir-paper-ink/20 hover:border-noir-brass bg-noir-paper/30 hover:bg-noir-brass/10 transition-colors text-center"
                  >
                    <div className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">
                      {item.glyph}
                    </div>
                    <p className="font-stamp text-[11px] font-bold text-noir-paper-ink leading-tight">
                      {item.name}
                    </p>
                    <p className="font-typewriter text-[8px] text-noir-paper-ink/50 mt-0.5 leading-tight">
                      {item.description}
                    </p>
                    <p className="font-stamp text-[8px] tracking-widest text-noir-brass mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      ▸ PUTAR
                    </p>
                  </motion.button>
                ))}
              </div>

              {/* footer */}
              <div className="mt-5 pt-4 border-t border-noir-paper-ink/20 text-center">
                <p className="font-typewriter text-[10px] text-noir-paper-ink/50 italic">
                  Semua suara dibuat secara real-time — tanpa file audio eksternal.
                </p>
                <button
                  onClick={() => {
                    playClick();
                    setOpen(false);
                  }}
                  data-cursor-active
                  className="mt-3 font-stamp text-[11px] tracking-widest uppercase text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-colors px-4 py-2"
                >
                  Tutup →
                </button>
              </div>

              {/* corner stamp */}
              <div className="absolute top-3 left-3 font-stamp text-[8px] tracking-widest text-noir-crimson/60 -rotate-6 border border-noir-crimson/40 px-1.5 py-0.5">
                AUDIO
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
