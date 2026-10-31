import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Trophy,
  Medal,
  Flame,
  Zap,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';

export const Leaderboard: React.FC = () => {
  const { player } = useGame();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    loadLeaderboard();
  }, [player.xp]);

  const loadLeaderboard = async () => {
    try {
      const res = await api.getLeaderboard();
      if (res?.leaderboard) {
        setLeaderboard(res.leaderboard);
      }
    } catch (e) {
      // ignore
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-amber-400 text-slate-950 font-black';
    if (rank === 2) return 'bg-slate-300 text-slate-950 font-black';
    if (rank === 3) return 'bg-amber-700 text-white font-black';
    return 'bg-slate-800 text-slate-300 font-bold';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-purple-500/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-400/40 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-2xl text-white">Global Leaderboard</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300">
                PROMPTWARS 2026 DIVISION
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Ranked by verified productivity tasks completed. No simulated inflation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
          <Users className="w-4 h-4" />
          <span>Active Operatives: 1,482</span>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
        <div className="p-4 bg-slate-950/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="w-16">RANK</div>
          <div className="flex-1">OPERATIVE</div>
          <div className="w-24 text-right">TASKS</div>
          <div className="w-28 text-right">TOTAL XP</div>
        </div>

        {leaderboard.map((entry) => (
          <div
            key={entry.rank}
            className={`p-4 flex items-center justify-between transition-all ${
              entry.isUser
                ? 'bg-gradient-to-r from-cyan-950/50 to-purple-950/30 border-l-4 border-cyan-400'
                : 'hover:bg-slate-900/40'
            }`}
          >
            <div className="w-16 flex items-center">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-display ${getRankBadge(entry.rank)}`}>
                {entry.rank}
              </div>
            </div>

            <div className="flex-1 flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-display font-bold ${entry.isUser ? 'text-cyan-300' : 'text-white'}`}>
                    {entry.name}
                  </span>
                  {entry.isUser && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-900 text-cyan-300 font-bold">
                      YOU
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {entry.badge} • Level {entry.level}
                </div>
              </div>
            </div>

            <div className="w-24 text-right font-mono text-xs text-slate-300">
              {entry.tasks} done
            </div>

            <div className="w-28 text-right font-mono text-sm font-bold text-amber-400">
              {entry.xp.toLocaleString()} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
