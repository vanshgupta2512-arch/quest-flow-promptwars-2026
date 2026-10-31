import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ApprovalModal } from './components/ApprovalModal';
import { LevelUpModal } from './components/LevelUpModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { AICommandCenter } from './pages/AICommandCenter';
import { InboxQuest } from './pages/InboxQuest';
import { FileFrenzy } from './pages/FileFrenzy';
import { MoneyMission } from './pages/MoneyMission';
import { BugHunter } from './pages/BugHunter';
import { ExecutionCenter } from './pages/ExecutionCenter';
import { Achievements } from './pages/Achievements';
import { Leaderboard } from './pages/Leaderboard';
import { SettingsPage } from './pages/SettingsPage';

// Mobile Bottom Nav Icons
import {
  LayoutDashboard,
  Bot,
  Mail,
  FolderOpen,
  CircleDollarSign,
  Bug,
  ShieldCheck
} from 'lucide-react';
import { sound } from './services/soundEffects';

const AppContent: React.FC = () => {
  const { activePage, setActivePage, pendingCount } = useGame();

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'ai-command': return <AICommandCenter />;
      case 'inbox-quest': return <InboxQuest />;
      case 'file-frenzy': return <FileFrenzy />;
      case 'money-mission': return <MoneyMission />;
      case 'bug-hunter': return <BugHunter />;
      case 'execution-center': return <ExecutionCenter />;
      case 'achievements': return <Achievements />;
      case 'leaderboard': return <Leaderboard />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-40 z-0" />

      {/* Global Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex-1 flex relative z-10">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden sticky bottom-0 z-40 w-full glass-panel border-t border-slate-800 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => { sound.playClick(); setActivePage('dashboard'); }}
          className={`flex flex-col items-center p-1 text-[10px] font-mono ${activePage === 'dashboard' ? 'text-cyan-400' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Hub</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActivePage('ai-command'); }}
          className={`flex flex-col items-center p-1 text-[10px] font-mono ${activePage === 'ai-command' ? 'text-cyan-400' : 'text-slate-400'}`}
        >
          <Bot className="w-4 h-4" />
          <span>AI</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActivePage('inbox-quest'); }}
          className={`flex flex-col items-center p-1 text-[10px] font-mono ${activePage === 'inbox-quest' ? 'text-cyan-400' : 'text-slate-400'}`}
        >
          <Mail className="w-4 h-4" />
          <span>Inbox</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActivePage('file-frenzy'); }}
          className={`flex flex-col items-center p-1 text-[10px] font-mono ${activePage === 'file-frenzy' ? 'text-cyan-400' : 'text-slate-400'}`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Files</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActivePage('execution-center'); }}
          className={`relative flex flex-col items-center p-1 text-[10px] font-mono ${activePage === 'execution-center' ? 'text-cyan-400' : 'text-slate-400'}`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Tasks</span>
          {pendingCount > 0 && (
            <span className="absolute -top-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          )}
        </button>
      </div>

      {/* Global Modals */}
      <ApprovalModal />
      <LevelUpModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
