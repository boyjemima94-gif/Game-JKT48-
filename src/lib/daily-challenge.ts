// Daily Challenge — a special daily variant with modifiers.
// Deterministic per-day (same for all players on the same date).
// Gives bonus score multiplier when completed.

export interface DailyModifier {
  id: string;
  title: string;
  description: string;
  glyph: string;
  effect: "no-notebook" | "extra-clues" | "time-pressure" | "evidence-scramble" | "double-or-nothing";
  scoreBonus: number; // multiplier bonus
}

// Generate deterministic modifier based on day-of-year
export function getDailyChallenge(date: Date = new Date()): {
  dateKey: string;
  modifiers: DailyModifier[];
  bonusMultiplier: number;
} {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  // Pick 2 modifiers deterministically based on dayOfYear
  const ALL_MODIFIERS: DailyModifier[] = [
    {
      id: "no-notebook",
      title: "Tanpa Buku Catatan",
      description:
        "Buku catatan dinonaktifkan. Kau harus mengingat semua petunjuk sendiri.",
      glyph: "📓",
      effect: "no-notebook",
      scoreBonus: 0.3,
    },
    {
      id: "extra-clues",
      title: "Petunjuk Berlimpah",
      description:
        "Semua bukti memberi 2 petunjuk alih-alih 1. Tapi minimum tuduhan naik ke 10.",
      glyph: "🔍",
      effect: "extra-clues",
      scoreBonus: 0.2,
    },
    {
      id: "time-pressure",
      title: "Tekanan Waktu",
      description: "Setiap petunjuk yang dipakai biayanya dua kali lipat. Hemat!",
      glyph: "⏰",
      effect: "time-pressure",
      scoreBonus: 0.25,
    },
    {
      id: "evidence-scramble",
      title: "Bukti Acak",
      description: "Urutan bukti di Loker Bukti diacak. Klasifikasi manual.",
      glyph: "🔀",
      effect: "evidence-scramble",
      scoreBonus: 0.2,
    },
    {
      id: "double-or-nothing",
      title: "Dua Kali Lipat atau Nol",
      description: "Tuduhan benar = skor 2x. Tuduhan salah = skor 0.",
      glyph: "🎲",
      effect: "double-or-nothing",
      scoreBonus: 0.5,
    },
  ];

  // Deterministic selection of 2 modifiers
  const idx1 = dayOfYear % ALL_MODIFIERS.length;
  const idx2 = (dayOfYear + 3) % ALL_MODIFIERS.length;
  const modifiers = [
    ALL_MODIFIERS[idx1],
    ALL_MODIFIERS[idx2 === idx1 ? (idx2 + 1) % ALL_MODIFIERS.length : idx2],
  ];

  const bonusMultiplier = 1 + modifiers.reduce((s, m) => s + m.scoreBonus, 0);

  return { dateKey, modifiers, bonusMultiplier };
}

export function isDailyCompleted(caseHistory: { date: number; difficulty: string }[], dateKey: string): boolean {
  // Check if a daily challenge was already completed today
  const today = new Date(dateKey);
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;
  return caseHistory.some(
    (c) => c.date >= todayStart && c.date < todayEnd && c.difficulty === "daily"
  );
}
