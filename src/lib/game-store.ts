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
};

// The canonical correct culprit for the accusation finale.
export const CULPRIT_ID = "catherina";

interface GameState {
  clues: Clue[];
  examinedEvidence: Record<string, boolean>;
  notebookOpen: boolean;
  accusation: string | null; // suspect id if accused
  accusationResult: "pending" | "correct" | "wrong" | null;
  // actions
  examineEvidence: (evidenceId: string) => void;
  hasClue: (clueId: string) => boolean;
  toggleNotebook: (open?: boolean) => void;
  makeAccusation: (suspectId: string) => void;
  resetGame: () => void;
  cluesCount: () => number;
}

const TOTAL_CLUES = Object.keys(CLUE_DEFS).length;

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      clues: [],
      examinedEvidence: {},
      notebookOpen: false,
      accusation: null,
      accusationResult: null,
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
        set({
          clues: [],
          examinedEvidence: {},
          notebookOpen: false,
          accusation: null,
          accusationResult: null,
        }),
      cluesCount: () => get().clues.length,
    }),
    {
      name: "teatro-game-state",
      // only persist data, not transient UI flags
      partialize: (s) => ({
        clues: s.clues,
        examinedEvidence: s.examinedEvidence,
        accusation: s.accusation,
        accusationResult: s.accusationResult,
      }),
    }
  )
);

export const TOTAL_CLUE_COUNT = TOTAL_CLUES;
