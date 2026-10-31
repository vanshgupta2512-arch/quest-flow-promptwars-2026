import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Loader2,
  Play,
  Clock,
  Zap,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';
import { sound } from '../services/soundEffects';

export const AICommandCenter: React.FC = () => {
  const { setActivePage, preloadedCommand, setPreloadedCommand } = useGame();
  const [prompt, setPrompt] = useState(preloadedCommand || '');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: "Clean promotional & spam emails", prompt: "Clean my inbox, quarantine spam, and organize all promotional emails." },
    { label: "Organize downloads & find duplicates", prompt: "Organize my messy downloads directory into categories and find duplicate files." },
    { label: "Audit subscriptions & unusual charges", prompt: "Review my bank expenses, audit unused subscriptions and detect unusual transactions." },
    { label: "Scan code for leaks & eval vulnerabilities", prompt: "Scan my codebase for credential leaks, lint issues, and dangerous eval statements." }
  ];

  useEffect(() => {
    if (preloadedCommand) {
      setPrompt(preloadedCommand);
      handleDecompose(preloadedCommand);
      setPreloadedCommand(undefined);
    }
  }, [preloadedCommand]);

  const handleDecompose = async (queryToRun?: string) => {
    const text = queryToRun || prompt;
    if (!text.trim()) return;

    sound.playClick();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.decomposeTask(text);
      if (res.success && res.plan) {
        setPlan(res.plan);
        sound.playScore();
      } else {
        setError(res.error || "Failed to generate mission decomposition.");
      }
    } catch (err: any) {
      setError(err.message || "Network error communicating with AI Core.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchGame = (gameId: string) => {
    sound.playClick();
    setActivePage(gameId);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-cyan-500/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-2xl text-white">Gemini AI Command Centre</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-400/30 text-cyan-300">
                gemini-1.5-flash
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Input large natural-language tasks. AI will decompose them into executable gaming missions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Human-in-the-Loop Safe</span>
        </div>
      </div>

      {/* Input Terminal */}
      <div className="glass-panel-glow rounded-3xl p-6 border border-cyan-500/40 space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What digital chore do you want to conquer today? E.g. 'Clean 50 unread newsletters, sort my downloads folder and check for duplicate invoices'..."
            rows={3}
            className="w-full p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 font-sans shadow-inner resize-none"
          />
        </div>

        {/* Quick Suggestion Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Presets:</span>
          </span>
          {presets.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setPrompt(p.prompt);
                handleDecompose(p.prompt);
              }}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleDecompose()}
            disabled={isLoading || !prompt.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:to-purple-400 text-slate-950 font-display font-bold text-sm shadow-[0_0_25px_rgba(0,240,255,0.4)] disabled:opacity-50 flex items-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Decomposing Goal with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>GENERATE GAME MISSIONS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Mission Decomposition View */}
      {plan && (
        <div className="space-y-6 animate-fade-in">
          {/* Plan Summary Banner */}
          <div className="p-6 rounded-3xl glass-panel-purple border border-purple-500/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
              <div>
                <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider">
                  AI DECOMPOSITION REPORT
                </span>
                <h3 className="font-display font-bold text-xl text-white mt-0.5">
                  {plan.summary}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>~{plan.estimatedTimeMinutes} mins</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Zap className="w-4 h-4" />
                  <span>+{plan.totalPotentialXp} Total XP</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic">
              Safety Advisory: {plan.safetyAdvisory}
            </p>
          </div>

          {/* Generated Interactive Missions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="font-display font-bold text-lg text-white">
                Generated Productivity Missions ({plan.missions?.length || 0})
              </h4>
              <span className="text-xs font-mono text-slate-400">Click to launch arena</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plan.missions?.map((m: any, idx: number) => (
                <div
                  key={m.id || idx}
                  className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 uppercase border border-cyan-500/20">
                        {m.game}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        m.difficulty === 'HARD' ? 'bg-red-950 text-red-300 border border-red-500/20' :
                        m.difficulty === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border border-amber-500/20' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-500/20'
                      }`}>
                        {m.difficulty}
                      </span>
                    </div>

                    <h5 className="font-display font-bold text-base text-white">
                      {m.title}
                    </h5>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {m.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400">
                      Target: <span className="text-cyan-400 font-semibold">{m.targetAction}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400 font-bold">+{m.xp} XP</span>
                    <button
                      onClick={() => handleLaunchGame(m.game)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
                    >
                      <span>LAUNCH</span>
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
