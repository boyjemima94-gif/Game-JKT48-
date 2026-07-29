// Achievements system — unlockable badges for completing specific challenges.
// Achievements are checked after each accusation and persisted in game store.

export interface Achievement {
  id: string;
  title: string;
  description: string;
  glyph: string;
  /** check function — returns true if this achievement is unlocked given the case record + history */
  check: (ctx: AchievementContext) => boolean;
  /** rarity for display */
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface AchievementContext {
  correct: boolean;
  score: number;
  rank: string;
  difficulty: string;
  cluesFound: number;
  totalClues: number;
  hintsUsed: number;
  timelineSolved: boolean;
  suspectsInterrogated: number;
  totalSuspects: number;
  casesPlayed: number;
  wins: number;
  perfectAccusations: number; // wins with 0 hints
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-case",
    title: "Detektif Baru",
    description: "Selesaikan kasus pertamamu.",
    glyph: "🎯",
    rarity: "common",
    check: (ctx) => ctx.casesPlayed >= 1,
  },
  {
    id: "first-win",
    title: "Kasus Terpecahkan",
    description: "Menangkan kasus pertamamu dengan tuduhan yang benar.",
    glyph: "✓",
    rarity: "common",
    check: (ctx) => ctx.wins >= 1,
  },
  {
    id: "perfect-no-hints",
    title: "Tanpa Bantuan",
    description: "Menang tanpa menggunakan petunjuk apa pun.",
    glyph: "🧠",
    rarity: "rare",
    check: (ctx) => ctx.correct && ctx.hintsUsed === 0,
  },
  {
    id: "all-clues",
    title: "Penyelidik Sempurna",
    description: "Temukan semua petunjuk dalam satu kasus.",
    glyph: "🔍",
    rarity: "epic",
    check: (ctx) => ctx.cluesFound >= ctx.totalClues,
  },
  {
    id: "all-suspects",
    title: "Interogator Ulung",
    description: "Interogasi semua tersangka dalam satu kasus.",
    glyph: "🗣️",
    rarity: "rare",
    check: (ctx) => ctx.suspectsInterrogated >= ctx.totalSuspects,
  },
  {
    id: "timeline-master",
    title: "Ahli Kronologi",
    description: "Selesaikan Rekonstruksi Linimasa dengan benar.",
    glyph: "🕐",
    rarity: "rare",
    check: (ctx) => ctx.timelineSolved,
  },
  {
    id: "rank-s",
    title: "Detektif Legendaris",
    description: "Raih pangkat S dalam satu kasus.",
    glyph: "★",
    rarity: "legendary",
    check: (ctx) => ctx.rank === "S",
  },
  {
    id: "legend-mode-win",
    title: "Tanpa Ampun",
    description: "Menang dalam mode Legendaris.",
    glyph: "💀",
    rarity: "legendary",
    check: (ctx) => ctx.correct && ctx.difficulty === "legendaris",
  },
  {
    id: "speed-run",
    title: "Detektif Kilat",
    description: "Menang dengan kurang dari 5 petunjuk (mode Pemula).",
    glyph: "⚡",
    rarity: "rare",
    check: (ctx) => ctx.correct && ctx.cluesFound < 5 && ctx.difficulty === "pemula",
  },
  {
    id: "five-wins",
    title: "Veteran Teatro",
    description: "Menangkan 5 kasus total.",
    glyph: "🏆",
    rarity: "epic",
    check: (ctx) => ctx.wins >= 5,
  },
  {
    id: "ten-cases",
    title: "Sang Detektif",
    description: "Selesaikan 10 kasus total (menang atau kalah).",
    glyph: "📋",
    rarity: "epic",
    check: (ctx) => ctx.casesPlayed >= 10,
  },
  {
    id: "flawless",
    title: "Sempurna Tanpa Cela",
    description: "Menang dengan pangkat S, semua petunjuk, tanpa hint, linimasa selesai.",
    glyph: "💎",
    rarity: "legendary",
    check: (ctx) =>
      ctx.correct &&
      ctx.rank === "S" &&
      ctx.cluesFound >= ctx.totalClues &&
      ctx.hintsUsed === 0 &&
      ctx.timelineSolved,
  },
];

export const RARITY_META: Record<
  Achievement["rarity"],
  { label: string; color: string; border: string; glow: string }
> = {
  common: {
    label: "UMUM",
    color: "text-noir-paper/70",
    border: "border-noir-paper/30",
    glow: "rgba(232,220,192,0.2)",
  },
  rare: {
    label: "LANGKA",
    color: "text-cyan-400",
    border: "border-cyan-500/50",
    glow: "rgba(34,211,238,0.3)",
  },
  epic: {
    label: "EPIK",
    color: "text-purple-400",
    border: "border-purple-500/50",
    glow: "rgba(192,132,252,0.3)",
  },
  legendary: {
    label: "LEGGENDARIS",
    color: "text-noir-brass",
    border: "border-noir-brass",
    glow: "rgba(201,163,90,0.4)",
  },
};

/** Check all achievements given a context, return list of newly-unlocked IDs */
export function checkAchievements(
  ctx: AchievementContext,
  alreadyUnlocked: string[]
): string[] {
  return ACHIEVEMENTS.filter(
    (a) => a.check(ctx) && !alreadyUnlocked.includes(a.id)
  ).map((a) => a.id);
}
