import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Clue {
  id: string;
  title: string;
  description: string;
  /** which suspect this clue implicates, if any */
  suspectId?: string;
  /** where it was found */
  source: string;
  /** emoji/icon glyph for the notebook */
  glyph: string;
  foundAt: number; // timestamp
}

export interface EvidenceItem {
  id: string;
  name: string;
  glyph: string;
  category: "fisik" | "digital" | "dokumen" | "biologis";
  description: string;
  detail: string; // revealed on close examination
  clueId: string; // the clue added to notebook when examined
  examined: boolean;
}

export const EVIDENCE_ITEMS: Omit<EvidenceItem, "examined">[] = [
  {
    id: "ev-glass",
    name: "Gelas Korban",
    glyph: "🥃",
    category: "fisik",
    description: "Gelas kristal dengan sisa cairan keemasan. Aroma pahit samar.",
    detail:
      "Di bawah cahaya lampu, residu lengket terlihat di dinding gelas. Bekas larutan tidak teridentifikasi — bukan minuman biasa. Ditemukan tepat di meja rias korban.",
    clueId: "clue-glass",
  },
  {
    id: "ev-usb",
    name: "Drive USB",
    glyph: "💾",
    category: "digital",
    description: "Flash drive hitam tanpa label. Terenkripsi penuh.",
    detail:
      "Sidik jari sebagian pada konektor. Log akses terakhir 02:14 — bertepatan dengan hilangnya rekaman studio. Drive ini berisi cadangan yang seharusnya sudah dihapus dari server.",
    clueId: "clue-usb",
  },
  {
    id: "ev-glove",
    name: "Sarung Tangan Lace",
    glyph: "🧤",
    category: "fisik",
    description: "Sarung tangan lace hitam, sebelah kiri. Robek di jari telunjuk.",
    detail:
      "Serat lace langka — bukan produksi massal. K robekan menunjukkan seseorang meraih benda tajam dengan tergesa. Helai rambut hitam menempel di dalam.",
    clueId: "clue-glove",
  },
  {
    id: "ev-letter",
    name: "Surat Tanpa Nama",
    glyph: "✉️",
    category: "dokumen",
    description: "Surat ancaman dengan tinta spidol merah. Meniru gaya tulisan tiga member.",
    detail:
      "Cap pos berasal dari kantor pos dekat studio rekaman — hanya tiga orang yang memiliki akses reguler ke area itu. Tinta mengandung zat pewarna langka yang dipakai seniman teater.",
    clueId: "clue-letter",
  },
  {
    id: "ev-watch",
    name: "Jam Tangan Korban",
    glyph: "⌚",
    category: "fisik",
    description: "Jam tangan berhenti tepat 23:17. Kaca retak.",
    detail:
      "Jam mekanik — berhenti karena benturan keras, bukan baterai habis. Sudut retakan menunjukkan korban terjatuh atau didorong. Waktu ini menjadi titik fokus kronologi.",
    clueId: "clue-watch",
  },
  {
    id: "ev-hair",
    name: "Helai Rambut",
    glyph: "🧬",
    category: "biologis",
    description: "Helai rambut hitam panjang di lokasi kejadian.",
    detail:
      "Analisis menunjukkan rambut diwarnai baru-baru ini — cocok dengan gaya salah satu member. Memar akar menunjukkan rambut dicabut dalam perjuangan, bukan rontok alami.",
    clueId: "clue-hair",
  },
];

