"use client";

import { useState, useEffect, useRef } from "react";
import { unlockAudio, startRoomTone, playClick } from "@/lib/audio";

/**
 * Floating audio toggle (bottom-left).
 * Lets the user mute/unmute ambient room tone + SFX.
 * Persists choice in localStorage.
 */
export default function AudioToggle() {
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let initial = false;
    try {
      initial = localStorage.getItem("misteri theater-muted") === "1";
    } catch {
      /* noop */
    }
    const raf = requestAnimationFrame(() => {
      setMuted(initial);
      setReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (muted) {
      stopRef.current?.();
      stopRef.current = null;
    } else {
      // only start if user has interacted (audio unlocked)
      try {
        if (sessionStorage.getItem("misteri theater-onboarded") === "1") {
          unlockAudio();
          if (!stopRef.current) {
            stopRef.current = startRoomTone();
          }
        }
      } catch {
        /* noop */
      }
    }
    try {
      localStorage.setItem("misteri theater-muted", muted ? "1" : "0");
    } catch {
      /* noop */
    }
  }, [muted, ready]);

  // start room tone when onboarding dismissed
  useEffect(() => {
    const check = () => {
      try {
        if (
          sessionStorage.getItem("misteri theater-onboarded") === "1" &&
          !muted &&
          !stopRef.current
        ) {
          unlockAudio();
          stopRef.current = startRoomTone();
        }
      } catch {
        /* noop */
      }
    };
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [muted]);

  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={() => {
        playClick();
        setMuted((m) => !m);
      }}
      data-cursor-active
      aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
      className="fixed safe-bottom safe-left z-[80] w-11 h-11 rounded-full bg-noir-coal/90 border border-noir-brass/40 backdrop-blur flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.8)] hover:border-noir-brass transition-colors group"
    >
      {muted ? (
        // muted icon
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-noir-paper/60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        // sound on icon (with animated bars)
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-noir-brass"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
      {/* pulsing ring when active */}
      {!muted && (
        <span className="absolute inset-0 rounded-full border border-noir-brass/40 animate-ping opacity-50" />
      )}
    </button>
  );
}
