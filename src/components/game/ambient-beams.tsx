"use client";

import { useEffect, useState } from "react";

/**
 * Subtle animated light beam that drifts across section backgrounds.
 * Purely decorative, pointer-events-none.
 * Renders a few slow-moving radial gradients to add atmosphere.
 */
export default function AmbientBeams() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {/* drifting warm beam */}
      <div
        className="absolute -top-1/4 left-0 w-[60vw] h-[120vh] opacity-[0.04]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,179,71,0.8) 0%, rgba(255,179,71,0) 70%)",
          transform: "rotate(15deg)",
          animation: "beam-drift-a 28s ease-in-out infinite alternate",
        }}
      />
      {/* drifting crimson beam */}
      <div
        className="absolute top-0 right-0 w-[40vw] h-[100vh] opacity-[0.03]"
        style={{
          background:
            "linear-gradient(180deg, rgba(192,57,43,0.8) 0%, rgba(192,57,43,0) 60%)",
          transform: "rotate(-12deg)",
          animation: "beam-drift-b 34s ease-in-out infinite alternate",
        }}
      />
      {/* slow pulsing center glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50vw] h-[50vw] opacity-[0.025] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,203,122,0.6) 0%, transparent 60%)",
          animation: "beam-pulse 12s ease-in-out infinite",
        }}
      />
    </div>
  );
}
