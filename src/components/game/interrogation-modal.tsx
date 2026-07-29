"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  INTERROGATIONS,
  TONE_META,
  type ResponseTone,
  type CrossRef,
} from "@/lib/interrogations";
import { SUSPECTS } from "@/lib/suspects";
import { useGame, EVIDENCE_ITEMS } from "@/lib/game-store";
import { playClick, playPaperRustle } from "@/lib/audio";

interface Props {
  suspectId: string | null;
  onClose: () => void;
}

export default function InterrogationModal({ suspectId, onClose }: Props) {
  const [askedIds, setAskedIds] = useState<Set<string>>(new Set());
  const [currentResponse, setCurrentResponse] = useState<{
    text: string;
    tone: ResponseTone;
    questionId: string;
  } | null>(null);
  const [typing, setTyping] = useState(false);
  const [showEvidenceTray, setShowEvidenceTray] = useState(false);
  const [crossRefResult, setCrossRefResult] = useState<{
    text: string;
    tone: ResponseTone;
    evidenceId: string;
  } | null>(null);

  const recordStatement = useGame((s) => s.recordStatement);
  const markInterrogated = useGame((s) => s.markInterrogated);
  const recordedStatements = useGame((s) => s.recordedStatements);
  const examinedEvidence = useGame((s) => s.examinedEvidence);

  const tree = suspectId ? INTERROGATIONS[suspectId] : null;
  const suspect = suspectId ? SUSPECTS.find((s) => s.id === suspectId) : null;

  // reset state when suspect changes
  useEffect(() => {
    setAskedIds(new Set());
    setCurrentResponse(null);
    setTyping(false);
    setShowEvidenceTray(false);
    setCrossRefResult(null);
  }, [suspectId]);

  // mark as interrogated when at least one question asked OR cross-ref done
  useEffect(() => {
    if (suspectId && (askedIds.size >= 1 || crossRefResult)) {
      markInterrogated(suspectId);
    }
  }, [suspectId, askedIds, crossRefResult, markInterrogated]);

  // evidence available for cross-reference (only examined ones relevant to this suspect)
  const availableCrossRefs = useMemo(() => {
    if (!tree?.crossRefs) return [];
    return tree.crossRefs.filter(
      (cr) =>
        examinedEvidence[cr.evidenceId] &&
        !recordedStatements[cr.recordsClueId ?? ""]
    );
  }, [tree, examinedEvidence, recordedStatements]);

  // total possible cross-refs (whether examined or not) — for display
  const totalCrossRefs = tree?.crossRefs?.length ?? 0;
  const examinedCrossRefs = useMemo(() => {
    if (!tree?.crossRefs) return 0;
    return tree.crossRefs.filter(
      (cr) => examinedEvidence[cr.evidenceId]
    ).length;
  }, [tree, examinedEvidence]);

  const presentEvidence = (cr: CrossRef) => {
    playClick();
    setShowEvidenceTray(false);
    setTyping(true);
    setCrossRefResult(null);
    const fullText = cr.reaction;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCrossRefResult({
        text: fullText.slice(0, i),
        tone: cr.tone,
        evidenceId: cr.evidenceId,
      });
      if (i >= fullText.length) {
        clearInterval(interval);
        setTyping(false);
        if (cr.recordsClueId) {
          recordStatement(cr.recordsClueId);
          playPaperRustle(0.4, 0.4);
        }
      }
    }, 20);
  };

  // which questions are available: root questions + unlocked ones
  const availableQuestions = useMemo(() => {
    if (!tree) return [];
    return tree.questions.filter((q) => {
      // available if not asked AND (has no prerequisite OR its prereq was asked)
      // we treat unlocks: a question is available if it's a "root" (no other question unlocks it)
      // or if the question that unlocks it has been asked.
      const isRoot = !tree.questions.some((other) =>
        other.unlocks?.includes(q.id)
      );
      if (isRoot) return !askedIds.has(q.id);
      const unlocker = tree.questions.find((other) =>
        other.unlocks?.includes(q.id)
      );
      return unlocker && askedIds.has(unlocker.id) && !askedIds.has(q.id);
    });
  }, [tree, askedIds]);

  const askQuestion = (questionId: string) => {
    if (!tree) return;
    const q = tree.questions.find((x) => x.id === questionId);
    if (!q) return;
    playClick();
    setAskedIds((prev) => new Set(prev).add(questionId));
    setTyping(true);
    setCurrentResponse(null);

    // typewriter for response
    const fullText = q.response.text;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCurrentResponse({
        text: fullText.slice(0, i),
        tone: q.response.tone,
        questionId,
      });
      if (i >= fullText.length) {
        clearInterval(interval);
        setTyping(false);
        // record statement to notebook
        if (q.response.recordsClueId) {
          recordStatement(q.response.recordsClueId);
          playPaperRustle(0.4, 0.4);
        }
      }
    }, 18);
  };

  const greetingTone = tree?.greetingTone;
  const greetingMeta = greetingTone ? TONE_META[greetingTone] : null;

  return (
    <AnimatePresence>
      {tree && suspect && (
        <motion.div
          className="fixed inset-0 z-[92] flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-noir-ink/95 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.92, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-noir-coal border-2 border-noir-umber/70 shadow-[0_30px_80px_rgba(0,0,0,0.9)]"
          >
            {/* header — interrogation room bar */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-noir-umber/60 bg-noir-coffee/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-noir-crimson animate-pulse" />
                <span className="font-stamp text-[10px] tracking-[0.3em] text-noir-crimson uppercase font-bold">
                  ● REC
                </span>
              </div>
              <span className="font-typewriter text-[10px] sm:text-[11px] tracking-widest text-noir-brass/80 uppercase">
                Ruang Interogasi · {suspect.codename}
              </span>
              <button
                onClick={onClose}
                data-cursor-active
                aria-label="Tutup interogasi"
                className="ml-auto w-8 h-8 flex items-center justify-center text-noir-paper/60 hover:text-noir-crimson transition-colors font-stamp text-lg border border-noir-paper/20 rounded"
              >
                ✕
              </button>
            </div>

            {/* body — two-pane on desktop */}
            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
              {/* suspect pane */}
              <div className="md:w-56 shrink-0 p-4 border-b md:border-b-0 md:border-r border-noir-umber/50 bg-noir-ink/40">
                <div className="w-24 h-32 mx-auto md:mx-0 border-2 border-noir-umber/60 overflow-hidden mb-3">
                  <img
                    src={suspect.portrait}
                    alt={suspect.name}
                    className="w-full h-full object-cover suspect-portrait"
                  />
                </div>
                <p className="font-stamp text-sm font-black text-noir-paper text-center md:text-left">
                  {suspect.name}
                </p>
                <p className="font-typewriter text-[10px] text-noir-brass tracking-widest text-center md:text-left">
                  {suspect.codename}
                </p>
                <p className="font-typewriter text-[10px] text-noir-paper/50 mt-1 text-center md:text-left">
                  {suspect.role}
                </p>
                <div className="mt-3 pt-3 border-t border-noir-umber/40">
                  <p className="font-stamp text-[9px] tracking-widest text-noir-brass/70 uppercase mb-1">
                    Status
                  </p>
                  <p className="font-typewriter text-[10px] text-noir-paper/70">
                    {askedIds.size} / {tree.questions.length} pertanyaan
                  </p>
                  <div className="flex gap-1 mt-1.5">
                    {tree.questions.map((q, i) => (
                      <span
                        key={q.id}
                        className={`flex-1 h-1.5 rounded-full transition-colors ${
                          askedIds.has(q.id)
                            ? "bg-noir-brass"
                            : "bg-noir-paper/15"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* dialogue pane */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3 min-h-[320px]">
                {/* greeting */}
                <div className="border-l-2 border-noir-brass/60 pl-3 py-1">
                  <p className="font-stamp text-[9px] tracking-widest text-noir-brass/70 uppercase mb-0.5">
                    {suspect.name.split(" ")[0]}:
                  </p>
                  <p className="font-typewriter text-sm text-noir-paper/90 italic">
                    &ldquo;{tree.greeting}&rdquo;
                  </p>
                  {greetingMeta && (
                    <span
                      className={`inline-block mt-1 px-1.5 py-0.5 border ${greetingMeta.bg} ${greetingMeta.color} font-stamp text-[8px] tracking-widest font-bold`}
                    >
                      {greetingMeta.icon} {greetingMeta.label}
                    </span>
                  )}
                </div>

                {/* current response */}
                <AnimatePresence mode="wait">
                  {currentResponse && (
                    <motion.div
                      key={currentResponse.questionId + typing}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border-l-2 border-noir-crimson pl-3 py-1"
                    >
                      <p className="font-stamp text-[9px] tracking-widest text-noir-crimson/70 uppercase mb-0.5">
                        {suspect.name.split(" ")[0]} menjawab:
                      </p>
                      <p className="font-typewriter text-sm text-noir-paper/90 leading-relaxed">
                        &ldquo;{currentResponse.text}&rdquo;
                        {typing && <span className="caret" />}
                      </p>
                      {!typing && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`inline-block px-1.5 py-0.5 border ${
                              TONE_META[currentResponse.tone].bg
                            } ${TONE_META[currentResponse.tone].color} font-stamp text-[8px] tracking-widest font-bold`}
                          >
                            {TONE_META[currentResponse.tone].icon}{" "}
                            {TONE_META[currentResponse.tone].label}
                          </span>
                          {currentResponse &&
                            (() => {
                              const q = tree.questions.find(
                                (x) => x.id === currentResponse.questionId
                              );
                              if (
                                q?.response.recordsClueId &&
                                recordedStatements[q.response.recordsClueId]
                              ) {
                                return (
                                  <span className="font-stamp text-[8px] tracking-widest text-noir-brass">
                                    ✓ DICATAT
                                  </span>
                                );
                              }
                              return null;
                            })()}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* cross-reference result */}
                <AnimatePresence mode="wait">
                  {crossRefResult && (
                    <motion.div
                      key={crossRefResult.evidenceId + typing}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border-l-2 border-noir-tungsten pl-3 py-1 bg-noir-tungsten/5"
                    >
                      <p className="font-stamp text-[9px] tracking-widest text-noir-tungsten uppercase mb-0.5 flex items-center gap-1.5">
                        ⚡ KONFRONTASI BUKTI:
                      </p>
                      <p className="font-typewriter text-sm text-noir-paper/90 leading-relaxed">
                        &ldquo;{crossRefResult.text}&rdquo;
                        {typing && <span className="caret" />}
                      </p>
                      {!typing && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`inline-block px-1.5 py-0.5 border ${
                              TONE_META[crossRefResult.tone].bg
                            } ${TONE_META[crossRefResult.tone].color} font-stamp text-[8px] tracking-widest font-bold`}
                          >
                            {TONE_META[crossRefResult.tone].icon}{" "}
                            {TONE_META[crossRefResult.tone].label}
                          </span>
                          {(() => {
                            const cr = tree.crossRefs?.find(
                              (c) => c.evidenceId === crossRefResult.evidenceId
                            );
                            if (
                              cr?.recordsClueId &&
                              recordedStatements[cr.recordsClueId]
                            ) {
                              return (
                                <span className="font-stamp text-[8px] tracking-widest text-noir-brass">
                                  ✓ DICATAT
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* question options */}
                <div className="mt-auto pt-3 border-t border-noir-umber/40 space-y-2">
                  <p className="font-stamp text-[9px] tracking-widest text-noir-brass/70 uppercase">
                    {availableQuestions.length > 0
                      ? "Pertanyaan tersedia:"
                      : askedIds.size >= tree.questions.length
                      ? "Semua pertanyaan telah diajukan."
                      : "Ajukan pertanyaan untuk membuka lebih banyak."}
                  </p>
                  {availableQuestions.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => askQuestion(q.id)}
                      data-cursor-active
                      className="block w-full text-left px-3 py-2 border border-noir-umber/50 hover:border-noir-brass hover:bg-noir-brass/10 transition-colors group"
                    >
                      <span className="font-typewriter text-xs sm:text-sm text-noir-paper/80 group-hover:text-noir-brass">
                        <span className="text-noir-crimson mr-1.5">▸</span>
                        {q.prompt}
                      </span>
                    </button>
                  ))}
                </div>

                {/* present evidence (cross-reference) */}
                {tree.crossRefs && tree.crossRefs.length > 0 && (
                  <div className="pt-3 border-t border-noir-tungsten/30">
                    {showEvidenceTray ? (
                      <div className="space-y-2">
                        <p className="font-stamp text-[9px] tracking-widest text-noir-tungsten uppercase">
                          ⚡ Konfrontasi dengan Bukti:
                        </p>
                        {availableCrossRefs.length === 0 ? (
                          <p className="font-typewriter text-[11px] text-noir-paper/50 italic">
                            {examinedCrossRefs === 0
                              ? "Belum ada bukti yang kau periksa untuk dikonfrontasi. Periksa bukti di Loker Bukti dulu."
                              : examinedCrossRefs < totalCrossRefs
                              ? `Hanya ${examinedCrossRefs}/${totalCrossRefs} bukti relevan yang diperiksa. Periksa lebih banyak.`
                              : "Semua bukti yang relevan telah dikonfrontasi."}
                          </p>
                        ) : (
                          <div className="space-y-1.5">
                            {availableCrossRefs.map((cr) => {
                              const ev = EVIDENCE_ITEMS.find(
                                (e) => e.id === cr.evidenceId
                              );
                              if (!ev) return null;
                              return (
                                <button
                                  key={cr.evidenceId}
                                  onClick={() => presentEvidence(cr)}
                                  data-cursor-active
                                  className="block w-full text-left px-3 py-2 border border-noir-tungsten/50 hover:border-noir-tungsten hover:bg-noir-tungsten/10 transition-colors group"
                                >
                                  <span className="font-typewriter text-xs text-noir-paper/80 group-hover:text-noir-tungsten flex items-center gap-2">
                                    <span className="text-lg">{ev.glyph}</span>
                                    <span>
                                      Tunjukkan <strong>{ev.name}</strong>
                                    </span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                        <button
                          onClick={() => setShowEvidenceTray(false)}
                          data-cursor-active
                          className="font-typewriter text-[10px] text-noir-paper/40 hover:text-noir-paper/70 transition-colors"
                        >
                          ↑ tutup bukti
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          playClick();
                          setShowEvidenceTray(true);
                        }}
                        data-cursor-active
                        className="w-full px-3 py-2 border border-noir-tungsten/40 hover:border-noir-tungsten hover:bg-noir-tungsten/10 transition-colors flex items-center justify-center gap-2 group"
                      >
                        <span className="text-base">⚡</span>
                        <span className="font-stamp text-[10px] tracking-widest text-noir-tungsten uppercase">
                          Konfrontasi Bukti
                        </span>
                        {availableCrossRefs.length > 0 && (
                          <span className="font-typewriter text-[9px] text-noir-paper/40">
                            ({availableCrossRefs.length} tersedia)
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* footer */}
            <div className="px-4 sm:px-5 py-2.5 border-t border-noir-umber/60 bg-noir-coffee/40 flex items-center justify-between">
              <span className="font-typewriter text-[10px] text-noir-paper/50">
                {askedIds.size > 0
                  ? `Pernyataan dicatat di buku catatan.`
                  : "Ajukan pertanyaan untuk merekam pernyataan."}
              </span>
              <button
                onClick={onClose}
                data-cursor-active
                className="font-stamp text-[11px] tracking-widest text-noir-ink bg-noir-brass hover:bg-noir-tungsten transition-colors px-4 py-1.5"
              >
                AKHIRI INTEROGASI →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
