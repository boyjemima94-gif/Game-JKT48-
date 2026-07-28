"use client";

/**
 * Persistent atmospheric overlays:
 * - film grain
 * - vignette
 * - subtle scanline drift
 * - floating smoke wisps at section borders
 *
 * All purely decorative; pointer-events: none.
 */
export default function AtmosphereOverlay() {
  return (
    <>
      <div className="film-grain" aria-hidden="true" />
      <div className="scene-vignette" aria-hidden="true" />

      {/* drifting smoke wisps (decorative) */}
      <div
        className="fixed inset-x-0 bottom-0 h-40 pointer-events-none z-30"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(10,8,7,0.4) 60%, rgba(10,8,7,0.8) 100%)",
        }}
      />
    </>
  );
}
