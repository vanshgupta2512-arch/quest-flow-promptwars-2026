import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api, PlayerStats, TaskManifest } from '../services/api';
import { sound } from '../services/soundEffects';

interface GameContextType {
  player: PlayerStats;
  activePage: string;
  setActivePage: (page: string) => void;
  pendingManifest: TaskManifest | null;
  setPendingManifest: (manifest: TaskManifest | null) => void;
  pendingCount: number;
  soundEnabled: boolean;
  toggleSound: () => void;
  approveManifest: (manifestId: string, items?: any[]) => Promise<any>;
  levelUpData: { newLevel: number } | null;
  closeLevelUpModal: () => void;
  refreshStats: () => Promise<void>;
  preloadedCommand?: string;
  setPreloadedCommand: (cmd: string | undefined) => void;
}

const DEFAULT_PLAYER: PlayerStats = {
  id: "user_cyber_01",
  name: "CyberOperative",
  callsign: "Vansh Gupta",
  level: 4,
  xp: 1350,
  nextLevelXp: 2000,
  streakDays: 7,
  productivityScore: 88,
  tasksCompleted: 42,
  emailsCleaned: 184,
  filesOrganized: 67,
  expensesAudited: 53,
  bugsEliminated: 29,
  settings: {
    demoMode: true,
    soundEnabled: true,
    geminiApiKey: "",
    gmailConnected: false,
    gdriveConnected: false,
    autoApproveSafeActions: false
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<PlayerStats>(DEFAULT_PLAYER);
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [pendingManifest, setPendingManifest] = useState<TaskManifest | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [levelUpData, setLevelUpData] = useState<{ newLevel: number } | null>(null);
  const [preloadedCommand, setPreloadedCommand] = useState<string | undefined>(undefined);

  const refreshStats = async () => {
    try {
      const data = await api.getStats();
      if (data?.player) {
        setPlayer(data.player);
      }
      const queueData = await api.getQueue();
      if (queueData?.tasks) {
        const waiting = queueData.tasks.filter((t: TaskManifest) => t.status === 'AWAITING_APPROVAL').length;
        setPendingCount(waiting);
      }
    } catch (err) {
      // Use current local state if server is offline
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playClick();
  };

  const approveManifest = async (manifestId: string, items?: any[]) => {
    try {
      sound.playClick();
      const res = await api.approveTask(manifestId, items);
      
      if (res?.success) {
        sound.playVictory();
        
        // Check level up
        if (res.player && res.player.level > player.level) {
          setLevelUpData({ newLevel: res.player.level });
          sound.playLevelUp();
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
        
        if (res.player) {
          setPlayer(res.player);
        }
        await refreshStats();
        return res.task;
      }
    } catch (err: any) {
      console.error("Task execution failed:", err);
      throw err;
    }
  };

  const closeLevelUpModal = () => {
    setLevelUpData(null);
  };

  return (
    <GameContext.Provider
      value={{
        player,
        activePage,
        setActivePage,
        pendingManifest,
        setPendingManifest,
        pendingCount,
        soundEnabled,
        toggleSound,
        approveManifest,
        levelUpData,
        closeLevelUpModal,
        refreshStats,
        preloadedCommand,
        setPreloadedCommand
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
