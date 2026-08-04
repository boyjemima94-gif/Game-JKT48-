"use client";

import dynamic from "next/dynamic";

const ImmersiveGame = dynamic(() => import("@/components/game/immersive-game"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-pulse">🎭</div>
        <p className="font-mono text-sm text-amber-400 tracking-wider">
          MEMUAT MISTERI THEATER BERDARAH...
        </p>
        <div className="mt-4 w-48 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-amber-500 animate-pulse" style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
  return <ImmersiveGame />;
}
