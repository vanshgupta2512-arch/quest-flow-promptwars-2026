import React from 'react';
import { Trophy, Zap, Sparkles, ChevronRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';

export const LevelUpModal: React.FC = () => {
  const { levelUpData, closeLevelUpModal } = useGame();

  if (!levelUpData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-md glass-panel-glow border-2 border-cyan-400 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(0,240,255,0.4)] overflow-hidden">
        {/* Animated Cyber Circles */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse" />

        {/* Icon Trophy */}
        <div className="relative w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[2px] shadow-[0_0_30px_rgba(0,240,255,0.6)] animate-bounce mb-5">
          <div className="w-full h-full bg-[#07090e] rounded-[22px] flex items-center justify-center">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>RANK ADVANCEMENT UNLOCKED</span>
        </div>

        <h2 className="font-display font-extrabold text-3xl text-white tracking-wide mb-1">
          LEVEL <span className="text-cyan-400 text-glow-cyan">{levelUpData.newLevel}</span> REACHED!
        </h2>
        <p className="text-xs text-slate-300 max-w-xs mx-auto mb-6">
          Your digital tasks are getting completed at lightning speed. Keep up the high productivity streak!
        </p>

        {/* Level Perks / Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
            <div className="text-[10px] font-mono text-slate-400">XP MULTIPLIER</div>
            <div className="text-sm font-bold text-cyan-400 font-display">+15% Boost</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
            <div className="text-[10px] font-mono text-slate-400">TITLE STATUS</div>
            <div className="text-sm font-bold text-purple-400 font-display">Cyber Operative</div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            closeLevelUpModal();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:to-purple-400 text-slate-950 font-display font-bold text-sm shadow-[0_0_25px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>CONTINUE QUEST</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
