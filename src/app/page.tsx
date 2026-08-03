// Server component — NO "use client"
// All section components are client components that get SSR'd.
// ClientOverlays is a client component that wraps interactive overlays.

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
import SectionDivider from "@/components/game/section-divider";
import ClientOverlays from "@/components/game/client-overlays";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-noir-ink film-grain scene-vignette">
      <ClientOverlays />

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
