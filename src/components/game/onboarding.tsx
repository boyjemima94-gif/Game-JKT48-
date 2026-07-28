"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { unlockAudio, startRoomTone, playClick } from "@/lib/audio";

/**
 * Brief onboarding overlay shown on first load.
 * Explains the magnifier cursor and core interactions,
 * unlocks Web Audio on the first click, and starts ambient room tone.
 */
export default function Onboarding() {
  const [show, setShow] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // don't show again if already seen this session
    let raf = 0;
    try {
      if (sessionStorage.getItem("teatro-onboarded") === "1") {
        raf = requestAnimationFrame(() => setShow(false));
      }
    } catch {
      /* noop */
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const dismiss = () => {
    unlockAudio();
    startRoomTone();
    playClick();
    try {
      sessionStorage.setItem("teatro-onboarded", "1");
    } catch {
      /* noop */
    }
    setShow(false);
  };

  const steps = [
    {
      title: "Selamat datang, Detektif",
      body: "Sebuah kejahatan terjadi di teater. Empat bintang panggung menjadi tersangka. Hanya kau yang bisa mengungkap kebenaran.",
      cta: "Lanjut",
    },
    {
      title: "Kaca Pembesar",
      body: "Kursormu kini adalah kaca pembesar — geser untuk memeriksa setiap detail. Arahkan ke elemen interaktif untuk memperbesar.",
      cta: "Mengerti",
    },
    {
      title: "Cara Selidiki",
      body: "Balik berkas kasus untuk membaca kronologi. Klik tersangka di papan benang merah untuk membuka dosir. Tekan cap untuk bergabung.",
      cta: "Mulai",
    },
  ];

  const current = steps[step];

  const next = () => {
    playClick();
    if (step < steps.length - 1) setStep((s) => s + 1);
    else dismiss();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="absolute inset-0 bg-noir-ink/90 backdrop-blur-sm"
            onClick={dismiss}
          />
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative paper-texture paper-edge paper-burn rounded-sm max-w-md w-full p-8 text-center"
          >
            {/* progress dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step
                      ? "w-8 bg-noir-crimson"
                      : i < step
                      ? "w-4 bg-noir-crimson/50"
                      : "w-4 bg-noir-paper-ink/20"
                  }`}
                />
              ))}
            </div>

            <h2 className="font-stamp text-2xl font-black text-noir-paper-ink mb-3">
              {current.title}
            </h2>
            <p className="font-typewriter text-sm text-noir-paper-ink/80 leading-relaxed mb-6">
              {current.body}
            </p>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={dismiss}
                data-cursor-active
                className="font-typewriter text-[11px] text-noir-paper-ink/50 hover:text-noir-paper-ink/80 transition-colors"
              >
                lewati
              </button>
              <button
                onClick={next}
                data-cursor-active
                className="px-6 py-2.5 font-stamp text-xs tracking-[0.2em] uppercase text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-colors shadow-md"
              >
                {current.cta} →
              </button>
            </div>

            {/* decorative corner stamps */}
            <div className="absolute top-3 right-3 font-stamp text-[8px] tracking-widest text-noir-crimson/60 -rotate-12 border border-noir-crimson/40 px-1.5 py-0.5">
              KONFIDENSIAL
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
