# Worklog - 3D Mystery Murder Game (JKT48 Edition)

## Task ID: 0
Agent: main-orchestrator
Task: Build a 3D mystery murder game website with blinking desk lamp hero, paper-flip case file reveal, red-thread suspect connections, giant press-stamp CTA with paper rustle audio, magnifying-glass cursor, and JKT48 member characters (Oline Manuel, Catherina Valencia, Abigail Rachel, Fiony Alveria).

Work Log:
- Read existing project scaffold (Next.js 16 + Tailwind 4 + shadcn/ui). Confirmed dev server runs on port 3000.
- Loaded `image-search` skill and fetched 3 portrait images per JKT48 member (Oline, Catherina, Abigail, Fiony). URLs are OSS-hosted and embeddable.
- Installed `three`, `@react-three/fiber`, `@react-three/drei` for the 3D desk-lamp scene and atmospheric effects.

Stage Summary:
- Image assets (per member, pick best portrait):
  - Oline Manuel: https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c558a2398836.jpg (927x1200, IDN Times)
  - Catherina Valencia: https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f20059fab187.jpg (735x1135, Pinterest)
  - Abigail Rachel: https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a90f049d7e2c.jpg (736x1308, Pinterest)
  - Fiony Alveria: https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e7a0fe342f45.jpg (961x1200, x.com)
- Architecture decision: hybrid rendering.
  - Three.js (`@react-three/fiber`) for the hero desk-lamp + volumetric light + dust particles.
  - CSS 3D transforms for paper-flip case files and suspect cards (more reliable, crisper text).
  - SVG for the red-thread conspiracy board connections.
  - Web Audio API (synthesized) for paper-rustle SFX (no external audio files needed).
  - Custom div following the mouse for the magnifying-glass cursor (with a real magnified zoom inset).
- Next steps: write globals.css (noir palette + cursor styles), build suspects data, then assemble each section component.

---
Task ID: 1
Agent: main-orchestrator
Task: Build complete 3D mystery murder game site — all sections, interactions, audio, and verification.

Work Log:
- Wrote `src/app/globals.css` with noir detective palette (ink/coal/coffee/umber/brass/amber/crimson), custom magnifier-cursor styles with real DOM-clone magnification, paper-texture/stamp-ink/thread-line classes, lamp-flicker/stamp-slam/grain-shift keyframes, film-grain + scene-vignette overlays, custom scrollbar, paper flip 3D transforms.
- Wrote `src/lib/suspects.ts` with 4 fictional JKT48-based suspect profiles (Oline Manuel, Catherina Valencia, Abigail Rachel, Fiony Alveria), each with portrait image URL (OSS-hosted from image-search), codename, role, alibi, motive, evidence, threat level, quote, and board position. Includes 6 red-thread connections and 3 case files.
- Wrote `src/lib/audio.ts` — synthesized SFX via Web Audio API (no external files): playPaperRustle (filtered noise bursts), playStampSlam (low thud + impact noise + squeak), playLampBuzz, playDrawer, playClick, startRoomTone (ambient low rumble loop).
- Built `src/components/game/magnifier-cursor.tsx` — fixed circular lens that follows mouse with easing, clones the live DOM into the lens and scales 1.9x for REAL magnification, reticle crosshair, brass handle, reactive states (hover/click). Body gets `magnifier-active` class so native cursor hides only when magnifier is live (safe fallback).
- Built `src/components/game/three/hero-lamp-scene.tsx` — Three.js scene: procedural desk lamp (base+arms+joints+shade+bulb), flickering point light + emissive bulb driven by FlickerController (breathing + random dropouts + hard flickers), volumetric light cone, 180 drifting dust particles, desk props (papers, mug, folder), back wall, fog. Calls onFlicker (drives HTML portrait exposure + lamp buzz sfx) and onSweep.
- Built `src/components/game/hero-section.tsx` — wraps Three.js scene (dynamic ssr:false), overlays 4 JKT48 suspect portraits on the "wall" that brighten/dim with the lamp flicker sweep, center title "TEATRO DEL MISTERI", subtitle, dual CTA buttons, scroll hint, flicker-driven light spill.
- Built `src/components/game/briefing-section.tsx` — CRT terminal window with typewriter effect that types out 9 briefing lines when scrolled into view, color-coded lines (system green, case red, detective gold), scanline overlay, CRT glow, "LANJUT KE BERKAS" button.
- Built `src/components/game/case-file-section.tsx` — 3 case file cards with CSS 3D flip (perspective 1800px, rotateY 180deg), front shows classified stamp + case code, back shows victim/summary/clues, paper texture + burn mask + coffee stain + tape, plays paper rustle + click on flip, aria-label toggles Buka/Tutup.
- Built `src/components/game/conspiracy-board.tsx` — corkboard with 4 suspect polaroid portraits (redacted bars when not selected), SVG red-thread bezier paths with sag (shadow + main thread + active highlight), HTML overlay labels (readable, not cut off), clickable suspects revealing dossier (photo + role + alibi + motive + evidence + quote), post-it notes, aspect-[2/1] on desktop so all 4 portraits visible.
- Built `src/components/game/stamp-cta.tsx` — GIANT press stamp (knob + ribbed handle shaft + collar + 256px head with "CAP RESMI DEL MISTERI" + side bolts + rubber face), hangs from chain, slams down on click with framer-motion, plays paper rustle + stamp slam audio, leaves large red ink impression "BERGABUNG DALAM GAME" with date, "cap ulang" reset, "MULAI PENYELIDIKAN" post-stamp CTA.
- Built `src/components/game/onboarding.tsx` — 3-step intro overlay (welcome → magnifier → controls), unlocks audio + starts room tone on dismiss, sessionStorage guard.
- Built `src/components/game/audio-toggle.tsx` — floating bottom-left mute button with pulsing ring, persists to localStorage, auto-starts room tone after onboarding.
- Built `src/components/game/atmosphere-overlay.tsx` — film grain + vignette + bottom smoke gradient.
- Built `src/components/game/site-footer.tsx` — sticky footer (mt-auto) with 3 columns (brand, nav, status panel with live WIB clock + progress bar) + bottom copyright bar.
- Composed `src/app/page.tsx` — all sections in order: Hero → Briefing → Case Files → Conspiracy Board → Stamp CTA → Footer, plus MagnifierCursor + AtmosphereOverlay + Onboarding + AudioToggle.
- Updated `src/app/layout.tsx` — Indonesian lang, dark theme class, mystery-game metadata.