export const CLUE_DEFS: Record<string, Omit<Clue, "foundAt">> = {
  "clue-glass": {
    id: "clue-glass",
    title: "Gelas Beracun",
    description: "Cairan tidak teridentifikasi ditemukan di gelas korban.",
    suspectId: undefined,
    source: "Loker Bukti #1",
    glyph: "🥃",
  },
  "clue-usb": {
    id: "clue-usb",
    title: "Drive Rahasia",
    description: "USB terenkripsi dengan sidik jari Fiony. Akses 02:14.",
    suspectId: "fiony",
    source: "Loker Bukti #2",
    glyph: "💾",
  },
  "clue-glove": {
    id: "clue-glove",
    title: "Sarung Tangan Pelaku",
    description: "Lace hitam dengan helai rambut korban. Robekan tajam.",
    suspectId: "abigail",
    source: "Loker Bukti #3",
    glyph: "🧤",
  },
  "clue-letter": {
    id: "clue-letter",
    title: "Surat Ancaman",
    description: "Tinta langka, meniru tulisan tiga member. Cap pos dekat studio.",
    suspectId: undefined,
    source: "Loker Bukti #4",
    glyph: "✉️",
  },
  "clue-watch": {
    id: "clue-watch",
    title: "Waktu Kematian",
    description: "Jam berhenti 23:17 karena benturan. Korban didorong.",
    suspectId: undefined,
    source: "Loker Bukti #5",
    glyph: "⌚",
  },
  "clue-hair": {
    id: "clue-hair",
    title: "Rambut Tersangka",
    description: "Rambut hitam diwarnai, dicabut dalam perjuangan.",
    suspectId: "oline",
    source: "Loker Bukti #6",
    glyph: "🧬",
  },
  // Interrogation statements — recorded during suspect interrogation
  "stmt-oline-alibi": {
    id: "stmt-oline-alibi",
    title: "Pernyataan Oline: Alibi",
    description: "Mengaku latihan solo tanpa saksi — tidak terverifikasi.",
    suspectId: "oline",
    source: "Interogasi",
    glyph: "🗣️",
  },
  "stmt-oline-motive": {
    id: "stmt-oline-motive",
    title: "Pernyataan Oline: Motif",
    description: "Menyangkal motif posisi center — terdengar berbohong.",
    suspectId: "oline",
    source: "Interogasi",
    glyph: "🗣️",
  },
  "stmt-oline-hair": {
    id: "stmt-oline-hair",
    title: "Pernyataan Oline: Rambut",
    description: "Menyangkal rambut di TKP — terdengar panik.",
    suspectId: "oline",
    source: "Interogasi",
    glyph: "🗣️",
  },
  "stmt-oline-cath": {
    id: "stmt-oline-cath",
    title: "Oline melihat Catherina berdebat",
    description: "Saksi: Catherina berdebat emosional dengan korban.",
    suspectId: "catherina",
    source: "Interogasi Oline",
    glyph: "👁️",
  },
  "stmt-cath-alibi": {
    id: "stmt-cath-alibi",
    title: "Pernyataan Catherina: Debat",
    description: "Menyebut debat 'hanya koreografi' — berbohong.",
    suspectId: "catherina",
    source: "Interogasi",
    glyph: "🗣️",
  },
  "stmt-cath-video": {
    id: "stmt-cath-video",
    title: "Pernyataan Catherina: Video",
    description: "Mengaku video bocor, klaim 'sudah menanganinya'.",
    suspectId: "catherina",
    source: "Interogasi",
    glyph: "🗣️",
  },
  "stmt-cath-parfum": {
    id: "stmt-cath-parfum",
    title: "Pernyataan Catherina: Parfum",
    description: "Tak bisa menjelaskan parfum di jas korban.",
    suspectId: "catherina",
    source: "Interogasi",
    glyph: "🗣️",
  },
  "stmt-cath-glove": {
    id: "stmt-cath-glove",
    title: "Pernyataan Catherina: Sarung Tangan",
    description: "Mengakui punya sarung tangan lace serupa — gugup.",
    suspectId: "catherina",
    source: "Interogasi",
    glyph: "🗣️",
  },
  "stmt-abigail-alibi": {
    id: "stmt-abigail-alibi",
    title: "Pernyataan Abigail: Telepon",
    description: "Alibi telepon ibu tidak terverifikasi.",
    suspectId: "abigail",
    source: "Interogasi",
    glyph: "🗣️",
  },
  "stmt-abigail-secret": {
    id: "stmt-abigail-secret",
    title: "Pernyataan Abigail: Rahasia",
    description: "Menolak membahas rahasia keluarga yang dikorban ketahui.",
    suspectId: "abigail",
    source: "Interogasi",
    glyph: "🗣️",
  },
  "stmt-abigail-photo": {
    id: "stmt-abigail-photo",
    title: "Pernyataan Abigail: Foto",
    description: "Mengakui menyobek foto keluarga — alasan diragukan.",
    suspectId: "abigail",
    source: "Interogasi",
    glyph: "🗣️",
  },
  "stmt-abigail-fiony": {
    id: "stmt-abigail-fiony",
    title: "Abigail melihat Fiony",
    description: "Saksi: Fiony terburu-buru membawa sesuatu di lorong.",
    suspectId: "fiony",
    source: "Interogasi Abigail",
    glyph: "👁️",
  },
  "stmt-fiony-alibi": {
    id: "stmt-fiony-alibi",
    title: "Pernyataan Fiony: Listrik",
    description: "Alibi 'listrik mati' — log tidak mendukung.",
    suspectId: "fiony",
    source: "Interogasi",
    glyph: "🗣️",
  },
  "stmt-fiony-usb": {
    id: "stmt-fiony-usb",
    title: "Pernyataan Fiony: USB",
    description: "Tak bisa menjelaskan isi USB berciri sidik jaranya.",
    suspectId: "fiony",
    source: "Interogasi",
    glyph: "🗣️",
  },
  "stmt-fiony-access": {
    id: "stmt-fiony-access",
    title: "Pernyataan Fiony: Server",
    description: "Menyangkal menghapus rekaman — motif penggantian dirinya.",
    suspectId: "fiony",
    source: "Interogasi",
    glyph: "🗣️",
  },
  "stmt-fiony-calendar": {
    id: "stmt-fiony-calendar",
    title: "Pernyataan Fiony: Kalender",
    description: "Tak menjelaskan lingkaran merah di kalender — berbohong.",
    suspectId: "fiony",
    source: "Interogasi",
    glyph: "🗣️",
  },
  // Timeline puzzle bonus clue
  "stmt-timeline": {
    id: "stmt-timeline",
    title: "Pola Kronologi Terungkap",
    description:
      "Linimasa lengkap menunjukkan jeda 9 menit (23:17→23:32) — waktu pelaku beraksi dan mematikan CCTV.",
    suspectId: undefined,
    source: "Rekonstruksi Linimasa",
    glyph: "🕐",
  },
  // Cross-reference reactions — when evidence is presented during interrogation
  "xref-oline-hair": {
    id: "xref-oline-hair",
    title: "Oline gugup saat rambut TKP ditunjukkan",
    description: "Mengenali rambut itu tapi tidak mau mengaku — sinyal keterlibatan.",
    suspectId: "oline",
    source: "Konfrontasi Bukti",
    glyph: "⚡",
  },
  "xref-oline-watch": {
    id: "xref-oline-watch",
    title: "Oline tak verifikasi keberadaan pukul 23:17",
    description: "Alibi panggung tanpa saksi bertepatan dengan waktu kematian korban.",
    suspectId: "oline",
    source: "Konfrontasi Bukti",
    glyph: "⚡",
  },
  "xref-cath-glove": {
    id: "xref-cath-glove",
    title: "Catherina mengakui sarung tangan lace mirip miliknya",
    description: "Sarung tangan di TKP terbukti mirip milik Catherina — dia gugup.",
    suspectId: "catherina",
    source: "Konfrontasi Bukti",
    glyph: "⚡",
  },
  "xref-cath-parfum": {
    id: "xref-cath-parfum",
    title: "Catherina tak menyangkal parfum di jas korban",
    description: "Parfum mawar Catherina ditemukan di jas korban — dia tak bisa menjelaskan.",
    suspectId: "catherina",
    source: "Konfrontasi Bukti",
    glyph: "⚡",
  },
  "xref-abigail-glove": {
    id: "xref-abigail-glove",
    title: "Abigail tak memiliki sarung tangan lace (jujur)",
    description: "Abigail jujur — lace bukan miliknya. Mengarah ke member lain.",
    suspectId: undefined,
    source: "Konfrontasi Bukti",
    glyph: "⚡",
  },
  "xref-abigail-letter": {
    id: "xref-abigail-letter",
    title: "Tinta surat ancaman dari studio seniman teater",
    description: "Abigail: tinta langka dari studio seniman teater — menunjuk panggung.",
    suspectId: undefined,
    source: "Konfrontasi Bukti",
    glyph: "⚡",
  },
  "xref-fiony-usb": {
    id: "xref-fiony-usb",
    title: "Fiony panik saat USB berciri sidik jaranya ditunjukkan",
    description: "USB di TKP berciri sidik jari Fiony — dia panik, klaim ditiru.",
    suspectId: "fiony",
    source: "Konfrontasi Bukti",
    glyph: "⚡",
  },
  "xref-fiony-watch": {
    id: "xref-fiony-watch",
    title: "Fiony tak bisa menjelaskan jeda 9 menit di log-nya",
    description: "Log listrik Fiony mati 23:32 — bertepatan dengan CCTV mati. Sembilan menit misterius.",
    suspectId: "fiony",
    source: "Konfrontasi Bukti",
    glyph: "⚡",
  },
};

