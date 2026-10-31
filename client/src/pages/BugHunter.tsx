import React, { useState, useEffect } from 'react';
import {
  Bug,
  ShieldAlert,
  CheckCircle2,
  FileCode,
  Terminal,
  Zap,
  Sparkles,
  RotateCcw,
  GitCompare,
  ArrowRight
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';
import { sound } from '../services/soundEffects';

interface CodeSnippet {
  id: string;
  file: string;
  language: string;
  code: string;
  fixedCode: string;
  bugs: Array<{ line: number; type: string; message: string }>;
  difficulty: string;
  xpReward: number;
}

export const BugHunter: React.FC = () => {
  const { setPendingManifest } = useGame();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [appliedPatches, setAppliedPatches] = useState<Array<{ snippetId: string; file: string; fixes: string[] }>>([]);
  const [showDiff, setShowDiff] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    try {
      const res = await api.getCodeSnippets();
      if (res?.snippets) {
        setSnippets(res.snippets);
      }
    } catch (e) {
      // ignore
    }
  };

  const currentSnippet = snippets[currentIndex];

  const handleFixBug = () => {
    if (!currentSnippet) return;
    sound.playScore();
    setScore(prev => prev + currentSnippet.xpReward);

    const nextApplied = [
      ...appliedPatches,
      {
        snippetId: currentSnippet.id,
        file: currentSnippet.file,
        fixes: currentSnippet.bugs.map(b => b.message)
      }
    ];
    setAppliedPatches(nextApplied);

    if (currentIndex + 1 >= snippets.length) {
      handleFinish(nextApplied);
    } else {
      setShowDiff(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleFinish = async (items: any[]) => {
    sound.playVictory();
    try {
      const res = await api.createCodeManifest(items);
      if (res.success && res.manifest) {
        setPendingManifest(res.manifest);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setCurrentIndex(0);
    setAppliedPatches([]);
    setShowDiff(false);
    setScore(0);
    loadSnippets();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-emerald-500/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-2xl text-white">Bug Hunter</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300">
                AST LINT & SECURITY REMEDIATION
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Detect code smells, credential leaks, and eval vulnerabilities. Apply syntax-verified patches to real files.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl font-mono text-xs">
            <span className="text-[9px] uppercase text-slate-400 block">Hunter Score</span>
            <span className="text-emerald-400 font-bold">{score} PTS</span>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {currentIndex < snippets.length && currentSnippet ? (
        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2">
            <span>FILE {currentIndex + 1} OF {snippets.length}: {currentSnippet.file}</span>
            <span className="text-emerald-400 font-bold">+{currentSnippet.xpReward} XP upon remediation</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / snippets.length) * 100}%` }}
            />
          </div>

          {/* Interactive Code Arena */}
          <div className="rounded-3xl glass-panel-glow border-2 border-emerald-500/40 overflow-hidden shadow-[0_0_35px_rgba(16,185,129,0.15)]">
            {/* Terminal Header */}
            <div className="px-6 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-300 ml-2 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  {currentSnippet.file}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDiff(!showDiff)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                    showDiff
                      ? 'bg-purple-950 border-purple-500/40 text-purple-300'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>{showDiff ? "Hide Git Diff" : "Preview AST Diff"}</span>
                </button>
              </div>
            </div>

            {/* Code Viewport */}
            <div className="p-6 bg-[#07090e]/95 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed">
              {!showDiff ? (
                <pre className="text-emerald-300">
                  <code>{currentSnippet.code}</code>
                </pre>
              ) : (
                <div className="space-y-4">
                  <div className="text-[11px] font-mono text-purple-400 border-b border-purple-500/30 pb-2">
                    PROPOSED AST REMEDIATION DIFF:
                  </div>
                  <pre className="text-emerald-400 bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30">
                    <code>{currentSnippet.fixedCode}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Bugs Detected Radar Panel */}
            <div className="p-6 bg-slate-950/90 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>DETECTED VULNERABILITIES & CODE SMELLS ({currentSnippet.bugs.length})</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  {currentSnippet.difficulty}
                </span>
              </div>

              <div className="space-y-2">
                {currentSnippet.bugs.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/60 text-red-300 font-bold shrink-0 mt-0.5">
                        LINE {b.line}
                      </span>
                      <span className="text-red-200">{b.message}</span>
                    </div>
                    <span className="text-[10px] font-mono text-red-400 uppercase font-bold shrink-0">
                      {b.type}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleFixBug}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-display font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>APPLY CLEAN AST PATCH</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Round Complete Screen */
        <div className="glass-panel-glow rounded-3xl p-8 text-center space-y-6 border border-emerald-500/40">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
            <CheckCircle2 className="w-8 h-8 text-slate-950" />
          </div>

          <div>
            <h3 className="font-display font-bold text-2xl text-white">
              CODEBASE PURIFIED!
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              You remediated vulnerabilities across {appliedPatches.length} files with {score} game score.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2 max-w-lg mx-auto text-xs font-mono">
            <div className="text-slate-400 border-b border-slate-800 pb-2">Patches Ready for Execution:</div>
            {appliedPatches.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-slate-300 font-bold">{item.file}</span>
                <span className="text-emerald-400 text-[11px]">{item.fixes.length} Fixes Applied</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-mono"
            >
              Analyze More Code
            </button>
            <button
              onClick={() => handleFinish(appliedPatches)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-display font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
            >
              Review & Execute File Patches
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
