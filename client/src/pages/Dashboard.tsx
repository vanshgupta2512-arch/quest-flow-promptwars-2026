import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  FolderOpen,
  CircleDollarSign,
  Bug,
  ChevronRight,
  Flame,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Send,
  Zap,
  ShieldCheck,
  Trophy
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';

export const Dashboard: React.FC = () => {
  const { player, setActivePage, setPreloadedCommand } = useGame();
  const [quickPrompt, setQuickPrompt] = useState('');

  const games = [
    {
      id: 'inbox-quest',
      title: 'Inbox Quest',
      subtitle: 'Email Triage & Newsletter Purge',
      description: 'Swipe through emails to archive promotions, quarantine phishing, and unsubscribe from spam.',
      icon: Mail,
      accent: 'cyan',
      stats: `${player.emailsCleaned} Emails Cleaned`,
      xpPerTask: '+25 XP/email',
      borderColor: 'border-cyan-500/40',
      glowColor: 'shadow-[0_0_20px_rgba(0,240,255,0.15)]',
      bgGrad: 'from-cyan-950/40 to-slate-900/60'
    },
    {
      id: 'file-frenzy',
      title: 'File Frenzy',
      subtitle: 'Drag & Drop Folder Sorter',
      description: 'Sort messy downloads into Financial, Media, Code & Documents. Auto-detect duplicate SHA hashes.',
      icon: FolderOpen,
      accent: 'purple',
      stats: `${player.filesOrganized} Files Organized`,
      xpPerTask: '+30 XP/file',
      borderColor: 'border-purple-500/40',
      glowColor: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]',
      bgGrad: 'from-purple-950/40 to-slate-900/60'
    },
    {
      id: 'money-mission',
      title: 'Money Mission',
      subtitle: 'Expense Audit & Ghost Subscriptions',
      description: 'Review bank & credit card transactions, flag unused recurring SaaS charges and foreign anomalies.',
      icon: CircleDollarSign,
      accent: 'yellow',
      stats: `${player.expensesAudited} Records Audited`,
      xpPerTask: '+35 XP/record',
      borderColor: 'border-amber-500/40',
      glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      bgGrad: 'from-amber-950/40 to-slate-900/60'
    },
    {
      id: 'bug-hunter',
      title: 'Bug Hunter',
      subtitle: 'Code Cleanup & AST Lint Blitz',
      description: 'Spot console.log credential leaks, eval() vulnerabilities, and unused variables in live code.',
      icon: Bug,
      accent: 'green',
      stats: `${player.bugsEliminated} Bugs Remediated`,
      xpPerTask: '+75 XP/bug',
      borderColor: 'border-emerald-500/40',
      glowColor: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      bgGrad: 'from-emerald-950/40 to-slate-900/60'
    }
  ];

  const dailyQuests = [
    {
      id: "q1",
      title: "Inbox Zero Sweep",
      target: "Archive 5 promotional emails",
      progress: "3 / 5",
      pct: 60,
      reward: "+150 XP",
      gameId: "inbox-quest"
    },
    {
      id: "q2",
      title: "Duplicate Slayer",
      target: "Purge 2 duplicate files in File Frenzy",
      progress: "1 / 2",
      pct: 50,
      reward: "+120 XP",
      gameId: "file-frenzy"
    },
    {
      id: "q3",
      title: "Ghost Subscription Audit",
      target: "Review 3 recurring SaaS charges",
      progress: "3 / 3",
      pct: 100,
      reward: "+180 XP",
      completed: true,
      gameId: "money-mission"
    }
  ];

  const handleLaunchGame = (id: string) => {
    sound.playClick();
    setActivePage(id);
  };

  const handleQuickCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    sound.playClick();
    setPreloadedCommand(quickPrompt);
    setActivePage('ai-command');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Hero / Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-glow p-6 sm:p-8 border border-cyan-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>GOOGLE FOR DEVELOPERS × PROMPTWARS 2026</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-wide leading-tight">
            PLAY YOUR TASKS. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              FINISH YOUR LIFE.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Transform tedious digital chores into fast-paced games. Every mission you play is connected to real-world execution: cleaning real emails, organizing disk directories, and patching live code.
          </p>

          {/* AI Quick Command Bar */}
          <form onSubmit={handleQuickCommandSubmit} className="pt-2 flex items-center gap-2 max-w-2xl">
            <div className="relative flex-1">
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="Give AI a goal: 'Clean my promotional inbox' or 'Organize my downloads'..."
                className="w-full px-4 py-3 pl-11 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 shadow-inner"
              />
              <Sparkles className="w-4 h-4 text-cyan-400 absolute left-4 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-display font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <span>DECOMPOSE</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. Productivity & Gamification Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Real XP</div>
            <div className="text-2xl font-bold font-display text-white">{player.xp.toLocaleString()}</div>
            <div className="text-[11px] text-cyan-400 font-mono">Level {player.level} Operative</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Active Streak</div>
            <div className="text-2xl font-bold font-display text-white">{player.streakDays} Days</div>
            <div className="text-[11px] text-amber-400 font-mono">Top 5% Consistency</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Verified Tasks</div>
            <div className="text-2xl font-bold font-display text-white">{player.tasksCompleted} Executed</div>
            <div className="text-[11px] text-emerald-400 font-mono">100% Audit Verified</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Productivity Score</div>
            <div className="text-2xl font-bold font-display text-white">{player.productivityScore} / 100</div>
            <div className="text-[11px] text-purple-400 font-mono">Procrastination Guarded</div>
          </div>
        </div>
      </div>

      {/* 3. The 4 Interactive Games Launchpad */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-white">Productivity Arenas</h2>
            <p className="text-xs text-slate-400">Select a real digital chore to tackle through fast gamified gameplay.</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
            4 Interactive Games
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {games.map(game => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                onClick={() => handleLaunchGame(game.id)}
                className={`relative group rounded-3xl p-6 glass-panel border ${game.borderColor} ${game.glowColor} bg-gradient-to-br ${game.bgGrad} transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 cursor-pointer overflow-hidden flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white shadow-md">
                      <Icon className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300">
                      {game.xpPerTask}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-cyan-300 transition-colors">
                      {game.title}
                    </h3>
                    <div className="text-xs text-purple-300 font-mono">{game.subtitle}</div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{game.stats}</span>
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                    <span>PLAY MISSION</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Daily Missions & Recent Activity Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Missions (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-bold text-lg text-white">Daily Operations</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Resets at 00:00 UTC</span>
          </div>

          <div className="space-y-3">
            {dailyQuests.map(quest => (
              <div
                key={quest.id}
                onClick={() => handleLaunchGame(quest.gameId)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  quest.completed
                    ? 'bg-slate-950/40 border-emerald-500/30'
                    : 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {quest.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                    <span className="text-xs font-bold text-white font-display">{quest.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">{quest.reward}</span>
                </div>

                <p className="text-xs text-slate-400 mb-3">{quest.target}</p>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${quest.completed ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                      style={{ width: `${quest.pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{quest.progress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real Task Execution Feed (1 Col) */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-display font-bold text-lg text-white">Execution Feed</h3>
            </div>
            <button
              onClick={() => { sound.playClick(); setActivePage('execution-center'); }}
              className="text-[11px] font-mono text-cyan-400 hover:underline"
            >
              View Hub
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-emerald-400 text-[10px]">RCPT-GMAIL-9042</span>
                <span className="text-[10px] text-slate-500">Verified</span>
              </div>
              <div className="font-medium text-slate-200">Archive 4 Promotional Newsletters</div>
              <div className="text-[10px] text-slate-400 font-mono">+140 XP Awarded to Operative</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-400 text-[10px]">RCPT-FS-8192</span>
                <span className="text-[10px] text-slate-500">Verified</span>
              </div>
              <div className="font-medium text-slate-200">Directory Organization: 6 Files Categorized</div>
              <div className="text-[10px] text-slate-400 font-mono">+180 XP Awarded to Operative</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-purple-400 text-[10px]">RCPT-CODE-4412</span>
                <span className="text-[10px] text-slate-500">Verified</span>
              </div>
              <div className="font-medium text-slate-200">Fixed Token Leak in sessionController.js</div>
              <div className="text-[10px] text-slate-400 font-mono">+80 XP Awarded to Operative</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
