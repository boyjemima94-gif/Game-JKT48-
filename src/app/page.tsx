"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/game/hero-section";
import BriefingSection from "@/components/game/briefing-section";
import CaseFileSection from "@/components/game/case-file-section";
import ConspiracyBoard from "@/components/game/conspiracy-board";
import StampCta from "@/components/game/stamp-cta";
import SiteFooter from "@/components/game/site-footer";
import Onboarding from "@/components/game/onboarding";
import AudioToggle from "@/components/game/audio-toggle";

// Magnifier cursor — client only, no SSR.
const MagnifierCursor = dynamic(
  () => import("@/components/game/magnifier-cursor"),
  { ssr: false }
);
const AtmosphereOverlay = dynamic(
  () => import("@/components/game/atmosphere-overlay"),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-noir-ink film-grain scene-vignette">
      <MagnifierCursor />
      <AtmosphereOverlay />
      <Onboarding />
      <AudioToggle />

      <main className="flex-1">
        <HeroSection />
        <BriefingSection />
        <CaseFileSection />
        <ConspiracyBoard />
        <StampCta />
      </main>

      <SiteFooter />
    </div>
  );
}