// The canonical correct culprit for the accusation finale.
export const CULPRIT_ID = "catherina";

// Difficulty modes
export type Difficulty = "pemula" | "detektif" | "legendaris";

export interface DifficultyConfig {
  id: Difficulty;
  label: string;
  description: string;
  minClues: number; // minimum clues to unlock accusation
  hintCost: number; // score penalty per hint used
  scoreMultiplier: number; // final score multiplier
  showHints: boolean;
  icon: string;
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  pemula: {
    id: "pemula",
    label: "Pemula",
    description:
      "Petunjuk selalu diberikan. Cukup 3 petunjuk untuk menuduh. Cocok untuk penyelidik baru.",
    minClues: 3,
    hintCost: 5,
    scoreMultiplier: 0.8,
    showHints: true,
    icon: "🌱",
  },
  detektif: {
    id: "detektif",
    label: "Detektif",
    description:
      "Petunjuk terbatas. 6 petunjuk untuk menuduh. Pengalaman standar.",
    minClues: 6,
    hintCost: 10,
    scoreMultiplier: 1.0,
    showHints: true,
    icon: "🔍",
  },
  legendaris: {
    id: "legendaris",
    label: "Legendaris",
    description:
      "Tanpa petunjuk. Semua petunjuk harus dikumpulkan. Untuk detektif sejati.",
    minClues: 12,
    hintCost: 0,
    scoreMultiplier: 1.4,
    showHints: false,
    icon: "★",
  },
};

