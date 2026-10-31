// QuestFlow AI - Main Express API Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  INITIAL_PLAYER,
  MOCK_EMAILS,
  MOCK_FILES,
  MOCK_EXPENSES,
  MOCK_CODE_SNIPPETS,
  MOCK_DAILY_MISSIONS,
  MOCK_ACHIEVEMENTS,
  MOCK_LEADERBOARD
} from './mockData.js';
import { decomposeTaskWithGemini, initGemini } from './services/geminiService.js';
import { executionEngine } from './tasks/executionEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ dest: path.join(__dirname, '../data/uploads') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-Memory Mutated State (persists during server lifetime)
let playerState = { ...INITIAL_PLAYER };
let emailPool = [...MOCK_EMAILS];
let filePool = [...MOCK_FILES];
let expensePool = [...MOCK_EXPENSES];
let codePool = [...MOCK_CODE_SNIPPETS];
let dailyMissions = [...MOCK_DAILY_MISSIONS];
let achievements = [...MOCK_ACHIEVEMENTS];
let leaderboard = [...MOCK_LEADERBOARD];

// Helper: Calculate Level from XP
function calculateLevel(xp) {
  // Level formula: Level = floor(sqrt(XP / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

function calculateNextLevelXp(level) {
  return level * level * 100;
}

// ----------------------------------------------------
// 1. SYSTEM & PLAYER STATS API
// ----------------------------------------------------

app.get('/api/stats', (req, res) => {
  res.json({
    player: playerState,
    dailyMissions,
    summary: {
      totalEmailsCleaned: playerState.emailsCleaned,
      totalFilesOrganized: playerState.filesOrganized,
      totalExpensesAudited: playerState.expensesAudited,
      totalBugsEliminated: playerState.bugsEliminated,
      activeTasksInQueue: executionEngine.getAllTasks().filter(t => t.status !== 'COMPLETED').length
    }
  });
});

app.post('/api/player/xp', (req, res) => {
  const { xpGain, taskType } = req.body;
  if (!xpGain) return res.status(400).json({ error: "Missing xpGain" });

  playerState.xp += Number(xpGain);
  const newLevel = calculateLevel(playerState.xp);
  let leveledUp = false;

  if (newLevel > playerState.level) {
    playerState.level = newLevel;
    playerState.nextLevelXp = calculateNextLevelXp(newLevel);
    leveledUp = true;
  }

  // Increment specific counters
  if (taskType === 'email') playerState.emailsCleaned += 1;
  if (taskType === 'file') playerState.filesOrganized += 1;
  if (taskType === 'expense') playerState.expensesAudited += 1;
  if (taskType === 'code') playerState.bugsEliminated += 1;
  playerState.tasksCompleted += 1;

  // Sync leaderboard
  const userEntry = leaderboard.find(l => l.isUser);
  if (userEntry) {
    userEntry.xp = playerState.xp;
    userEntry.level = playerState.level;
    userEntry.tasks = playerState.tasksCompleted;
    leaderboard.sort((a, b) => b.xp - a.xp);
    leaderboard.forEach((entry, idx) => { entry.rank = idx + 1; });
  }

  res.json({
    success: true,
    player: playerState,
    leveledUp,
    newLevel: playerState.level
  });
});

app.get('/api/profile', (req, res) => {
  res.json(playerState);
});

app.post('/api/profile/settings', (req, res) => {
  const { settings } = req.body;
  if (settings) {
    playerState.settings = { ...playerState.settings, ...settings };
    if (settings.geminiApiKey) {
      initGemini(settings.geminiApiKey);
    }
  }
  res.json({ success: true, settings: playerState.settings });
});

// ----------------------------------------------------
// 2. AI COMMAND CENTRE API (Google Gemini)
// ----------------------------------------------------

app.post('/api/command-center/decompose', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const result = await decomposeTaskWithGemini(prompt, playerState.settings.geminiApiKey);
    res.json({ success: true, plan: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 3. INBOX QUEST (Email Cleaning Game)
// ----------------------------------------------------

app.get('/api/gmail/emails', (req, res) => {
  res.json({
    source: playerState.settings.gmailConnected ? "REAL_GMAIL_API" : "SANDBOX_MOCK_INBOX",
    emails: emailPool
  });
});

app.post('/api/gmail/manifest', (req, res) => {
  const { actions } = req.body; // array of { id, action: 'archive'|'trash'|'keep'|'unsubscribe' }
  if (!actions || !Array.isArray(actions)) {
    return res.status(400).json({ error: "Actions array required" });
  }

  // Calculate potential XP: 25 XP per cleaned email
  const cleanedCount = actions.filter(a => a.action !== 'keep').length;
  const potentialXp = Math.max(50, cleanedCount * 25);

  const manifest = executionEngine.createManifest({
    gameType: "inbox-quest",
    title: `Inbox Triage: ${cleanedCount} Emails Processed`,
    items: actions,
    xpBonus: potentialXp,
    requiresApproval: !playerState.settings.autoApproveSafeActions
  });

  res.json({ success: true, manifest });
});

// ----------------------------------------------------
// 4. FILE FRENZY (File Organisation Game)
// ----------------------------------------------------

app.get('/api/files/scan', (req, res) => {
  res.json({
    source: playerState.settings.gdriveConnected ? "REAL_GOOGLE_DRIVE" : "LOCAL_WORKSPACE_SANDBOX",
    files: filePool,
    categories: [
      { id: "Financial", name: "Financial & Invoices", icon: "DollarSign" },
      { id: "Media", name: "Media & Screenshots", icon: "Image" },
      { id: "Code", name: "Code & Repositories", icon: "Code" },
      { id: "Documents", name: "Legal & Documents", icon: "FileText" },
      { id: "Duplicates", name: "Duplicates (To Purge)", icon: "Trash2" }
    ]
  });
});

app.post('/api/files/manifest', (req, res) => {
  const { organizedItems } = req.body;
  if (!organizedItems || !Array.isArray(organizedItems)) {
    return res.status(400).json({ error: "organizedItems array required" });
  }

  const potentialXp = organizedItems.length * 30;
  const manifest = executionEngine.createManifest({
    gameType: "file-frenzy",
    title: `Directory Organization: ${organizedItems.length} Files Categorized`,
    items: organizedItems,
    xpBonus: potentialXp,
    requiresApproval: true
  });

  res.json({ success: true, manifest });
});

// ----------------------------------------------------
// 5. MONEY MISSION (Expense Review Game)
// ----------------------------------------------------

app.get('/api/expenses/list', (req, res) => {
  res.json({
    expenses: expensePool,
    metrics: {
      totalAudited: expensePool.filter(e => e.status === 'Verified').length,
      pendingReview: expensePool.filter(e => e.status === 'Needs Review').length,
      flaggedAnomalies: expensePool.filter(e => e.isAnomaly).length,
      potentialMonthlySavings: 203.98
    }
  });
});

app.post('/api/expenses/manifest', (req, res) => {
  const { decisions } = req.body; // array of { id, decision: 'approved_subscription'|'flagged_cancel'|'verified_business'|'anomaly' }
  if (!decisions || !Array.isArray(decisions)) {
    return res.status(400).json({ error: "Decisions array required" });
  }

  const potentialXp = decisions.length * 35;
  const manifest = executionEngine.createManifest({
    gameType: "money-mission",
    title: `Expense Audit: ${decisions.length} Transactions Verified`,
    items: decisions,
    xpBonus: potentialXp,
    requiresApproval: true
  });

  res.json({ success: true, manifest });
});

// ----------------------------------------------------
// 6. BUG HUNTER (Code Cleanup Game)
// ----------------------------------------------------

app.get('/api/code/snippets', (req, res) => {
  res.json({ snippets: codePool });
});

app.post('/api/code/manifest', (req, res) => {
  const { fixes } = req.body; // array of { snippetId, appliedFixes: [] }
  if (!fixes || !Array.isArray(fixes)) {
    return res.status(400).json({ error: "Fixes array required" });
  }

  const potentialXp = fixes.length * 75;
  const manifest = executionEngine.createManifest({
    gameType: "bug-hunter",
    title: `Code Remediation: ${fixes.length} Security & Lint Patches`,
    items: fixes,
    xpBonus: potentialXp,
    requiresApproval: true
  });

  res.json({ success: true, manifest });
});

// ----------------------------------------------------
// 7. GLOBAL TASK QUEUE & APPROVAL API
// ----------------------------------------------------

app.get('/api/tasks/queue', (req, res) => {
  res.json({
    tasks: executionEngine.getAllTasks(),
    history: executionEngine.getHistory()
  });
});

app.post('/api/tasks/:id/approve', async (req, res) => {
  const taskId = req.params.id;
  const { approvedItems } = req.body;

  try {
    const executedTask = await executionEngine.executeTask(taskId, approvedItems);

    // Reward XP upon verified completion
    if (executedTask.status === "COMPLETED" && executedTask.xpAwarded > 0) {
      playerState.xp += executedTask.xpAwarded;
      playerState.tasksCompleted += 1;
      const newLevel = calculateLevel(playerState.xp);
      if (newLevel > playerState.level) {
        playerState.level = newLevel;
        playerState.nextLevelXp = calculateNextLevelXp(newLevel);
      }

      // Update specific stats
      if (executedTask.gameType === 'inbox-quest') playerState.emailsCleaned += executedTask.itemsCount;
      if (executedTask.gameType === 'file-frenzy') playerState.filesOrganized += executedTask.itemsCount;
      if (executedTask.gameType === 'money-mission') playerState.expensesAudited += executedTask.itemsCount;
      if (executedTask.gameType === 'bug-hunter') playerState.bugsEliminated += executedTask.itemsCount;
    }

    res.json({
      success: true,
      task: executedTask,
      player: playerState
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 8. GAMIFICATION & SOCIAL
// ----------------------------------------------------

app.get('/api/achievements', (req, res) => {
  res.json({ achievements });
});

app.get('/api/leaderboard', (req, res) => {
  res.json({ leaderboard });
});

app.get('/api/daily-missions', (req, res) => {
  res.json({ missions: dailyMissions });
});

// Serve frontend static build if present
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  🎮 QUESTFLOW AI – Backend API & Execution Engine
  --------------------------------------------------
  📡 Port: http://localhost:${PORT}
  🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? 'Active (API Key loaded)' : 'Local Heuristic Core (Fallback ready)'}
  🛡️ Safety Guard: Strict Human-in-the-Loop Pre-Approval Active
  ⚡ Ready for Google for Developers × PromptWars 2026
  `);
});