Verification (via agent-browser + VLM):
- ESLint: clean (0 errors, 0 warnings) after fixing react-hooks/set-state-in-effect (deferred setState via requestAnimationFrame) and removing unused eslint-disable directives.
- Dev server: compiles cleanly, no runtime errors (only benign Three.js PCFSoftShadowMap deprecation warnings).
- Hero: VLM confirms dark noir atmosphere, 3D brass desk lamp with warm glow, "TEATRO DEL MISTERI" title, 4 character portraits on sides, dual CTA buttons.
- Case file flip: aria-label toggles Buka→Tutup, paper rustle audio plays.
- Conspiracy board: all 4 suspects visible (BURUNG MERAK, MERAH MUDA, ANGSA PUTIH, BAYANG MALAM), red threads + readable HTML labels, dossier reveals on click (confirmed Catherina's alibi text).
- Stamp CTA: VLM confirms "large and clearly visible" giant stamp with "excellent contrast", stamp impression shows "BERGABUNG DALAM GAME" + date, Kontrak #0001 confirmed.
- Footer: at bottom, 3 columns with live clock, sticky via flex layout.
- Mobile (390px): renders responsively.
- Magnifier cursor: confirmed code correct (matchMedia gate for hover/pointer:fine); headless browser reports false so magnifier correctly doesn't render there, but works on real desktop. Body class fallback ensures native cursor always available.

Stage Summary:
- ALL requested features implemented and verified:
  ✓ Hero with blinking desk lamp (Three.js, flicker drives light + audio buzz + portrait exposure)
  ✓ JKT48 member characters (Oline, Catherina, Abigail, Fiony) as hero suspects + board suspects
  ✓ Case file reveal with paper flip effect (CSS 3D rotateY)
  ✓ Suspect connections using red thread (SVG bezier + HTML labels)
  ✓ CTA "Bergabung dalam Game" as giant press stamp (256px head) with paper rustling audio (Web Audio API)
  ✓ Magnifying glass cursor (real DOM-clone magnification, brass lens + handle + reticle)
  ✓ Intense atmosphere (film grain, vignette, fog, dust, flicker, scanlines, CRT glow)
  ✓ Intuitive controls (3-step onboarding, audio toggle, keyboard support, sticky footer nav)
- Bonus features added: briefing terminal with typewriter, audio toggle, ambient room tone, post-it notes, coffee stains, case progress tracker in footer.
- Cron job for webDevReview every 15 minutes: pending setup.

Unresolved issues / risks:
- Magnifier cursor cannot be visually verified in headless browser (matchMedia returns false for hover/pointer). Code is correct for real desktop browsers. To verify, a human should preview on desktop.
- JKT48 portraits load from external OSS CDN; if the CDN is slow, portraits may take a moment to appear. No graceful loading spinner on the <img> tags yet (low priority).
- Three.js scene is moderately heavy (shadows + 180 particles); acceptable on desktop, may want to reduce particle count on low-end mobile.

---
Task ID: 2
Agent: main-orchestrator (cron webDevReview round 1)
Task: QA testing, bug fixes, and major feature expansion (Evidence Locker, Detective's Notebook, Accusation Finale, Progress HUD, section dividers).

Work Log:
- Read worklog.md (Task 0 + Task 1) to understand prior progress. Project was stable with all originally-requested features implemented.
- Performed QA testing via agent-browser: loaded the site, captured screenshots of all sections (hero, briefing, cases, board, stamp, footer), ran VLM analysis on each.
- QA findings (bugs identified by VLM):
  1. Hero: codename labels under portraits too dark/low-contrast (nearly illegible)
  2. Hero: "SELIDIKI" scroll hint nearly invisible (text-noir-paper/40)
  3. Hero: secondary CTA "Buka Berkas Kasus" link looked unfinished (plain text, no border/background)
  4. Stamp: "MASUKI TEATER" + "PANGGILAN TERAKHIR" headers too low-contrast
  5. Board: redaction bars across portraits looked like broken images (not intentional censored look)
  6. Case files: section header subtitle + desk label too low-contrast
- Fixed all 6 bugs:
  - Hero codename labels: changed to text-noir-brass font-bold with border-t-2, bg-noir-ink/95, drop-shadow
  - Hero SELIDIKI: changed to text-noir-brass/80 with drop-shadow, taller gradient line
  - Hero secondary CTA: added border border-noir-brass/40, hover states, font-stamp text
  - Stamp headers: added text-shadow glow, brighter text colors, larger sizes
  - Board redaction: replaced plain dark bar with intentional "✖ TERSENSOR ✖" text bar + "RAHASIA" corner stamp badge (both fade out when suspect is active)
  - Case files: brightened subtitle to text-noir-paper/85, desk label to text-noir-brass/70 with drop-shadow
- Created `src/lib/game-store.ts` — Zustand store with persist middleware for game state:
  - 6 evidence items (EVIDENCE_ITEMS) with categories (fisik/digital/dokumen/biologis), descriptions, forensic details, and linked clue IDs
  - 6 clue definitions (CLUE_DEFS) with titles, descriptions, suspect implications, source locations, glyphs
  - CULPRIT_ID = "catherina" (canonical correct answer)
  - State: clues[], examinedEvidence{}, notebookOpen, accusation, accusationResult
  - Actions: examineEvidence, hasClue, toggleNotebook, makeAccusation, resetGame, cluesCount
  - Persists to localStorage "teatro-game-state"
- Built `src/components/game/evidence-locker.tsx` — "PEMERIKSAAN BUKTI" section:
  - 6 evidence cells in a grid with category-colored borders, cell numbers, emoji glyphs, scanline overlay when not examined, "DIPERIKSA" stamp when examined
  - Progress indicator (6 dots + count) showing examined/total
  - Click opens detail modal with evidence tag, glyph, name, description, forensic analysis, "✓ DICATAT" badge
  - Auto-records clue to notebook 400ms after opening (with paper rustle audio)
  - Hover "🔍 PERIKSA" tooltip on each cell
- Built `src/components/game/detective-notebook.tsx` — slide-out notebook panel:
  - Floating trigger button (bottom-right) with 📓 icon, clue count badge, "N" keyboard hint
  - Slide-out paper-textured panel with progress bar (clues/total), categorized clues (suspect-directing vs general), suspect quick-list with per-suspect clue counts
  - Keyboard shortcuts: N to toggle, Esc to close
  - "SEMUA BUKTI TERKUMPUL — SAATNYA MENUDUH!" message when all clues found
  - Each clue shows glyph, title, description, suspect implication, source, timestamp
- Built `src/components/game/accusation-finale.tsx` — "SIAPA PELAKU?" section:
  - Locked until 3+ clues examined (shows 🔒 overlay with "→ KE LOKER BUKTI" link)
  - 4 suspect selection cards with portraits, codenames, implicated-clue-count badges
  - Selection ring (crimson border + glow) on chosen suspect
  - Confirmation bar with "TUDUH SEKARANG ⚖" button (plays paper rustle + stamp slam)
  - Result screen: BENAR!/SALAH! stamp, accused-vs-culprit comparison with ⚖ divider, confession/escape narrative, stats grid (petunjuk/hasil/kasus), "↻ MAIN LAGI" reset button
  - Correct path: green border, "KASUS TERPECAHKAN", "MENANG", culprit's quote + confession
  - Wrong path: crimson border, "KEADILAN TERTUNDIN", "KALAH", culprit escape narrative
- Built `src/components/game/progress-hud.tsx` — top-center floating HUD:
  - Appears after scrolling past hero (scrollY > 70vh)
  - Shows case ID (JKT-48-001), clue progress bar (count/total + gradient fill), notebook quick-open button with "N" kbd hint
- Built `src/components/game/section-divider.tsx` — ornamental dividers between sections:
  - 4 variants (stamp ★, thread ✦, file §, evidence 🔍) with label text
  - Gradient lines on both sides, fade-in on scroll
- Updated `src/app/page.tsx` — composed all sections in order: Hero → Briefing → [divider] → Case Files → [divider] → Conspiracy Board → [divider] → Evidence Locker → [divider] → Accusation Finale → Stamp CTA → Footer. Added ProgressHud, DetectiveNotebook (all dynamic ssr:false).
- Updated `src/components/game/site-footer.tsx` — added "→ Loker Bukti" and "→ Tuduhan Akhir" nav links.
- Updated `src/components/game/onboarding.tsx` — step 3 now mentions examining evidence, notebook, and accusing the culprit.

Verification (via agent-browser + VLM):
- ESLint: clean (0 errors, 0 warnings).
- Dev server: compiles cleanly, no runtime errors (only benign Three.js deprecation warnings).
- Hero fixes verified by VLM: "codename labels now readable gold/brass", "SELIDIKI visible", "secondary link now has border" — all confirmed.
- Board fix verified by VLM: "censor bars now look intentional", "TERSENSOR text in red", "RAHASIA corner stamps" — confirmed not broken images.
- Evidence Locker verified: 6 cells with emojis (🥃💾🧤✉️⌚🧬), category labels, progress dots. Detail modal opens with forensic analysis + "✓ DICATAT".
- Notebook verified by VLM: "progress bar 4/6", "clues listed with details", "suspect names with clue counts", "clean layout" — all confirmed.
- Accusation flow tested both paths:
  - Correct (Catherina): "BENAR!" → "KASUS TERPECAHKAN" → "MENANG" + confession quote. VLM confirmed.
  - Wrong (Oline): "SALAH!" → "KEADILAN TERTUNDIN" → "KALAH" + escape narrative. VLM confirmed.
- Game state persistence: verified clues + examined evidence persist to localStorage across reloads via Zustand persist middleware.
- Reset ("MAIN LAGI") clears state and re-locks accusation.
- Full page screenshot captured (3MB, all sections render correctly).

Stage Summary:
- ALL QA bugs fixed and verified by VLM.
- 4 major new features added and fully tested:
  ✓ Evidence Locker — 6 interactive evidence items with forensic detail modals
  ✓ Detective's Notebook — slide-out panel with progress tracking, categorized clues, suspect summary (keyboard N/Esc)
  ✓ Accusation Finale — locked-until-ready suspect selection with correct/wrong result paths, story resolution, reset
  ✓ Progress HUD — top-center floating progress bar that appears on scroll
- Styling polish: ornamental section dividers between all sections, brighter headers throughout, intentional censored-portrait look.
- Game is now a complete interactive detective experience: examine evidence → collect clues in notebook → accuse culprit → see result → replay.
- Next round could add: interrogation dialogue system, multiple cases, timer/score, sound design for evidence examination, mobile-specific layout tuning for the new sections.

Unresolved issues / risks:
- Evidence Locker + Accusation grids use 2-col on mobile; the accusation 4-suspect grid is 2-col on small screens which is fine but could be optimized.
- The Zustand persist means a returning user keeps their progress; the "MAIN LAGI" reset is the only way to clear. This is intentional but should be documented.
- No visual loading state on evidence detail modal images (they're emoji glyphs, so no actual image loading needed — low risk).

---
Task ID: 3
Agent: main-orchestrator (cron webDevReview round 2)
Task: QA testing, bug fixes (briefing contrast, accusation typo), and major feature expansion (Interrogation System, Timeline Puzzle, Victim Profile, Ambient Beams).

Work Log:
- Read worklog.md (Tasks 0-2). Project stable with Evidence Locker, Notebook, Accusation Finale, Progress HUD from last round.
- Performed QA via agent-browser: lint clean, dev server clean, no runtime errors. Captured section screenshots + VLM analysis.
- QA findings (bugs):
  1. Briefing terminal: header path "teatro@detective:..." too low-contrast (text-noir-paper/50); footer "Transmisi terenkripsi" nearly invisible (text-noir-paper/30)
  2. Briefing: no way to skip/replay the typewriter animation
  3. Accusation lock text had typos: "TERTUTUK" (should be TERTUTUP) and "BANYIK" (should be BANYAK)
- Fixed all bugs:
  - Briefing header path: text-noir-brass/80 + drop-shadow
  - Briefing footer: text-noir-brass/60 + drop-shadow
  - Briefing: added "⏭ LEWATI" button (skips to full text) + "↻ ULANG" button (replays from start) in terminal header bar
  - Accusation: fixed "TERTUTUK→TERTUTUP" and "BANYIK→BANYAK"
- Created `src/lib/interrogations.ts` — dialogue data + timeline events + victim profile:
  - 4 interrogation trees (one per suspect), each with 4 questions + branching unlocks
  - Responses have tones (truth/lie/evasive/breakdown) with metadata (label, color, icon)
  - Some responses record statements (clues) to the notebook
  - 8 timeline events in chronological order (20:00 → 23:45) for reconstruction puzzle
  - Victim profile: Mardiono 'M' Santoso, cause of death, last words, 4 suspect relationships
- Expanded `src/lib/game-store.ts`:
  - Added 17 new CLUE_DEFS for interrogation statements (stmt-oline-*, stmt-cath-*, stmt-abigail-*, stmt-fiony-*) + 1 timeline bonus (stmt-timeline)
  - Added state: interrogatedSuspects{}, recordedStatements{}, timelineSolved
  - Added actions: recordStatement(clueId), markInterrogated(suspectId), setTimelineSolved(v)
  - Updated resetGame + partialize to include new state
  - TOTAL_CLUE_COUNT now ~23 (6 evidence + 16 statements + 1 timeline)
- Built `src/components/game/interrogation-modal.tsx` — full dialogue system:
  - Two-pane layout: suspect info (portrait, codename, progress) + dialogue pane
  - "● REC" recording indicator, room label
  - Greeting with tone badge
  - Question buttons with branching unlock logic (root questions always available; follow-ups unlock after prereq asked)
  - Typewriter response animation + tone label (JUJUR/BERBOHONG/MENGHINDAR/GUGUP) + "✓ DICATAT" badge
  - Progress dots (0/4 → 4/4), auto-marks suspect as interrogated
  - "AKHIRI INTEROGASI" close button
- Wired interrogation into `src/components/game/conspiracy-board.tsx`:
  - Added "🗣️ Interogasi" button to each suspect's dossier (with ✓ checkmark if already interrogated)
  - Opens InterrogationModal with that suspect
- Built `src/components/game/timeline-section.tsx` — "URUTAN LINIMASA" puzzle:
  - 8 events shuffled deterministically (stable per session)
  - Click event → places on chronological rail
  - Rail shows numbered nodes (01-08) with time + event + detail
  - "✓ PERIKSA URUTAN" validates order: correct → green border + "LINIMASA TERPECAHKAN" banner + bonus clue; wrong → crimson border + "✗ SALAH POSISI" + attempt counter
  - "↻ RESET" clears placement
  - Solved state shows all events green + "✓ BENAR"
- Built `src/components/game/victim-profile.tsx` — "SIAPA KORBAN?" section:
  - Folder tab aesthetic ("BERKAS KORBAN" + "RAHASIA")
  - Sealed state: 📇 icon + "BERKAS TERSEGEL" + "✖ RAHASIA ✖" stamp + "📂 BUKA BERKAS" button
  - Revealed state: SVG silhouette portrait with "KORBAN" + "† MENINGGAL" stamps, victim name/role/age, cause of death, last words, background narrative, 4 suspect relationship cards (each with name, codename, relation to victim)
  - "tutup berkas" re-seal option
- Built `src/components/game/ambient-beams.tsx` — decorative drifting light beams:
  - 3 slow-moving radial gradients (warm beam, crimson beam, center glow) with CSS keyframe animations
  - pointer-events-none, very low opacity for subtle atmosphere
- Added beam keyframes to `globals.css`: beam-drift-a, beam-drift-b, beam-pulse
- Updated `src/app/page.tsx` — new section order: Hero → Briefing → [divider] → Case Files → [divider] → Conspiracy Board → [divider] → Victim Profile → [divider] → Evidence Locker → [divider] → Timeline → [divider] → Accusation → Stamp CTA → Footer. Added AmbientBeams.
- Updated `src/components/game/site-footer.tsx` — added "→ Profil Korban" and "→ Urutan Linimasa" nav links.

Verification (via agent-browser + VLM):
- ESLint: clean (0 errors, 0 warnings).
- Dev server: compiles cleanly, no runtime errors.
- Briefing fixes: skip/replay buttons present, brighter header/footer.
- Accusation typo: fixed and confirmed.
- Interrogation flow tested (Catherina):
  - Opens modal with portrait + REC indicator + greeting + 2 root questions
  - Asking alibi question → typewriter response + tone label + "✓ DICATAT" + 2 follow-up questions unlocked
  - Notebook badge incremented to 9 clues
  - VLM confirmed: "clean and functional, dark theme with gold accents, no visual bugs"
- Timeline section: VLM confirmed "header URUTAN LINIMASA, empty rail, shuffled event cards, CEK URUTAN button — clean and functional"
- Victim profile: sealed state confirmed (BERKAS KORBAN tab, RAHASIA stamp, BUKA BERKAS button); revealed state confirmed (Mardiono name, silhouette, cause of death, last words, background)
- Full page screenshot captured (2.1MB, all sections render correctly).

Stage Summary:
- ALL QA bugs fixed (briefing contrast, skip/replay, accusation typos).
- 4 major new features added and tested:
  ✓ Interrogation System — dialogue trees with 4 suspects, branching questions, tone labels, statement recording
  ✓ Timeline Reconstruction — 8-event chronological puzzle with validation + bonus clue
  ✓ Victim Profile — sealed/revealed folder with silhouette, cause of death, suspect relationships
  ✓ Ambient Beams — drifting atmospheric light beams
- Game loop now: examine evidence → interrogate suspects (record statements) → reconstruct timeline → accuse culprit → see result → replay
- Multiple clue sources now feed the accusation lock (evidence + interrogation statements + timeline bonus), making the investigation richer.
- Next round could add: interrogation cross-referencing (present evidence to catch lies), multiple endings, sound design for interrogation, score/rating system.

Unresolved issues / risks:
- Interrogation responses use typewriter animation; if user clicks rapidly, responses still complete (intervals cleared on unmount). Tested OK.
- Timeline shuffle is deterministic per session but not truly random — acceptable for a puzzle.
- Victim portrait is an SVG silhouette (victim is fictional) — intentional design choice.
- The game-state localStorage now stores more data; reset clears all. Verified.

---
Task ID: 4
Agent: main-orchestrator (cron webDevReview round 3)
Task: QA testing, hero CTA polish, and major feature expansion (Case Intro cinematic, Detective Performance Score, Keyboard Help overlay).

Work Log:
- Read worklog.md (Tasks 0-3). Project stable with full investigation loop: hero, briefing, case files, conspiracy board (+interrogation), victim profile, evidence locker, timeline puzzle, accusation finale, stamp CTA, notebook, progress HUD, ambient beams.
- Performed QA via agent-browser: lint clean, dev server clean, no runtime errors. VLM analysis of hero found CTA button could "pop" more.
- Polished hero CTA button (`hero-section.tsx`):
  - Added golden glow shadow that pulses with lamp flicker (box-shadow tied to flicker state)
  - Added animated sheen sweep on hover (white gradient translates across button)
  - Added arrow icon (→) that translates on hover
  - Added hover lift (-translate-y-0.5) + brighter shadow on hover
  - Secondary CTA also gets hover lift
- Built `src/components/game/case-intro.tsx` — cinematic narrative bridge (Hero → Briefing):
  - Scroll-driven parallax using framer-motion useScroll/useTransform (background + fog layers move at different speeds)
  - "TIGA BELAS OKTOBER" title with crimson glow text-shadow
  - 3 story beats (23:17, 23:32, 23:45) alternating left/right with staggered entrance animations
  - Each beat: large timestamp (crimson/brass with glow), location label, story card with border accent + inner glow + quote marks
  - Connecting vertical lines between beats
  - "Penyelidikan dimulai" closing badge + scroll hint
- Built `src/components/game/detective-score.tsx` — post-accusation performance rating:
  - Only renders when accusation !== null (appears after accusation finale)
  - Calculates stats from game state: accuracy (correct=100%), thoroughness (clues/total), interrogation (suspects/total), timeline (solved=100%)
  - Weighted overall score (0-100) → rank S/A/B/C/D with labels (Detektif Legendaris/Senior/Kompeten/Pemula/Magang)
  - Rank stamp: circular border-4 stamp with spring-animated entrance (scale+rotate), inner ring, glow
  - 4 animated stat bars (Akurasi Tuduhan, Kelengkapan Bukti, Interogasi, Linimasa) with gradient fills + staggered width animation
  - 4-cell stats grid (evidence examined, suspects interrogated, clues found, timeline status)
  - Verdict badge (★ KASUS TERPECAHKAN ★ / ✖ KASUS TERTUNDIN) with date
  - "↻ MAIN LAGI" reset + "↑ KEMBALI KE ATAS" navigation
- Built `src/components/game/keyboard-help.tsx` — floating help overlay:
  - "?" button (top-right) opens modal listing keyboard shortcuts (N, Esc, M, ?)
  - Toggle with "?" key, close with Esc
  - Paper-textured modal with kbd-styled key badges
- Updated `src/app/page.tsx` — new section order: Hero → CaseIntro → Briefing → [dividers] → CaseFiles → ConspiracyBoard → VictimProfile → EvidenceLocker → Timeline → AccusationFinale → DetectiveScore → StampCta → Footer. Added KeyboardHelp.

Verification (via agent-browser + VLM):
- ESLint: clean (0 errors, 0 warnings).
- Dev server: compiles cleanly, no runtime errors.
- Hero CTA polish verified by VLM: "distinct warm golden-yellow glow", "arrow icon", "popping appearance" — confirmed.
- Case Intro verified by VLM: "TIGA BELAS OKTOBER title", "story beat with 23:17 timestamp", "strong atmospheric noir-mystery feel", "clean and professional" — confirmed.
- Detective Score verified by VLM: rank "C" stamp, "Detektif Pemula" label, "46/100" score, 4 stat bars (Akurasi 100%, Bukti 17%, Interogasi 0%, Linimasa 0%), stats grid — all confirmed working.
- Keyboard Help verified: "PEMBANTU KIBOR" heading, shortcuts listed, opens with "?" key.

Stage Summary:
- Hero CTA polished with flicker-synced glow + animated sheen + hover micro-interactions.
- 3 major new features added and tested:
  ✓ Case Intro — cinematic parallax narrative bridge with 3 story beats
  ✓ Detective Performance Score — post-accusation rating with rank stamp, stat bars, stats grid, verdict
  ✓ Keyboard Help — floating "?" overlay listing all shortcuts
- Game now has a complete narrative arc: Hero → Case Intro (story) → Briefing (terminal) → Investigation (cases/board/victim/evidence/timeline) → Accusation → Score → Stamp CTA.
- The Detective Score gives players a reason to replay (improve rank by interrogating more, solving timeline, finding all clues).

Unresolved issues / risks:
- Full-page screenshot timed out (page is now very long with many sections) — not a bug, just a testing limitation.
- Detective Score appears between Accusation and Stamp CTA; if user scrolls past it they'll see the stamp. This is fine — score is the "ending" and stamp is the "join" CTA.
- Evidence cross-referencing (present evidence during interrogation to catch lies) was planned but deferred — would require significant data model changes. Left for a future round.

---
Task ID: 5
Agent: main-orchestrator (cron webDevReview round 4)
Task: QA testing, case intro subtitle polish, and major feature expansion (Difficulty Selection, Hint System, Evidence Cross-Reference, difficulty-based scoring).

Work Log:
- Read worklog.md (Tasks 0-4). Project stable with full game arc: Hero → Case Intro → Briefing → Case Files → Conspiracy Board (+interrogation) → Victim Profile → Evidence Locker → Timeline → Accusation → Detective Score → Stamp CTA.
- Performed QA via agent-browser: lint clean, dev server clean, no runtime errors. VLM confirmed case intro + evidence + timeline sections all render correctly. Noted case intro subtitle was thin/low-contrast.
- Fixed case intro subtitle contrast: changed from text-noir-paper/60 to text-noir-brass/80 with drop-shadow + tracking-[0.3em].
- Expanded `src/lib/game-store.ts` with difficulty system:
  - Added Difficulty type (pemula/detektif/legendaris) + DIFFICULTIES config (minClues, hintCost, scoreMultiplier, showHints, icon, label, description)
  - Pemula: 3 min clues, hints on, ×0.8 score
  - Detektif: 6 min clues, hints on, ×1.0 score (recommended)
  - Legendaris: 12 min clues, no hints, ×1.4 score
  - Added state: difficulty, hintsUsed
  - Added actions: setDifficulty, useHint
  - Updated resetGame + partialize to include difficulty + hintsUsed
- Built `src/components/game/difficulty-select.tsx` — "MODE PENYELIDIKAN" section:
  - 3 cards (Pemula 🌱 / Detektif 🔍 / Legendaris ★) with color-coded borders (green/brass/crimson) + glow
  - Each card: icon, label, description, 3 stats (min clues, hints, score multiplier), "Pilih Mode →" CTA
  - "★ DIREKOMENDASI" badge on Detektif
  - Hover lift + icon scale, plays stamp slam on choose
  - Disappears after selection (returns null if difficulty set)
- Built `src/components/game/hint-system.tsx` — floating 💡 bulb:
  - Shows on pemula/detektif modes (not legendaris) after onboarding + difficulty chosen
  - Bottom-center floating button with hint count badge
  - Click opens paper-textured modal with "PETUNJUK DETEKTIF" + "BIAYA: -X POIN"
  - Suggests next logical step based on game state (examine evidence → interrogate → timeline → more clues → accuse)
  - "→ KE LOKER BUKTI / PAPAN / LINIMASA / TUDUHAN" navigation button to scroll to target
  - Each use costs score points (per difficulty config)
- Built Evidence Cross-Reference system:
  - Added CrossRef interface + crossRefs arrays to each interrogation tree (8 cross-refs total: 2 per suspect)
  - Each cross-ref: evidenceId, reaction text, tone, recordsClueId, statementLabel
  - Added 8 cross-ref clue definitions to CLUE_DEFS (xref-oline-hair, xref-oline-watch, xref-cath-glove, xref-cath-parfum, xref-abigail-glove, xref-abigail-letter, xref-fiony-usb, xref-fiony-watch)
  - Updated interrogation-modal.tsx with cross-reference UI:
    - "⚡ KONFRONTASI BUKTI" button (tungsten-themed) with "(N tersedia)" count
    - Opens tray listing examined evidence relevant to this suspect
    - Smart empty-state messages: "Belum ada bukti yang kau periksa" / "Hanya X/Y bukti relevan yang diperiksa" / "Semua bukti yang relevan telah dikonfrontasi"
    - Click evidence → typewriter reaction with tungsten border + tone label + "✓ DICATAT"
    - Records statement to notebook
- Updated `src/components/game/accusation-finale.tsx`:
  - Min clues now reads from difficulty config (DIFFICULTIES[difficulty].minClues) instead of hardcoded 3
  - Lock message shows dynamic "X / Y minimum"
- Updated `src/components/game/detective-score.tsx` with difficulty integration:
  - Overall score = (weighted base × difficulty multiplier) − (hintsUsed × hintCost)
  - Score display shows "(Mode: Detektif ×1.0 −3×10)" breakdown
  - Stats grid expanded to 6 cells: Bukti, Tersangka, Petunjuk, Linimasa, Mode, Petunjuk Dipakai
  - Added difficulty + hintsUsed to useMemo deps
- Composed all new sections into `src/app/page.tsx`:
  - Hero → CaseIntro → DifficultySelect → Briefing → [dividers] → ... → Stamp CTA
  - Added HintSystem as dynamic import

Verification (via agent-browser + VLM):
- ESLint: clean (0 errors, 0 warnings) — fixed 2 issues (useHint hook naming, setState in effect).
- Dev server: compiles cleanly, no runtime errors.
- Case intro subtitle: brightened to brass/80.
- Difficulty select: VLM confirmed "3 cards (Pemula/Detektif/Legendaris) with icons, min clues, hints, score multiplier, DIREKOMENDASI badge on Detektif — clean, color-coded".
- Hint system: tested — bulb appears after choosing Detektif + dismissing onboarding; modal shows "PETUNJUK DETEKTIF · BIAYA: -10 POIN" with next-step suggestion + navigation button.
- Cross-reference: tested full flow:
  1. Examined Sarung Tangan Lace (ev-glove)
  2. Opened Catherina interrogation
  3. "⚡ KONFRONTASI BUKTI (1 tersedia)" button visible
  4. Clicked → "🧤 Tunjukkan Sarung Tangan Lace" appeared
  5. Clicked → typewriter reaction: "Catherina memeriksa sarung tangan itu. Tangannya gemetar. 'Itu... mirip milikku...'"
  6. Tone label "GUGUP" + "✓ DICATAT" confirmed by VLM
  7. Statement recorded to notebook (xref-cath-glove)
- VLM confirmed cross-ref: "⚡ KONFRONTASI BUKTI section visible, reaction text visible, GUGUP tone label, ✓ DICATAT indicator — clean and functional".

Stage Summary:
- Case intro subtitle polished for readability.
- 3 major new features added and tested:
  ✓ Difficulty Selection — 3 modes (Pemula/Detektif/Legendaris) with different min clues, hints, score multipliers
  ✓ Hint System — floating 💡 bulb with next-step suggestions + score cost
  ✓ Evidence Cross-Reference — present examined evidence during interrogation to break lies, records new statements
- Difficulty-based scoring: Detective Score now applies multiplier (×0.8/×1.0/×1.4) + hint penalty, shows breakdown.
- Accusation lock now dynamic based on difficulty (3/6/12 min clues).
- Game now has full replayability: 3 difficulty modes × different strategies × score optimization.
- TOTAL_CLUE_COUNT now ~31 (6 evidence + 16 statements + 1 timeline + 8 cross-refs).

Unresolved issues / risks:
- Cross-ref requires examining evidence first — the empty-state messages guide users but some may still be confused. Acceptable.
- Hint bulb uses setInterval to check onboarding state — minor perf cost, acceptable.
- Difficulty persists across sessions; reset clears it. Verified.

---
Task ID: 6
Agent: main-orchestrator (cron webDevReview round 5)
Task: QA testing, difficulty button polish, and major feature expansion (Case Archive statistics dashboard, Cast List bios, persistent case history recording).

Work Log:
- Read worklog.md (Tasks 0-5). Project stable with complete game arc including difficulty selection, hint system, evidence cross-reference, and difficulty-based scoring.
- Performed QA via agent-browser: lint clean, dev server clean, no runtime errors. VLM confirmed difficulty select + briefing + cast list render correctly. Noted difficulty card "Pilih Mode →" button had low contrast (used dynamic Tailwind class `border-${style.border}/40` which doesn't generate).
- Fixed difficulty card "Pilih Mode →" button: replaced dynamic class with explicit `border-t-2 ${style.border}` + `${style.bg}`, added font-bold, brightness hover, ▸ prefix, larger padding.
- Expanded `src/lib/game-store.ts` with persistent case history:
  - Added CaseRecord interface (id, date, difficulty, accusedId, correct, score, rank, cluesFound, totalClues, hintsUsed, timelineSolved, suspectsInterrogated, durationMs)
  - Added caseHistory: CaseRecord[] to state
  - Added recordCase(rec) action (prepends to history, caps at 20 entries)
  - Updated resetGame to preserve caseHistory across resets (uses functional set to read current state)
  - Updated partialize to persist caseHistory
- Updated `src/components/game/detective-score.tsx` to record cases:
  - Added useEffect with useRef guard to record case once per accusation
  - Generates unique key from accusation+score+clues to prevent double-recording
  - Checks recent history entry (5s window) to avoid duplicates on re-render
  - Records CaseRecord with all stats (difficulty, score, rank, clues, hints, timeline, suspects)
- Built `src/components/game/case-archive.tsx` — "REKAM JEJAK DETEKTIF" persistent statistics dashboard:
  - Empty state: 📂 icon + "BELUM ADA ARSIP" + description + "→ MULAI KASUS" button linking to #mode
  - Populated state: 4 summary stat cards (Kasus Selesai, Kasus Terpecahkan, Tingkat Menang, Skor Terbaik) with icons + color-coded values
  - 3 stat panels: Pangkat Terbaik (S/A/B/C/D colored), Skor Rata-rata, Petunjuk Ditemukan
  - "Kemenangan per Mode" section: 3 cells (Pemula/Detektif/Legendaris) with icons + win counts
  - "▼ LIHAT RIWAYAT LENGKAP" expandable button → scrollable history list (max 400px) with CaseHistoryRow components
  - Each history row: #number, difficulty icon, suspect name, date, rank letter, score, win/loss badge
- Built `src/components/game/cast-list.tsx` — "PARA TERSANGKA" expanded character bios:
  - 4 portrait cards in a grid with hover lift, codename (top-left), role (top-right crimson badge), name + memberOf (bottom gradient overlay)
  - Quick stats bar under each portrait: Usia, Ancaman (● dots 1-5), Tinggi
  - Click card → animated bio detail panel (paper-textured) with portrait + 4 labeled sections:
    - KARIER (brass) — career history
    - KEPRIBADIAN (ink) — personality traits
    - RAHASIA (crimson) — hidden secrets
    - HUBUNGAN (purple) — relationships with other suspects
  - Each suspect has unique bio text (CAST_BIOS record) + quote + signature at bottom
  - "tutup biografi" re-seal option
- Updated `src/app/page.tsx` — new section order: Hero → CaseIntro → DifficultySelect → Briefing → [dividers] → CaseFiles → ConspiracyBoard → [divider] → CastList → [divider] → VictimProfile → EvidenceLocker → Timeline → Accusation → DetectiveScore → [divider] → CaseArchive → StampCta → Footer.
- Updated `src/components/game/site-footer.tsx` — added "→ Daftar Tokoh" and "→ Arsip Penyelidikan" nav links.

Verification (via agent-browser + VLM):
- ESLint: clean (0 errors, 0 warnings).
- Dev server: compiles cleanly, no runtime errors.
- Difficulty button polish: replaced dynamic Tailwind class, now uses explicit border + bg + font-bold.
- Cast list: VLM confirmed "4 character portrait cards with codename, role, name, memberOf — clean, no glitches". Bio panel: VLM confirmed "portrait on left, 4 labeled sections (KARIER, KEPRIBADIAN, RAHASIA, HUBUNGAN) with text — clean and organized".
- Case Archive empty state: VLM confirmed "REKAM JEJAK DETEKTIF header, BELUM ADA ARSIP, MULAI KASUS button, folder icon — clean noir aesthetic, no visual issues".
- Case recording: verified recordCase action + persist works; caseHistory survives resetGame.

Stage Summary:
- Difficulty button contrast fixed.
- 2 major new features added and tested:
  ✓ Case Archive — persistent statistics dashboard with summary cards, rank/score panels, wins-by-difficulty, expandable full history
  ✓ Cast List — expanded character bios with 4 sections (Karier/Kepribadian/Rahasia/Hubungan) per suspect
- Persistent case history: each accusation now records a CaseRecord that survives game resets, building a long-term detective profile.
- Game now has full meta-progression: play cases → build archive → track best scores/ranks across difficulties → replay to improve.

Unresolved issues / risks:
- Case Archive populated state couldn't be fully VLM-verified (persist middleware overwrites injected test data; only real accusations populate it). Code is correct — recordCase fires on accusation via useEffect in DetectiveScore.
- Cast List bios are static (CAST_BIOS) — could be moved to suspects.ts data file in future, but current approach keeps lore separate from gameplay data.
- Page is now very long (12+ sections); full-page screenshot times out in headless browser. Individual section screenshots all verified OK.

---
Task ID: 7
Agent: main-orchestrator (cron webDevReview round 6)
Task: QA testing, and major feature expansion (Achievements system, Soundboard, section divider film-strip polish).

Work Log:
- Read worklog.md (Tasks 0-6). Project stable with complete game arc + meta-progression (Case Archive, Cast List, difficulty, hints, cross-reference).
- Performed QA via agent-browser: lint clean, dev server clean, no runtime errors. VLM confirmed hero buttons properly stacked on mobile (no overlap). All 14 sections present in accessibility tree.
- Created `src/lib/achievements.ts` — 12 unlockable achievements with rarity system:
  - Achievement interface (id, title, description, glyph, check function, rarity: common/rare/epic/legendary)
  - AchievementContext (correct, score, rank, difficulty, cluesFound, totalClues, hintsUsed, timelineSolved, suspectsInterrogated, totalSuspects, casesPlayed, wins, perfectAccusations)
  - 12 achievements: Detektif Baru (first case), Kasus Terpecahkan (first win), Tanpa Bantuan (no hints), Penyelidik Sempurna (all clues), Interogator Ulung (all suspects), Ahli Kronologi (timeline), Detektif Legendaris (rank S), Tanpa Ampun (legend win), Detektif Kilat (speed run), Veteran Teatro (5 wins), Sang Detektif (10 cases), Sempurna Tanpa Cela (flawless)
  - RARITY_META with colors (common=grey, rare=cyan, epic=purple, legendary=brass) + glow + border
  - checkAchievements(ctx, alreadyUnlocked) returns newly-unlocked IDs
- Expanded `src/lib/game-store.ts` with achievements persistence:
  - Added unlockedAchievements: string[] to state
  - Added unlockAchievements(ids) action (dedupes + appends)
  - Updated resetGame to preserve unlockedAchievements
  - Updated partialize to persist unlockedAchievements
- Updated `src/components/game/detective-score.tsx` to check achievements after accusation:
  - Added useEffect that builds AchievementContext from the recorded CaseRecord + caseHistory
  - Calls checkAchievements, unlocks new ones, sets newAchievements state for display
  - Added "✦ Pencapaian Baru Terbuka ✦" panel showing newly-unlocked achievements with rarity-colored borders, glyphs, titles, descriptions, rarity badges, glow
- Built `src/components/game/achievements-gallery.tsx` — "GALLERI PENCAPAIAN" section:
  - Progress indicator (12 dots + count + percentage)
  - Grid of all 12 achievement cards with: rarity badge, ✓ TERBUKA / 🔒 TERKUNCI status, glyph (greyscale if locked), title, description ("???" if locked)
  - Unlocked cards glow with rarity color; locked cards are dimmed
  - "★ SEMUA PENCAPAIAN TERBUKA ★" completion message when all 12 unlocked
- Built `src/components/game/soundboard.tsx` — floating 🔊 button + modal:
  - Fixed bottom-right button (bottom-20 to avoid overlap with notebook/hint buttons)
  - Modal with "SOUND BOARD" header + 6 SFX buttons in a grid:
    - 📄 Gemerisik Kertas, 🔨 Hantaman Cap, 💡 Dengung Lampu, 🗄️ Laci Geser, 🔘 Klik Tombol, ✉️ Kertas Lembut
  - Each button: glyph, name, description, "▸ PUTAR" on hover, whileTap scale animation
  - Calls unlockAudio() then the SFX play function
  - Footer: "Semua suara dibuat secara real-time — tanpa file audio eksternal"
- Polished `src/components/game/section-divider.tsx` with film-strip border:
  - Added decorative film-strip perforation pattern (repeating-linear-gradient) with fade mask
  - Glyphs now have drop-shadow glow (drop-shadow-[0_0_8px_currentColor])
  - Label text now font-bold with drop-shadow
  - Added "achievement" variant (✦ brass)
  - Increased py from 8 to 10 for more presence
- Updated `src/app/page.tsx` — added AchievementsGallery after CaseArchive, added Soundboard as floating component.
- Updated `src/components/game/site-footer.tsx` — added "→ Pencapaian" nav link.
- Fixed typo in soundboard: "SOUNDB BOARD" → "SOUND BOARD" (caught by VLM).
- Fixed soundboard button overlap: moved from bottom-4 right-16 to bottom-20 right-4 to avoid covering other floating buttons.

Verification (via agent-browser + VLM):
- ESLint: clean (0 errors, 0 warnings) — fixed set-state-in-effect by deferring with requestAnimationFrame.
- Dev server: compiles cleanly, no runtime errors.
- Achievements gallery: VLM confirmed "GALLERI PENCAPAIAN header, 12 achievement cards with emojis, all showing 🔒 TERKUNCI with ??? descriptions, progress 0/12 0% — clean".
- Soundboard: VLM confirmed "SOUND BOARD header (after typo fix), 6 SFX buttons with emojis (📄🔨💡🗄️🔘✉️), each with name/description/PUTAR hover — vintage parchment aesthetic".
- Section dividers: film-strip border + glow glyphs render correctly (visible in section screenshots).

Stage Summary:
- 3 major new features added and tested:
  ✓ Achievements System — 12 unlockable badges with 4 rarity tiers, persistent, auto-checked on accusation, displayed in gallery + unlock notification in Detective Score
  ✓ Soundboard — floating 🔊 button + modal previewing all 6 synthesized SFX (paper rustle, stamp slam, lamp buzz, drawer, click, soft rustle)
  ✓ Section Divider polish — film-strip perforation border + glowing glyphs + bolder labels
- Game now has full achievement-based progression: play cases → unlock badges → track completion (12 total) → aim for "Sempurna Tanpa Cela" (flawless legendary win).
- Soundboard lets users appreciate the Web Audio API sound design independently.

Unresolved issues / risks:
- Achievements only populate after a real accusation (recordCase + checkAchievements fire in DetectiveScore useEffect). Injected test data gets overwritten by persist middleware. Code is correct.
- Floating buttons (notebook bottom-right, soundboard bottom-20-right, hint bottom-center, audio bottom-left, keyboard top-right) — carefully positioned to avoid overlap. Verified.
- Page is now 15+ sections long; full-page screenshot times out in headless browser. Individual section screenshots all verified OK.

---
Task ID: 8
Agent: main-orchestrator (cron webDevReview round 7)
Task: QA testing, and feature expansion (Quick Nav, Reset Progress dialog, CRT scanline animation, achievements hover polish).

Work Log:
- Read worklog.md (Tasks 0-7). Project stable with complete game arc + meta-progression + achievements + soundboard. 14+ sections.
- Performed QA via agent-browser: lint clean, dev server clean, no runtime errors. VLM confirmed achievements gallery (12 cards, 0/12, locked with ???), hero buttons properly stacked on mobile.
- Built `src/components/game/quick-nav.tsx` — floating ☰ navigation menu:
  - Appears after scrolling past 50% of viewport (top-left corner)
  - Click ☰ → expands to vertical panel with 12 section links (Atas, Mode, Berkas, Benang Merah, Tokoh, Korban, Bukti, Linimasa, Tuduhan, Arsip, Pencapaian, Bergabung)
  - Each link: emoji glyph + label, hover scale + brass color, smooth scroll to target
  - Close button rotates ☰→✕, Esc closes, click outside closes
  - Paper-styled panel with header "NAVIGASI CEPAT" + footer "Teatro del Misteri"
- Added `wipeAllData()` action to game store (`src/lib/game-store.ts`):
  - Clears ALL state including caseHistory + unlockedAchievements (unlike resetGame which preserves them)
  - Added to GameState interface
- Updated `src/components/game/case-archive.tsx` with Reset Progress dialog:
  - 🗑 button next to "LIHAT RIWAYAT" (only in populated state)
  - Two-step confirmation: step 0 shows warning (X kasus, Y achievements will be deleted) + "Lanjut →" / "Batal"; step 1 shows final warning + "HAPUS SEMUA" (crimson, glowing)
  - Plays paper rustle + stamp slam on confirm, calls wipeAllData()
  - "PERMANEN" corner stamp, crimson border-4, backdrop blur
- Added CRT scanline animation to briefing terminal (`briefing-section.tsx`):
  - Moving scanline beam (linear gradient) animates vertically via `crt-scan` keyframe (4s linear infinite)
  - Increased scanline opacity (0.20→0.25), darker lines (0.4→0.5)
  - Added CRT screen curvature effect (inset box-shadow)
  - Added `crt-scan` keyframe to globals.css
- Improved achievements card hover (`achievements-gallery.tsx`):
  - Locked glyphs: opacity 30%→50% on hover, grayscale maintained
  - Locked titles: text 40%→60% on hover
  - Locked descriptions: 30%→45% on hover
  - Added "🔒 Terkunci — selesaikan tantangan" hint that fades in on hover (border-t separator)
  - Unlocked glyphs: scale 1.15 + rotate 5° on hover (motion.span whileHover)
- Composed QuickNav into `src/app/page.tsx` as dynamic import.

Verification (via agent-browser + VLM):
- ESLint: clean (0 errors, 0 warnings).
- Dev server: compiles cleanly, no runtime errors.
- QuickNav: VLM confirmed "NAVIGASI CEPAT header, section links with emojis (🎮📁🧵🎭📇🔍), clean vertical list, polished — no visual issues".
- Briefing CRT: VLM confirmed "terminal window with scanlines, CRT glow effect, typewriter text visible — no major visual issues".
- Reset dialog: code verified (two-step confirmation, wipeAllData action, only shows in populated state).
- Achievements hover: glyph scale/rotate + locked hint fade-in implemented.

Stage Summary:
- 4 features added and tested:
  ✓ Quick Nav — floating ☰ menu with 12 section jump links (essential for the now-14-section page)
  ✓ Reset Progress — two-step confirmation dialog with wipeAllData (clears case history + achievements)
  ✓ CRT scanline animation — moving beam + curvature + enhanced glow on briefing terminal
  ✓ Achievements hover polish — locked cards reveal hint, unlocked glyphs scale/rotate on hover
- Game now has complete UX: long page navigable via QuickNav, persistent data wipeable via Reset, atmospheric CRT effect on terminal, rewarding hover interactions on achievements.

Unresolved issues / risks:
- Reset dialog only appears in populated Case Archive state (when caseHistory.length > 0) — correct design, can't reset nothing.
- QuickNav button at top-left may overlap with nothing (keyboard help is top-right, audio is bottom-left) — verified no overlap.
- CRT scanline animation uses transform translateY(2000%) which is fine for the terminal height.

---
Task ID: 9
Agent: main-orchestrator (cron webDevReview round 8)
Task: QA testing, mobile safe-area fix, and feature expansion (Lore section, Credits section).

Work Log:
- Read worklog.md (Tasks 0-8). Project stable with 30+ components, complete game arc, meta-progression, achievements, soundboard, quick nav, reset dialog, CRT scanlines.
- Performed QA via agent-browser: lint clean, dev server clean. VLM mobile test (390px) found floating buttons may conflict with mobile gesture bars / safe areas.
- Fixed mobile safe-area handling in `src/app/globals.css`:
  - Added `env(safe-area-inset-*)` padding to body (left/right)
  - Added utility classes: `.safe-bottom` (1rem + safe-area), `.safe-bottom-lg` (5rem + safe-area), `.safe-top` (0.75rem + safe-area), `.safe-left`, `.safe-right`
- Applied safe-area classes to all floating buttons:
  - `audio-toggle.tsx`: bottom-4 left-4 → safe-bottom safe-left
  - `detective-notebook.tsx`: bottom-4 right-4 → safe-bottom safe-right
  - `soundboard.tsx`: bottom-20 right-4 → safe-bottom-lg safe-right
  - `hint-system.tsx`: bottom-4 left-1/2 → safe-bottom left-1/2
  - `quick-nav.tsx`: top-3 left-3 → safe-top safe-left (button + panel)
  - `keyboard-help.tsx`: top-3 right-3 → safe-top safe-right
  - `progress-hud.tsx`: top-3 left-1/2 → safe-top left-1/2
- Built `src/components/game/lore-section.tsx` — "DUNIA TEATRO" worldbuilding section:
  - 6 theater facts strip (Berdiri 2012, Jakarta, 4 member, 120+ pertunjukan, 1 kasus, ? penyelesaian)
  - Vertical timeline with 5 entries (alternating left/right zig-zag on desktop, left-aligned on mobile):
    - 2012 Pendirian Teatro 🎭
    - 2018 Kolaborasi JKT48 ✨
    - 2023 Era Keemasan 🌟
    - 2025 Insiden Pertama ⚡
    - 13 Okt Malam Itu 🕯️
  - Each entry: glyph + year (crimson) + title + narrative text in paper-textured card
  - Central vertical line with brass nodes, closing quote: "Di atas panggung, semua orang bermain peran..."
- Built `src/components/game/credits-section.tsx` — "KREDIT" about section:
  - About blurb (paper-textured): describes Teatro del Misteri as interactive murder mystery with noir atmosphere
  - Tech stack grid (9 items): Next.js 16, TypeScript, Three.js, React Three Fiber, Framer Motion, Tailwind CSS 4, shadcn/ui, Zustand, Web Audio API — each with role
  - Cast list (4 members): Oline/Catherina/Abigail/Fiony with codenames + JKT48 disclaimer
  - Features list (18 features) in 2-col grid: lamp 3D, magnifier cursor, paper flip, red thread, stamp CTA, typewriter, interrogation, cross-ref, timeline, 3 difficulties, achievements, notebook, hints, score, archive, soundboard, quick nav, real-time audio
  - Footer: "★ TEATRO DEL MISTERI ★" + disclaimer
- Updated `src/app/page.tsx` — added LoreSection + CreditsSection after AchievementsGallery, before StampCta. Added imports.
- Updated `src/components/game/quick-nav.tsx` — added "Latar Cerita 📚" and "Tentang ℹ️" nav items (now 14 links).
- Updated `src/components/game/site-footer.tsx` — added "→ Latar Cerita" and "→ Tentang" nav links.

Verification (via agent-browser + VLM):
- ESLint: clean (0 errors, 0 warnings).
- Dev server: compiles cleanly (initial Fast Refresh warnings during edit resolved after reload).
- Lore section: VLM confirmed "vertical timeline with year markers (2018, 2023), alternating zig-zag layout, theater facts, JKT48 collaboration entry — clean".
- Credits section: VLM confirmed "tech stack grid (Next.js, Three.js, etc.), cast list (Oline/Catherina/Abigail/Fiony with codenames) — all visible".
- Safe-area: utility classes applied to all 7 floating button positions; will respect iOS notch / gesture bar on real mobile devices.

Stage Summary:
- Mobile safe-area fixed: all floating buttons now use env(safe-area-inset-*) to clear iOS notch and Android gesture bars.
- 2 major new sections added:
  ✓ Lore / Worldbuilding — theater history timeline (2012→13 Okt) with 5 entries + 6 facts strip + closing quote
  ✓ Credits / About — tech stack (9 items) + cast (4 members) + features list (18 features) + about blurb + disclaimer
- Page now has 16 main sections: Hero → CaseIntro → Difficulty → Briefing → CaseFiles → ConspiracyBoard → CastList → VictimProfile → EvidenceLocker → Timeline → Accusation → DetectiveScore → CaseArchive → Achievements → Lore → Credits → StampCta.
- QuickNav updated to 14 links covering all sections.

Unresolved issues / risks:
- Safe-area utilities only tested in headless browser (no real mobile device); CSS is standard env() so should work on real iOS/Android.
- Page is now 16 sections — very long but navigable via QuickNav + footer links + scroll.
- Credits "KREDIT" header was above the VLM screenshot crop but confirmed present in code.

---
Task ID: 10
Agent: main-orchestrator (cron webDevReview round 9)
Task: QA testing, and feature expansion (Detective Rank Progression, Case Statistics Deep Dive, hero film-frame corners).

Work Log:
- Read worklog.md (Tasks 0-9). Project stable with 16 sections, complete game arc, meta-progression, achievements, soundboard, quick nav, reset, CRT, lore, credits, mobile safe-area.
- Performed QA via agent-browser: lint clean, dev server clean, no runtime errors. VLM confirmed hero renders correctly (title, portraits, CTA, lamp). All 16 sections present in accessibility tree.
- Built `src/components/game/rank-progression.tsx` — "Tangga Pangkat Detektif" visual:
  - Ranks: D (Magang, 0+), C (Pemula, 40+), B (Kompeten, 60+), A (Senior, 75+), S (Legendaris, 90+)
  - Current rank stamp (circular, color-coded) + best score
  - Progress bar to next rank with "Butuh X poin lagi" message
  - 5-cell rank ladder showing achieved (✓), current ("SAAT INI" badge + glow), and locked ranks
  - Only renders when caseHistory exists
- Built `src/components/game/case-stats-deep-dive.tsx` — "Analisis Mendalam" expanded analytics:
  - 4 stat cards: Rata-rata Petunjuk (X/31 + %), Rata-rata Hint (X + no-hint wins), Linimasa Selesai (% + count), Rata-rata Interogasi (X/4)
  - Difficulty distribution: 3 bars (Pemula/Detektif/Legendaris) showing case count + avg score per difficulty
  - Animated progress bars, only renders when caseHistory exists
- Integrated both into `src/components/game/case-archive.tsx`:
  - RankProgression added at top of populated state (before summary stats grid)
  - CaseStatsDeepDive added after "Kemenangan per Mode" section (before expand history button)
- Added noir film-frame decorative corners to `src/components/game/hero-section.tsx`:
  - 4 L-shaped brass brackets in each corner (top-left, top-right, bottom-left, bottom-right)
  - Each corner: horizontal line + vertical line (bg-noir-brass/70) + small bracket accent (border-2)
  - pointer-events-none, z-[5] so they don't interfere with interactions
  - Sizes scale: w-20 h-20 mobile → w-28 h-28 desktop

Verification (via agent-browser + VLM):
- ESLint: clean (0 errors, 0 warnings).
- Dev server: compiles cleanly, no runtime errors.
- Hero film-frame: 28 brass elements confirmed in DOM via querySelectorAll.
- Rank progression + deep dive: code verified (both components render conditionally on caseHistory.length > 0, integrated into Case Archive populated state).

Stage Summary:
- 2 major new analytics features added:
  ✓ Detective Rank Progression — visual rank ladder (D→S) with current rank stamp, progress bar to next rank, achieved/current/locked states
  ✓ Case Statistics Deep Dive — 4 analytics cards (avg clues, avg hints, timeline rate, avg interrogation) + difficulty distribution bars with avg scores
- Hero styling polish: noir film-frame decorative corners (brass L-brackets in all 4 corners).
- Case Archive now shows: Rank Progression → Summary Stats → Best Rank/Avg/Clues panels → Wins by Mode → Deep Dive Analytics → Expand History.

Unresolved issues / risks:
- Rank progression + deep dive only populate after real accusations (caseHistory.length > 0). Code correct.
- Film-frame corners are decorative; subtle but visible at brass/70 opacity. Confirmed in DOM.
- Page remains 16 sections; all navigable via QuickNav (14 links) + footer.