interface GameState {
  clues: Clue[];
  examinedEvidence: Record<string, boolean>;
  interrogatedSuspects: Record<string, boolean>;
  recordedStatements: Record<string, boolean>;
  notebookOpen: boolean;
  accusation: string | null; // suspect id if accused
  accusationResult: "pending" | "correct" | "wrong" | null;
  timelineSolved: boolean;
  difficulty: Difficulty | null; // null = not chosen yet
  hintsUsed: number;
  // persistent stats across games
  caseHistory: CaseRecord[];
  unlockedAchievements: string[];
  // actions
  examineEvidence: (evidenceId: string) => void;
  recordStatement: (clueId: string) => void;
  markInterrogated: (suspectId: string) => void;
  setTimelineSolved: (v: boolean) => void;
  setDifficulty: (d: Difficulty) => void;
  useHint: () => void;
  recordCase: (rec: CaseRecord) => void;
  unlockAchievements: (ids: string[]) => void;
  hasClue: (clueId: string) => boolean;
  toggleNotebook: (open?: boolean) => void;
  makeAccusation: (suspectId: string) => void;
  resetGame: () => void;
  wipeAllData: () => void;
  cluesCount: () => number;
}

export interface CaseRecord {
  id: string;
  date: number; // timestamp
  difficulty: Difficulty;
  accusedId: string;
  correct: boolean;
  score: number;
  rank: string;
  cluesFound: number;
  totalClues: number;
  hintsUsed: number;
  timelineSolved: boolean;
  suspectsInterrogated: number;
  durationMs?: number;
}

