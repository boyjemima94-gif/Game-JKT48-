"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, DIFFICULTIES, type CaseRecord } from "@/lib/game-store";
import { SUSPECTS } from "@/lib/suspects";
import { playClick } from "@/lib/audio";

const RANK_COLORS: Record<string, string> = {
  S: "text-noir-brass",
  A: "text-noir-tungsten",
  B: "text-green-400",
  C: "text-orange-400",
  D: "text-noir-crimson",
};

/**
 * Case Archive — persistent statistics dashboard showing play history,
 * best scores, ranks achieved, and aggregate stats across all cases.
 */
export default function CaseArchive() {
  const caseHistory = useGame((s) => s.caseHistory);
  const [expanded, setExpanded] = useState(false);
  const stats = useMemo(() => {
    if (caseHistory.length === 0) {
      return {
        totalCases: 0,
        wins: 0,
        losses: 0,
        bestScore: 0,
        bestRank: "—",
        avgScore: 0,
        totalCluesFound: 0,
        totalHintsUsed: 0,
        winsByDifficulty: {} as Record<string, number>,
      };
    }
    const wins = caseHistory.filter((c) => c.correct);
    const bestScore = Math.max(...caseHistory.map((c) => c.score));
    const bestRank =
      wins.find((c) => c.score === bestScore)?.rank ?? "—";
    const avgScore = Math.round(
      caseHistory.reduce((s, c) => s + c.score, 0) / caseHistory.length
    );
    const totalCluesFound = caseHistory.reduce(
      (s, c) => s + c.cluesFound,
      0
    );
    const totalHintsUsed = caseHistory.reduce(
      (s, c) => s + c.hintsUsed,
      0
    );
    const winsByDifficulty: Record<string, number> = {};
    wins.forEach((w) => {
      winsByDifficulty[w.difficulty] =
        (winsByDifficulty[w.difficulty] ?? 0) + 1;
    });
    return {
      totalCases: caseHistory.length,
      wins: wins.length,
      losses: caseHistory.length - wins.length,
      bestScore,
      bestRank,
      avgScore,
      totalCluesFound,
      totalHintsUsed,
      winsByDifficulty,
    };
  }, [caseHistory]);

  const suspectName = (id: string) =>
    SUSPECTS.find((s) => s.id === id)?.name ?? id;

  const winRate =
    stats.totalCases > 0
      ? Math.round((stats.wins / stats.totalCases) * 100)
      : 0;

  return (
    <section
      id="arsip"
      className="relative py-16 sm:py-20 px-4 sm:px-6"
      aria-label="Arsip Kasus"
    >
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-stamp text-xs tracking-[0.4em] text-noir-brass uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            · Arsip Penyelidikan ·
          </span>
          <h2
            className="font-stamp text-3xl sm:text-5xl font-black text-noir-paper mt-3 mb-3"
            style={{
              textShadow:
                "0 0 24px rgba(255,179,71,0.25), 0 4px 12px rgba(0,0,0,0.9)",
            }}
          >
            REKAM JEJAK DETEKTIF
          </h2>
          <p className="font-typewriter text-sm text-noir-paper/70 max-w-lg mx-auto">
            Statistik penyelidikanmu tercatat permanen — bahkan setelah memulai
            kasus baru.
          </p>
        </motion.div>

        {stats.totalCases === 0 ? (
          /* empty state */
          <div className="paper-texture paper-edge paper-burn p-8 sm:p-10 text-center max-w-xl mx-auto">
            <div className="text-5xl mb-4 opacity-50">📂</div>
            <p className="font-stamp text-lg font-black text-noir-paper-ink mb-2">
              BELUM ADA ARSIP
            </p>
            <p className="font-typewriter text-xs text-noir-paper-ink/60 max-w-sm mx-auto">
              Selesaikan kasus pertamamu untuk mulai mengisi arsip. Statistik
              akan muncul di sini.
            </p>
            <a
              href="#mode"
              data-cursor-active
              className="inline-block mt-5 font-stamp text-[11px] tracking-widest text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-colors px-4 py-2"
            >
              → MULAI KASUS
            </a>
          </div>
        ) : (
          <>
            {/* summary stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <StatCard
                label="Kasus Selesai"
                value={String(stats.totalCases)}
                icon="📋"
                accent="text-noir-brass"
              />
              <StatCard
                label="Kasus Terpecahkan"
                value={`${stats.wins}/${stats.totalCases}`}
                icon="✓"
                accent="text-green-400"
              />
              <StatCard
                label="Tingkat Menang"
                value={`${winRate}%`}
                icon="⚖"
                accent={winRate >= 50 ? "text-green-400" : "text-orange-400"}
              />
              <StatCard
                label="Skor Terbaik"
                value={String(stats.bestScore)}
                icon="★"
                accent={RANK_COLORS[stats.bestRank] ?? "text-noir-brass"}
              />
            </div>

            {/* best rank + avg */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
              <div className="paper-texture paper-edge p-4 text-center">
                <p className="font-stamp text-[10px] tracking-widest text-noir-paper-ink/60 uppercase mb-1">
                  Pangkat Terbaik
                </p>
                <p
                  className={`font-stamp text-4xl font-black ${
                    RANK_COLORS[stats.bestRank] ?? "text-noir-paper-ink"
                  }`}
                >
                  {stats.bestRank}
                </p>
              </div>
              <div className="paper-texture paper-edge p-4 text-center">
                <p className="font-stamp text-[10px] tracking-widest text-noir-paper-ink/60 uppercase mb-1">
                  Skor Rata-rata
                </p>
                <p className="font-stamp text-4xl font-black text-noir-paper-ink">
                  {stats.avgScore}
                </p>
              </div>
              <div className="paper-texture paper-edge p-4 text-center">
                <p className="font-stamp text-[10px] tracking-widest text-noir-paper-ink/60 uppercase mb-1">
                  Petunjuk Ditemukan
                </p>
                <p className="font-stamp text-4xl font-black text-noir-paper-ink">
                  {stats.totalCluesFound}
                </p>
              </div>
            </div>

            {/* wins by difficulty */}
            <div className="paper-texture paper-edge p-4 sm:p-5 mb-6">
              <p className="font-stamp text-[10px] tracking-widest text-noir-crimson font-bold uppercase mb-3 pb-2 border-b border-noir-paper-ink/20">
                Kemenangan per Mode
              </p>
              <div className="grid grid-cols-3 gap-3">
                {(["pemula", "detektif", "legendaris"] as const).map((d) => {
                  const cfg = DIFFICULTIES[d];
                  const count = stats.winsByDifficulty[d] ?? 0;
                  return (
                    <div
                      key={d}
                      className="text-center border border-noir-paper-ink/20 p-2"
                    >
                      <div className="text-xl mb-1">{cfg.icon}</div>
                      <p className="font-stamp text-xs font-bold text-noir-paper-ink">
                        {cfg.label}
                      </p>
                      <p className="font-stamp text-2xl font-black text-noir-brass">
                        {count}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* expand history */}
            <button
              onClick={() => {
                playClick();
                setExpanded(!expanded);
              }}
              data-cursor-active
              className="w-full py-3 font-stamp text-xs tracking-widest uppercase text-noir-brass border border-noir-brass/40 hover:border-noir-brass hover:bg-noir-brass/10 transition-colors"
            >
              {expanded ? "▲ TUTUP RIWAYAT" : "▼ LIHAT RIWAYAT LENGKAP"}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="paper-texture paper-edge p-4 sm:p-5 mt-3 space-y-2 max-h-[400px] overflow-y-auto">
                    <p className="font-stamp text-[10px] tracking-widest text-noir-crimson font-bold uppercase mb-2 sticky top-0 bg-noir-paper py-1">
                      Riwayat ({caseHistory.length} kasus)
                    </p>
                    {caseHistory.map((c, i) => (
                      <CaseHistoryRow
                        key={c.id}
                        record={c}
                        index={i}
                        suspectName={suspectName(c.accusedId)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: string;
  accent: string;
}) {
  return (
    <div className="paper-texture paper-edge p-3 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <p className={`font-stamp text-2xl font-black ${accent}`}>{value}</p>
      <p className="font-typewriter text-[9px] tracking-widest text-noir-paper-ink/60 uppercase">
        {label}
      </p>
    </div>
  );
}

function CaseHistoryRow({
  record,
  index,
  suspectName,
}: {
  record: CaseRecord;
  index: number;
  suspectName: string;
}) {
  const cfg = DIFFICULTIES[record.difficulty];
  const date = new Date(record.date);
  return (
    <div className="flex items-center gap-3 p-2 border border-noir-paper-ink/15 bg-noir-paper/20 text-[11px]">
      <span className="font-stamp text-noir-paper-ink/40 w-6 text-center">
        #{String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-base">{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-stamp font-bold text-noir-paper-ink truncate">
          {suspectName}
        </p>
        <p className="font-typewriter text-[9px] text-noir-paper-ink/50">
          {date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          · {cfg.label}
        </p>
      </div>
      <div className="text-center">
        <p
          className={`font-stamp text-lg font-black ${
            record.correct ? "text-green-600" : "text-noir-crimson"
          }`}
        >
          {record.rank}
        </p>
      </div>
      <div className="text-center min-w-[40px]">
        <p className="font-stamp text-sm font-bold text-noir-paper-ink">
          {record.score}
        </p>
        <p className="font-typewriter text-[8px] text-noir-paper-ink/50">
          skor
        </p>
      </div>
      <span
        className={`px-1.5 py-0.5 font-stamp text-[9px] font-bold border ${
          record.correct
            ? "border-green-600 text-green-600"
            : "border-noir-crimson text-noir-crimson"
        }`}
      >
        {record.correct ? "✓ MENANG" : "✗ KALAH"}
      </span>
    </div>
  );
}
