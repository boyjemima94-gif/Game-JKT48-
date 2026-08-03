"use client";

/**
 * ClientOverlays — bundles all interactive overlay components.
 * Includes OfflineDetector for network status monitoring.
 */

import MagnifierCursor from "./magnifier-cursor";
import AtmosphereOverlay from "./atmosphere-overlay";
import AmbientBeams from "./ambient-beams";
import DetectiveNotebook from "./detective-notebook";
import ProgressHud from "./progress-hud";
import KeyboardHelp from "./keyboard-help";
import HintSystem from "./hint-system";
import Soundboard from "./soundboard";
import QuickNav from "./quick-nav";
import Onboarding from "./onboarding";
import AudioToggle from "./audio-toggle";
import OfflineDetector from "./offline-detector";

export default function ClientOverlays() {
  return (
    <>
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
      <OfflineDetector />
    </>
  );
}