const TOTAL_CLUES = Object.keys(CLUE_DEFS).length;

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      clues: [],
      examinedEvidence: {},
      interrogatedSuspects: {},
      recordedStatements: {},
      notebookOpen: false,
      accusation: null,
      accusationResult: null,
      timelineSolved: false,
      difficulty: null,
      hintsUsed: 0,
      caseHistory: [],
      unlockedAchievements: [],
      examineEvidence: (evidenceId) => {
        const ev = EVIDENCE_ITEMS.find((e) => e.id === evidenceId);
        if (!ev) return;
        const state = get();
        if (state.examinedEvidence[evidenceId]) return;
        const clueDef = CLUE_DEFS[ev.clueId];
        const newClue: Clue = {
          ...clueDef,
          foundAt: Date.now(),
        };
        set({
          examinedEvidence: { ...state.examinedEvidence, [evidenceId]: true },
          clues: state.clues.some((c) => c.id === newClue.id)
            ? state.clues
            : [...state.clues, newClue],
        });
      },
      recordStatement: (clueId) => {
        const state = get();
        if (state.recordedStatements[clueId]) return;
        const clueDef = CLUE_DEFS[clueId];
        if (!clueDef) return;
        const newClue: Clue = { ...clueDef, foundAt: Date.now() };
        set({
          recordedStatements: { ...state.recordedStatements, [clueId]: true },
          clues: state.clues.some((c) => c.id === newClue.id)
            ? state.clues
            : [...state.clues, newClue],
        });
      },
      markInterrogated: (suspectId) => {
        const state = get();
        if (state.interrogatedSuspects[suspectId]) return;
        set({
          interrogatedSuspects: {
            ...state.interrogatedSuspects,
            [suspectId]: true,
          },
        });
      },
      setTimelineSolved: (v) => set({ timelineSolved: v }),
      setDifficulty: (d) => set({ difficulty: d }),
      useHint: () => set((s) => ({ hintsUsed: s.hintsUsed + 1 })),
      recordCase: (rec) =>
        set((s) => ({ caseHistory: [rec, ...s.caseHistory].slice(0, 20) })),
      unlockAchievements: (ids) =>
        set((s) => ({
          unlockedAchievements: [
            ...s.unlockedAchievements,
            ...ids.filter((id) => !s.unlockedAchievements.includes(id)),
          ],
        })),
      hasClue: (clueId) => get().clues.some((c) => c.id === clueId),
      toggleNotebook: (open) =>
        set((s) => ({ notebookOpen: open ?? !s.notebookOpen })),
      makeAccusation: (suspectId) => {
        set({
          accusation: suspectId,
          accusationResult: suspectId === CULPRIT_ID ? "correct" : "wrong",
        });
      },
      resetGame: () =>
        set((s) => ({
          clues: [],
          examinedEvidence: {},
          interrogatedSuspects: {},
          recordedStatements: {},
          notebookOpen: false,
          accusation: null,
          accusationResult: null,
          timelineSolved: false,
          difficulty: null,
          hintsUsed: 0,
          // keep caseHistory + achievements across resets
          caseHistory: s.caseHistory,
          unlockedAchievements: s.unlockedAchievements,
        })),
      wipeAllData: () =>
        set({
          clues: [],
          examinedEvidence: {},
          interrogatedSuspects: {},
          recordedStatements: {},
          notebookOpen: false,
          accusation: null,
          accusationResult: null,
          timelineSolved: false,
          difficulty: null,
          hintsUsed: 0,
          caseHistory: [],
          unlockedAchievements: [],
        }),
      cluesCount: () => get().clues.length,
    }),
    {
      name: "teatro-game-state",
      // only persist data, not transient UI flags
      partialize: (s) => ({
        clues: s.clues,
        examinedEvidence: s.examinedEvidence,
        interrogatedSuspects: s.interrogatedSuspects,
        recordedStatements: s.recordedStatements,
        accusation: s.accusation,
        accusationResult: s.accusationResult,
        timelineSolved: s.timelineSolved,
        difficulty: s.difficulty,
        hintsUsed: s.hintsUsed,
        caseHistory: s.caseHistory,
        unlockedAchievements: s.unlockedAchievements,
      }),
    }
  )
);

export const TOTAL_CLUE_COUNT = TOTAL_CLUES;
