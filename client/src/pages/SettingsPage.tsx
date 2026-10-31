import React, { useState } from 'react';
import {
  Settings,
  Key,
  Mail,
  FolderGit2,
  ShieldCheck,
  CheckCircle2,
  Save,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Database
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';
import { sound } from '../services/soundEffects';

export const SettingsPage: React.FC = () => {
  const { player, refreshStats } = useGame();
  const [geminiKey, setGeminiKey] = useState(player.settings?.geminiApiKey || '');
  const [demoMode, setDemoMode] = useState(player.settings?.demoMode ?? true);
  const [gmailConnected, setGmailConnected] = useState(player.settings?.gmailConnected ?? false);
  const [gdriveConnected, setGdriveConnected] = useState(player.settings?.gdriveConnected ?? false);
  const [autoApprove, setAutoApprove] = useState(player.settings?.autoApproveSafeActions ?? false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    try {
      await api.updateSettings({
        geminiApiKey: geminiKey,
        demoMode,
        gmailConnected,
        gdriveConnected,
        autoApproveSafeActions: autoApprove
      });
      await refreshStats();
      sound.playScore();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-cyan-500/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-white">System Settings & Integrations</h2>
            <p className="text-xs text-slate-300">
              Configure Google Gemini API keys, Gmail & Google Drive OAuth integrations, and execution modes.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Google Gemini AI Configuration */}
        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Key className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display font-bold text-lg text-white">Google Gemini API</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              {geminiKey ? "CUSTOM KEY CONFIGURED" : "LOCAL COGNITIVE CORE ACTIVE"}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Enter your Google AI Studio Gemini API key. If left blank, QuestFlow automatically engages its built-in local heuristics reasoning engine with structured mission outputs.
          </p>

          <input
            type="password"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 shadow-inner"
          />
        </div>

        {/* External Service Connections (Gmail & Drive) */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-5">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-lg text-white">Cloud Service Integrations</h3>
          </div>

          <div className="space-y-4">
            {/* Gmail OAuth */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Gmail API Integration</div>
                  <div className="text-xs text-slate-400">OAuth 2.0 Batch message triage & archiving</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGmailConnected(!gmailConnected)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                  gmailConnected
                    ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {gmailConnected ? "CONNECTED (REAL)" : "SANDBOX DEMO"}
              </button>
            </div>

            {/* Google Drive */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-950 text-purple-400">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Google Drive & Local Disk</div>
                  <div className="text-xs text-slate-400">Directory structure synchronization & duplicate purging</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGdriveConnected(!gdriveConnected)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                  gdriveConnected
                    ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {gdriveConnected ? "CONNECTED (DRIVE)" : "LOCAL WORKSPACE"}
              </button>
            </div>
          </div>
        </div>

        {/* Safety & Auto-Approval Controls */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <h3 className="font-display font-bold text-lg text-white">Execution Safety Policy</h3>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Strict Human-in-the-Loop Mode</div>
              <div className="text-xs text-slate-400">
                Always prompt with an Action Manifest preview before deleting, archiving or modifying code.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAutoApprove(!autoApprove)}
              className={`p-2 rounded-xl transition-all ${autoApprove ? 'text-amber-400' : 'text-emerald-400'}`}
            >
              {!autoApprove ? <ToggleLeft className="w-7 h-7" /> : <ToggleRight className="w-7 h-7" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-display font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>SAVE SETTINGS</span>
          </button>
        </div>
      </form>
    </div>
  );
};
