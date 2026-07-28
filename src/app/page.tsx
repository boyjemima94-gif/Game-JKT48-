"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/game/hero-section";
import BriefingSection from "@/components/game/briefing-section";
import CaseFileSection from "@/components/game/case-file-section";
import ConspiracyBoard from "@/components/game/conspiracy-board";
import VictimProfile from "@/components/game/victim-profile";
import EvidenceLocker from "@/components/game/evidence-locker";
import TimelineSection from "@/components/game/timeline-section";
import AccusationFinale from "@/components/game/accusation-finale";
import StampCta from "@/components/game/stamp-cta";
import SiteFooter from "@/components/game/site-footer";
import Onboarding from "@/components/game/onboarding";
import AudioToggle from "@/components/game/audio-toggle";
import SectionDivider from "@/components/game/section-divider";

// Magnifier cursor — client only, no SSR.
const MagnifierCursor = dynamic(
  () => import("@/components/game/magnifier-cursor"),
  { ssr: false }
);
const AtmosphereOverlay = dynamic(
  () => import("@/components/game/atmosphere-overlay"),
  { ssr: false }
);
const AmbientBeams = dynamic(
  () => import("@/components/game/ambient-beams"),
  { ssr: false }
);
const DetectiveNotebook = dynamic(
  () => import("@/components/game/detective-notebook"),
  { ssr: false }
);
const ProgressHud = dynamic(
  () => import("@/components/game/progress-hud"),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-noir-ink film-grain scene-vignette">
      <AmbientBeams />
      <MagnifierCursor />
      <AtmosphereOverlay />
      <ProgressHud />
      <Onboarding />
      <AudioToggle />
      <DetectiveNotebook />

      <main className="relative z-10 flex-1">
        <HeroSection />
        <BriefingSection />
        <SectionDivider variant="file" label="Arsip Kasus" />
        <CaseFileSection />
        <SectionDivider variant="thread" label="Jaring Tersangka" />
        <ConspiracyBoard />
        <SectionDivider variant="stamp" label="Korban" />
        <VictimProfile />
        <SectionDivider variant="evidence" label="Forensik" />
        <EvidenceLocker />
        <SectionDivider variant="thread" label="Kronologi" />
        <TimelineSection />
        <SectionDivider variant="stamp" label="Putusan" />
        <AccusationFinale />
        <StampCta />
      </main>

      <SiteFooter />
    </div>
  );
}
