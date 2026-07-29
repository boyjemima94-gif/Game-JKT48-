"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClick } from "@/lib/audio";

interface NavItem {
  id: string;
  label: string;
  glyph: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Atas", glyph: "↑" },
  { id: "mode", label: "Mode", glyph: "🎮" },
  { id: "tantangan-harian", label: "Harian", glyph: "🎲" },
  { id: "berkas", label: "Berkas", glyph: "📁" },
  { id: "papan", label: "Benang Merah", glyph: "🧵" },
  { id: "banding", label: "Banding", glyph: "⚖" },
  { id: "tokoh", label: "Tokoh", glyph: "🎭" },
  { id: "korban", label: "Korban", glyph: "📇" },
  { id: "bukti", label: "Bukti", glyph: "🔍" },
  { id: "lokasi-3d", label: "TKP 3D", glyph: "🏛️" },
  { id: "ikatan", label: "Ikatan", glyph: "🤝" },
  { id: "linimasa", label: "Linimasa", glyph: "🕐" },
  { id: "tuduhan", label: "Tuduhan", glyph: "⚖" },
  { id: "arsip", label: "Arsip", glyph: "📋" },
  { id: "pencapaian", label: "Pencapaian", glyph: "🏆" },
  { id: "loran", label: "Latar Cerita", glyph: "📚" },
  { id: "kredit", label: "Tentang", glyph: "ℹ️" },
  { id: "stamp", label: "Bergabung", glyph: "🔨" },
];

/**
 * Quick Nav — compact floating menu for jumping to any section.
 * Appears as a small ☰ button; expands to a vertical list of section links.
 * Especially useful given the page is now 14+ sections long.
 */
export default function QuickNav() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jumpTo = (id: string) => {
    playClick();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* floating trigger */}
      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            onClick={() => {
              playClick();
              setOpen((o) => !o);
            }}
            data-cursor-active
            aria-label={open ? "Tutup navigasi cepat" : "Buka navigasi cepat"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed safe-top safe-left z-[80] w-11 h-11 rounded-full bg-noir-coal/90 border border-noir-brass/40 backdrop-blur flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.8)] hover:border-noir-brass transition-colors"
          >
            <motion.span
              animate={{ rotate: open ? 90 : 0 }}
              className="text-lg text-noir-brass font-stamp"
            >
              {open ? "✕" : "☰"}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* nav panel */}
      <AnimatePresence>
        {open && visible && (
          <motion.div
            initial={{ opacity: 0, x: -20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-3 z-[81] w-56 max-h-[80vh] overflow-y-auto bg-noir-coal/95 backdrop-blur border border-noir-brass/40 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.9)] mt-2"
          >
            {/* header */}
            <div className="px-3 py-2 border-b border-noir-umber/50 bg-noir-coffee/40">
              <p className="font-stamp text-[10px] tracking-[0.3em] text-noir-brass uppercase font-bold">
                Navigasi Cepat
              </p>
            </div>
            {/* items */}
            <div className="p-1.5 space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => jumpTo(item.id)}
                  data-cursor-active
                  className="group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm hover:bg-noir-brass/10 transition-colors text-left"
                >
                  <span className="text-base shrink-0 group-hover:scale-110 transition-transform">
                    {item.glyph}
                  </span>
                  <span className="font-stamp text-[11px] tracking-wider text-noir-paper/70 group-hover:text-noir-brass transition-colors uppercase">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
            {/* footer */}
            <div className="px-3 py-2 border-t border-noir-umber/50 bg-noir-coffee/40">
              <p className="font-typewriter text-[8px] text-noir-paper/30 tracking-widest uppercase">
                Teatro del Misteri
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
