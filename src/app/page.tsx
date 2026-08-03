"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/game/hero-section";
import CaseIntro from "@/components/game/case-intro";
import DifficultySelect from "@/components/game/difficulty-select";
import BriefingSection from "@/components/game/briefing-section";
import CaseFileSection from "@/components/game/case-file-section";
import ConspiracyBoard from "@/components/game/conspiracy-board";
import CastList from "@/components/game/cast-list";
import VictimProfile from "@/components/game/victim-profile";
import EvidenceLocker from "@/components/game/evidence-locker";
import TimelineSection from "@/components/game/timeline-section";
import AccusationFinale from "@/components/game/accusation-finale";
import DetectiveScore from "@/components/game/detective-score";
import CaseArchive from "@/components/game/case-archive";
import AchievementsGallery from "@/components/game/achievements-gallery";
import LoreSection from "@/components/game/lore-section";
import CreditsSection from "@/components/game/credits-section";
import DailyChallengeSection from "@/components/game/daily-challenge-section";
import SuspectComparison from "@/components/game/suspect-comparison";
import LocationExplorer from "@/components/game/three/location-explorer";
import PersonalBond from "@/components/game/personal-bond";
import StampCta from "@/components/game/stamp-cta";
import SiteFooter from "@/components/game/site-footer";
import Onboarding from "@/components/game/onboarding";
import AudioToggle from "@/components/game/audio-toggle";
import SectionDivider from "@/components/game/section-divider";

// Client-only components — with loading fallbacks for SSR
const MagnifierCursor = dynamic(
  () => import("@/components/game/magnifier-cursor"),
  { ssr: false, loading: () => null }
);
const AtmosphereOverlay = dynamic(
  () => import("@/components/game/atmosphere-overlay"),
  { ssr: false, loading: () => null }
);
const AmbientBeams = dynamic(
  () => import("@/components/game/ambient-beams"),
  { ssr: false, loading: () => null }
);
const DetectiveNotebook = dynamic(
  () => import("@/components/game/detective-notebook"),
  { ssr: false, loading: () => null }
);
const ProgressHud = dynamic(
  () => import("@/components/game/progress-hud"),
  { ssr: false, loading: () => null }
);
const KeyboardHelp = dynamic(
  () => import("@/components/game/keyboard-help"),
  { ssr: false, loading: () => null }
);
const HintSystem = dynamic(
  () => import("@/components/game/hint-system"),
  { ssr: false, loading: () => null }
);
const Soundboard = dynamic(
  () => import("@/components/game/soundboard"),
  { ssr: false, loading: () => null }
);
const QuickNav = dynamic(
  () => import("@/components/game/quick-nav"),
  { ssr: false, loading: () => null }
);

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-noir-ink film-grain scene-vignette">
      <AmbientBeams />
      <MagnifierCursor />
      <AtmosphereOverlay />
      <ProgressHud />
      <KeyboardHelp />
      <HintSystem />
      <Soundboard />
      <QuickNav />
      <Onboarding />
      <AudioToggle />
      <DetectiveNotebook />

      <main className="relative z-10 flex-1">
        <HeroSection />
        <CaseIntro />
        <DifficultySelect />
        <SectionDivider variant="stamp" label="Tantangan Harian" />
        <DailyChallengeSection />
        <BriefingSection />
        <SectionDivider variant="file" label="Arsip Kasus" />
        <CaseFileSection />
        <SectionDivider variant="thread" label="Jaring Tersangka" />
        <ConspiracyBoard />
        <SectionDivider variant="evidence" label="Deduksi" />
        <SuspectComparison />
        <SectionDivider variant="stamp" label="Tokoh" />
        <CastList />
        <SectionDivider variant="stamp" label="Korban" />
        <VictimProfile />
        <SectionDivider variant="evidence" label="Forensik" />
        <EvidenceLocker />
        <SectionDivider variant="evidence" label="TKP 3D" />
        <LocationExplorer />
        <SectionDivider variant="stamp" label="Ikatan" />
        <PersonalBond />
        <SectionDivider variant="thread" label="Kronologi" />
        <TimelineSection />
        <SectionDivider variant="stamp" label="Putusan" />
        <AccusationFinale />
        <DetectiveScore />
        <SectionDivider variant="file" label="Rekam Jejak" />
        <CaseArchive />
        <SectionDivider variant="achievement" label="Pencapaian" />
        <AchievementsGallery />
        <SectionDivider variant="file" label="Latar Cerita" />
        <LoreSection />
        <SectionDivider variant="stamp" label="Tentang" />
        <CreditsSection />
        <StampCta />
      </main>

      <SiteFooter />
    </div>
  );
}
