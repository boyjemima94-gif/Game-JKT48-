"use client";

import dynamic from "next/dynamic";

const ImmersiveGame = dynamic(() => import("@/components/game/immersive-game"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-pulse">🎭</div>
        <p className="font-mono text-sm text-amber-400">MEMUAT MISTERI THEATER BERDARAH...</p>
      </div>
    </div>
  ),
});

export default function GameWrapper() {
  return <ImmersiveGame />;
}
