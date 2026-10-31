import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Mail,
  FolderOpen,
  CircleDollarSign,
  Bug,
  ShieldCheck,
  Trophy,
  BarChart3,
  Settings,
  Sparkles
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  category?: string;
}

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, pendingCount } = useGame();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Command Hub', icon: LayoutDashboard },
    { id: 'ai-command', label: 'Gemini AI Core', icon: Bot, badge: 'AI' },
    
    // The 4 Interactive Mini Games
    { id: 'inbox-quest', label: 'Inbox Quest', icon: Mail, category: 'GAMES' },
    { id: 'file-frenzy', label: 'File Frenzy', icon: FolderOpen, category: 'GAMES' },
    { id: 'money-mission', label: 'Money Mission', icon: CircleDollarSign, category: 'GAMES' },
    { id: 'bug-hunter', label: 'Bug Hunter', icon: Bug, category: 'GAMES' },
    
    // Real Execution & Gamification Systems
    { id: 'execution-center', label: 'Task Execution', icon: ShieldCheck, badge: pendingCount > 0 ? `${pendingCount}` : undefined, category: 'SYSTEM' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, category: 'SYSTEM' },
    { id: 'leaderboard', label: 'Global Ranking', icon: BarChart3, category: 'SYSTEM' },
    { id: 'settings', label: 'Settings & APIs', icon: Settings, category: 'SYSTEM' },
  ];

  const handleNav = (id: string) => {
    sound.playClick();
    setActivePage(id);
  };

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 flex flex-col justify-between p-4 hidden md:flex shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Navigation Categories */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Control Center
          </div>
          {navItems.filter(item => !item.category).map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-900/60 border border-cyan-400/40 text-cyan-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Productivity Games */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Productivity Games</span>
            <span className="text-[9px] text-cyan-400 font-bold">4 LIVE</span>
          </div>
          {navItems.filter(item => item.category === 'GAMES').map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-950 to-slate-900 border border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </button>
            );
          })}
        </div>

        {/* System & Verification */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Audit & Real Execution
          </div>
          {navItems.filter(item => item.category === 'SYSTEM').map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety Policy & Hackathon Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-mono font-semibold text-[11px] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HUMAN-IN-THE-LOOP</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Zero accidental deletes. Every game mission requests your explicit confirmation before backend execution.
        </p>
      </div>
    </aside>
  );
};
