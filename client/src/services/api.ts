// QuestFlow AI Frontend API Client
const API_BASE = '/api';

export interface PlayerStats {
  id: string;
  name: string;
  callsign: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  productivityScore: number;
  tasksCompleted: number;
  emailsCleaned: number;
  filesOrganized: number;
  expensesAudited: number;
  bugsEliminated: number;
  settings: {
    demoMode: boolean;
    soundEnabled: boolean;
    geminiApiKey: string;
    gmailConnected: boolean;
    gdriveConnected: boolean;
    autoApproveSafeActions: boolean;
  };
}

export interface TaskManifest {
  id: string;
  gameType: 'inbox-quest' | 'file-frenzy' | 'money-mission' | 'bug-hunter';
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'AWAITING_APPROVAL' | 'COMPLETED' | 'FAILED';
  itemsCount: number;
  items: any[];
  xpAwarded: number;
  potentialXp: number;
  createdAt: string;
  completedAt: string | null;
  error?: string | null;
  receipt?: {
    auditId: string;
    executionMethod: string;
    status: string;
    message: string;
    [key: string]: any;
  } | null;
}

export const api = {
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/profile`);
    return res.json();
  },

  async updateSettings(settings: Partial<PlayerStats['settings']>) {
    const res = await fetch(`${API_BASE}/profile/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    });
    return res.json();
  },

  async addXp(xpGain: number, taskType?: string) {
    const res = await fetch(`${API_BASE}/player/xp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xpGain, taskType }),
    });
    return res.json();
  },

  async decomposeTask(prompt: string) {
    const res = await fetch(`${API_BASE}/command-center/decompose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    return res.json();
  },

  async getEmails() {
    const res = await fetch(`${API_BASE}/gmail/emails`);
    return res.json();
  },

  async createEmailManifest(actions: any[]) {
    const res = await fetch(`${API_BASE}/gmail/manifest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actions }),
    });
    return res.json();
  },

  async getFiles() {
    const res = await fetch(`${API_BASE}/files/scan`);
    return res.json();
  },

  async createFileManifest(organizedItems: any[]) {
    const res = await fetch(`${API_BASE}/files/manifest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizedItems }),
    });
    return res.json();
  },

  async getExpenses() {
    const res = await fetch(`${API_BASE}/expenses/list`);
    return res.json();
  },

  async createExpenseManifest(decisions: any[]) {
    const res = await fetch(`${API_BASE}/expenses/manifest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decisions }),
    });
    return res.json();
  },

  async getCodeSnippets() {
    const res = await fetch(`${API_BASE}/code/snippets`);
    return res.json();
  },

  async createCodeManifest(fixes: any[]) {
    const res = await fetch(`${API_BASE}/code/manifest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fixes }),
    });
    return res.json();
  },

  async getQueue() {
    const res = await fetch(`${API_BASE}/tasks/queue`);
    return res.json();
  },

  async approveTask(taskId: string, approvedItems?: any[]) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvedItems }),
    });
    return res.json();
  },

  async getDailyMissions() {
    const res = await fetch(`${API_BASE}/daily-missions`);
    return res.json();
  },

  async getAchievements() {
    const res = await fetch(`${API_BASE}/achievements`);
    return res.json();
  },

  async getLeaderboard() {
    const res = await fetch(`${API_BASE}/leaderboard`);
    return res.json();
  }
};
