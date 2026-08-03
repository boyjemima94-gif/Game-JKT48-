"use client";

/**
 * ClientOverlays — bundles all interactive overlay components
 * (magnifier cursor, HUD, notebook, audio, hints, etc.)
 * into a single dynamic import with ssr: false.
 * 
 * This prevents the BAILOUT_TO_CLIENT_SIDE_RENDERING issue
 * that occurred when multiple dynamic(ssr:false) imports
 * were used directly in a "use client" page.
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
    </>
  );
}
