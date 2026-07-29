"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Magnifying-glass cursor.
 *
 * Visual: brass ring + handle + specular highlight, follows mouse with slight lag.
 * Real magnification: clones the live DOM under the cursor into the lens and scales it,
 * giving a genuine "kaca pembesar" zoom. Falls back gracefully on touch devices.
 *
 * State: idle / hover (interactive elements) / clicking.
 */
export default function MagnifierCursor() {
  const lensRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Skip on touch / coarse pointers — no mouse cursor there.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    const showRaf = requestAnimationFrame(() => setVisible(true));
    // Add body class so CSS only hides native cursor when magnifier is live.
    document.body.classList.add("magnifier-active");
    const lens = lensRef.current!;
    const content = contentRef.current!;
    const ZOOM = 1.9;
    const LENS = 140; // base diameter px

    // The clone root — we mirror the <body> into it.
    const cloneRoot = document.createElement("div");
    cloneRoot.style.cssText =
      "position:absolute; left:0; top:0; transform-origin:0 0; pointer-events:none;";
    content.appendChild(cloneRoot);

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;

    const loop = () => {
      // ease for a slight "weight" feel
      cx += (tx - cx) * 0.35;
      cy += (ty - cy) * 0.35;
      lens.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = 0;
    };

    const refreshClone = () => {
      // Copy body children into the clone root (throttled externally).
      cloneRoot.innerHTML = "";
      const body = document.body;
      const rect = body.getBoundingClientRect();
      const wrap = document.createElement("div");
      wrap.style.cssText = `position:absolute; width:${rect.width}px; height:${rect.height}px; left:${-rect.left}px; top:${-rect.top}px; transform: scale(${ZOOM}); transform-origin: 0 0;`;
      for (let i = 0; i < body.children.length; i++) {
        const node = body.children[i];
        if (node === lens || node.contains(lens)) continue;
        try {
          const cl = node.cloneNode(true) as HTMLElement;
          cl.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
          // Remove scripts to avoid re-execution
          cl.querySelectorAll("script").forEach((s) => s.remove());
          wrap.appendChild(cl);
        } catch {
          /* noop */
        }
      }
      cloneRoot.appendChild(wrap);
    };

    const positionClone = () => {
      const rect = document.body.getBoundingClientRect();
      const dx = LENS / 2 - (cx - rect.left) * ZOOM;
      const dy = LENS / 2 - (cy - rect.top) * ZOOM;
      cloneRoot.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    let cloneTimer = 0;
    const scheduleRefresh = () => {
      if (cloneTimer) return;
      cloneTimer = window.setTimeout(() => {
        refreshClone();
        positionClone();
        cloneTimer = 0;
      }, 160);
    };

    const onMoveAll = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
      positionClone();
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.closest("a") ||
          t.closest("button") ||
          t.closest('[role="button"]') ||
          t.closest("[data-cursor-active]"))
      ) {
        if (!active) setActive(true);
      } else {
        if (active) setActive(false);
      }
      scheduleRefresh();
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    refreshClone();
    positionClone();

    window.addEventListener("mousemove", onMoveAll, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("resize", () => {
      refreshClone();
      positionClone();
    });
    window.addEventListener(
      "scroll",
      () => {
        positionClone();
        scheduleRefresh();
      },
      { passive: true }
    );

    return () => {
      window.removeEventListener("mousemove", onMoveAll);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.body.classList.remove("magnifier-active");
      if (showRaf) cancelAnimationFrame(showRaf);
      if (raf) cancelAnimationFrame(raf);
      if (cloneTimer) clearTimeout(cloneTimer);
    };
  }, [active]);

  if (!visible) return null;

  return (
    <div
      ref={lensRef}
      className={`magnifier-cursor ${active ? "is-active" : ""} ${
        clicking ? "is-clicking" : ""
      }`}
      aria-hidden="true"
    >
      <div ref={contentRef} className="magnifier-lens-content" />
      {/* reticle */}
      <svg
        viewBox="0 0 140 140"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        <circle cx="70" cy="70" r="3" fill="rgba(255,203,122,0.9)" />
        <line x1="70" y1="20" x2="70" y2="40" stroke="rgba(201,163,90,0.6)" strokeWidth="1" />
        <line x1="70" y1="100" x2="70" y2="120" stroke="rgba(201,163,90,0.6)" strokeWidth="1" />
        <line x1="20" y1="70" x2="40" y2="70" stroke="rgba(201,163,90,0.6)" strokeWidth="1" />
        <line x1="100" y1="70" x2="120" y2="70" stroke="rgba(201,163,90,0.6)" strokeWidth="1" />
      </svg>
    </div>
  );
}
