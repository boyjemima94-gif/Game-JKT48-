"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * OfflineDetector — shows overlay when network is lost.
 * Pauses animations via CSS class on body.
 */
export default function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      document.body.classList.remove("offline-paused");
    };
    const handleOffline = () => {
      setIsOffline(true);
      document.body.classList.add("offline-paused");
    };

    // Initial check
    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-noir-ink/95 backdrop-blur-sm"
        >
          <div className="text-center p-8">
            <div className="text-5xl mb-4">📡</div>
            <h2 className="font-stamp text-2xl font-black text-noir-crimson mb-2">
              KONEKSI TERPUTUS
            </h2>
            <p className="font-typewriter text-sm text-noir-paper/60 max-w-xs">
              Game dijeda. Periksa koneksi internet Anda. Game akan
              melanjutkan otomatis saat koneksi kembali.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-noir-crimson animate-pulse" />
              <span className="font-typewriter text-xs text-noir-paper/40 tracking-widest">
                MENUNGGU KONEKSI...
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
