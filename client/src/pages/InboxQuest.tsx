import React, { useState, useEffect } from 'react';
import {
  Mail,
  Archive,
  Star,
  Trash2,
  MailX,
  Flame,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Zap,
  Info,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';
import { sound } from '../services/soundEffects';

interface EmailItem {
  id: string;
  sender: string;
  senderName: string;
  subject: string;
  snippet: string;
  date: string;
  category: string;
  recommendedAction: string;
  size: string;
  isUnread: boolean;
}

export const InboxQuest: React.FC = () => {
  const { player, setPendingManifest, setActivePage } = useGame();
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [triagedActions, setTriagedActions] = useState<Array<{ id: string; subject: string; sender: string; action: string }>>([]);
  const [combo, setCombo] = useState(1);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState('SANDBOX_MOCK_INBOX');

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    setIsLoading(true);
    try {
      const res = await api.getEmails();
      if (res?.emails) {
        setEmails(res.emails);
        setSource(res.source || 'SANDBOX_MOCK_INBOX');
      }
    } catch (e) {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  const currentEmail = emails[currentIndex];

  const handleAction = (action: 'archive' | 'keep' | 'trash' | 'unsubscribe') => {
    if (!currentEmail) return;

    if (action === 'archive' || action === 'keep') {
      sound.playSwipe();
    } else if (action === 'trash') {
      sound.playLaser();
    } else {
      sound.playClick();
    }

    const isOptimal = currentEmail.recommendedAction === action;
    if (isOptimal) {
      sound.playScore();
      setCombo(prev => Math.min(prev + 1, 5));
      setScore(prev => prev + 50 * combo);
    } else {
      setCombo(1);
      setScore(prev => prev + 25);
    }

    const newTriaged = [
      ...triagedActions,
      {
        id: currentEmail.id,
        subject: currentEmail.subject,
        sender: currentEmail.senderName,
        action
      }
    ];
    setTriagedActions(newTriaged);

    if (currentIndex + 1 >= emails.length) {
      // Quest round complete! Generate Action Manifest for Human-in-the-Loop review
      finishQuest(newTriaged);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const finishQuest = async (actionsToSubmit: any[]) => {
    try {
      sound.playVictory();
      const res = await api.createEmailManifest(actionsToSubmit);
      if (res.success && res.manifest) {
        setPendingManifest(res.manifest);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setCurrentIndex(0);
    setTriagedActions([]);
    setCombo(1);
    setScore(0);
    loadEmails();
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex >= emails.length) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') handleAction('archive');
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') handleAction('keep');
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') handleAction('trash');
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') handleAction('unsubscribe');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, emails, triagedActions, combo]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Game Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-cyan-500/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-2xl text-white">Inbox Quest</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                {source === 'REAL_GMAIL_API' ? 'GMAIL LIVE OAUTH' : 'REALISTIC SANDBOX INBOX'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Swipe or use keyboard controls to triage emails. Approved actions execute against real inbox metadata.
            </p>
          </div>
        </div>

        {/* Live Score & Combo Meter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 px-3.5 py-1.5 rounded-xl">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-amber-400">{combo}x COMBO</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-white">{score} PTS</span>
          </div>
        </div>
      </div>

      {/* Arena Stage */}
      {currentIndex < emails.length && currentEmail ? (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2">
            <span>MESSAGE {currentIndex + 1} OF {emails.length}</span>
            <span className="text-cyan-400">+{25 * combo} Potential XP / Action</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / emails.length) * 100}%` }}
            />
          </div>

          {/* Interactive Email Card (Tinder / Arcade Style) */}
          <div className="relative glass-panel-glow border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_40px_rgba(0,240,255,0.15)] transition-all">
            {/* Top Meta */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                  {currentEmail.senderName.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{currentEmail.senderName}</div>
                  <div className="text-xs text-slate-400 font-mono">{currentEmail.sender}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {currentEmail.date}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  {currentEmail.category}
                </span>
              </div>
            </div>

            {/* Email Body Snippet */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-xl text-white">
                {currentEmail.subject}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                {currentEmail.snippet}
              </p>
            </div>

            {/* AI Advisor Pill */}
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Recommendation: {currentEmail.recommendedAction.toUpperCase()}</span>
              </div>
              <span className="text-slate-400">{currentEmail.size}</span>
            </div>

            {/* Action Controller Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleAction('archive')}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/50 transition-all cursor-pointer shadow-md"
              >
                <Archive className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-display font-bold text-xs text-white">ARCHIVE</span>
                <span className="text-[10px] font-mono text-slate-400">[Key A / ←]</span>
              </button>

              <button
                onClick={() => handleAction('keep')}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/50 transition-all cursor-pointer shadow-md"
              >
                <Star className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-display font-bold text-xs text-white">KEEP IMPORTANT</span>
                <span className="text-[10px] font-mono text-slate-400">[Key D / →]</span>
              </button>

              <button
                onClick={() => handleAction('unsubscribe')}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-950/50 transition-all cursor-pointer shadow-md"
              >
                <MailX className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-display font-bold text-xs text-white">UNSUBSCRIBE</span>
                <span className="text-[10px] font-mono text-slate-400">[Key W / ↑]</span>
              </button>

              <button
                onClick={() => handleAction('trash')}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-red-500/30 hover:border-red-400 hover:bg-red-950/50 transition-all cursor-pointer shadow-md"
              >
                <Trash2 className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-display font-bold text-xs text-white">QUARANTINE SPAM</span>
                <span className="text-[10px] font-mono text-slate-400">[Key S / ↓]</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Round Completed Summary */
        <div className="glass-panel-glow rounded-3xl p-8 text-center space-y-6 border border-emerald-500/40">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
            <CheckCircle2 className="w-8 h-8 text-slate-950" />
          </div>

          <div>
            <h3 className="font-display font-bold text-2xl text-white">
              INBOX QUEST COMPLETED!
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              You triaged {triagedActions.length} messages with {score} game points!
            </p>
          </div>

          {/* Triaged Manifest Summary */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2 max-w-lg mx-auto text-xs font-mono">
            <div className="text-slate-400 border-b border-slate-800 pb-2">Proposed Real Actions:</div>
            {triagedActions.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-slate-300 truncate max-w-[280px]">{item.subject}</span>
                <span className="text-cyan-400 uppercase font-bold">{item.action}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
            >
              Play Another Batch
            </button>
            <button
              onClick={() => finishQuest(triagedActions)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-display font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
            >
              Review & Execute Real Actions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
