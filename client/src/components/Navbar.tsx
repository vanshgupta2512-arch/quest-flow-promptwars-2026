import React from 'react';
import { Sparkles, Flame, Volume2, VolumeX, ShieldAlert, Cpu, Settings, CheckCircle2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';

export const Navbar: React.FC = () => {
  const { player, soundEnabled, toggleSound, pendingCount, setActivePage } = useGame();

  const xpPercent = Math.min(100, Math.round((player.xp / player.nextLevelXp) * 100));

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand & Hackathon Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => { sound.playClick(); setActivePage('dashboard'); }}
          className="flex items-center gap-2 group text-left"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1.5px] shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all group-hover:scale-105">
            <div className="w-full h-full bg-[#07090e] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl text-white tracking-wider">
                QUEST<span className="text-cyan-400 text-glow-cyan">FLOW</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 font-mono font-medium">
                AI CORE
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>Google for Developers</span>
              <span className="text-slate-600">•</span>
              <span className="text-purple-400 font-medium">PromptWars 2026</span>
            </div>
          </div>
        </button>
      </div>

      {/* Gamification HUD (XP, Level, Streak) */}
      <div className="hidden md:flex items-center gap-6">
        {/* Level & XP Bar */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-2 shadow-inner">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 font-display font-bold text-sm shadow-[0_0_10px_rgba(0,240,255,0.5)]">
              {player.level}
            </div>
            <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
              LVL {player.level}
            </span>
          </div>

          <div className="flex flex-col gap-1 w-36">
            <div className="flex justify-between text-[11px] font-mono text-slate-300">
              <span className="text-slate-400">XP</span>
              <span>{player.xp.toLocaleString()} / {player.nextLevelXp.toLocaleString()}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,240,255,0.7)]"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-amber-500/30 rounded-xl px-3.5 py-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono text-amber-300/80 leading-none">Streak</span>
            <span className="text-xs font-display font-bold text-amber-300">{player.streakDays} Days</span>
          </div>
        </div>

        {/* Productivity Score */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-emerald-500/30 rounded-xl px-3.5 py-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono text-emerald-300/80 leading-none">Focus Rate</span>
            <span className="text-xs font-display font-bold text-emerald-400">{player.productivityScore}%</span>
          </div>
        </div>
      </div>

      {/* Action Triggers: Execution Queue & Audio & Settings */}
      <div className="flex items-center gap-3">
        {/* Execution Queue Button */}
        <button
          onClick={() => { sound.playClick(); setActivePage('execution-center'); }}
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all text-xs font-mono"
        >
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Execution Hub</span>
          {pendingCount > 0 ? (
            <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-bounce shadow-[0_0_10px_rgba(0,240,255,0.8)]">
              {pendingCount}
            </span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          )}
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? "Mute Game Audio" : "Unmute Game Audio"}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-all"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => { sound.playClick(); setActivePage('settings'); }}
          title="System Settings & API Keys"
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
