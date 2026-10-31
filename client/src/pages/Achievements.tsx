import React, { useState, useEffect } from 'react';
import {
  Trophy,
  MailCheck,
  FolderGit2,
  ShieldAlert,
  BugOff,
  Sparkles,
  Flame,
  Lock,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { api } from '../services/api';
import { sound } from '../services/soundEffects';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
  rarity: 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  xpBonus: number;
}

export const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const res = await api.getAchievements();
      if (res?.achievements) {
        setAchievements(res.achievements);
      }
    } catch (e) {
      // ignore
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'MYTHIC':
        return 'bg-pink-950 text-pink-300 border-pink-500/40';
      case 'LEGENDARY':
        return 'bg-amber-950 text-amber-300 border-amber-500/40';
      case 'EPIC':
        return 'bg-purple-950 text-purple-300 border-purple-500/40';
      default:
        return 'bg-cyan-950 text-cyan-300 border-cyan-500/40';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-amber-500/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-2xl text-white">Achievements & Badges</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-500/30 text-amber-300">
                {unlockedCount} / {achievements.length} UNLOCKED
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Complete verified digital tasks in games to unlock exclusive hacker badges and XP boosts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-amber-400 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
          <Zap className="w-4 h-4" />
          <span>Total Badge Boost: +1,550 XP</span>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(ach => (
          <div
            key={ach.id}
            className={`p-6 rounded-3xl glass-panel border transition-all flex flex-col justify-between space-y-4 ${
              ach.unlocked
                ? 'border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-slate-900/60 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                : 'border-slate-800/80 opacity-60 bg-slate-950/40'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl border ${
                  ach.unlocked ? 'bg-amber-950/60 border-amber-500/40 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {ach.unlocked ? <Trophy className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>

                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border font-bold ${getRarityBadge(ach.rarity)}`}>
                  {ach.rarity}
                </span>
              </div>

              <div>
                <h4 className="font-display font-bold text-lg text-white">
                  {ach.name}
                </h4>
                <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{ach.category}</div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {ach.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold">+{ach.xpBonus} XP</span>
              {ach.unlocked ? (
                <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Unlocked {ach.unlockedAt}</span>
                </span>
              ) : (
                <span className="text-slate-500 text-[11px]">Locked</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
