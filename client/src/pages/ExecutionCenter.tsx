import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Zap,
  ArrowRight,
  FileCheck2,
  Mail,
  FolderOpen,
  CircleDollarSign,
  Bug
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { api, TaskManifest } from '../services/api';
import { sound } from '../services/soundEffects';

export const ExecutionCenter: React.FC = () => {
  const { setPendingManifest } = useGame();
  const [tasks, setTasks] = useState<TaskManifest[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'AWAITING_APPROVAL' | 'COMPLETED'>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const res = await api.getQueue();
      if (res?.tasks) {
        setTasks(res.tasks);
      }
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'AWAITING_APPROVAL') return t.status === 'AWAITING_APPROVAL';
    if (filter === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  const getGameIcon = (type: string) => {
    switch (type) {
      case 'inbox-quest': return Mail;
      case 'file-frenzy': return FolderOpen;
      case 'money-mission': return CircleDollarSign;
      case 'bug-hunter': return Bug;
      default: return FileCheck2;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-cyan-500/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-2xl text-white">Execution Hub</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300">
                STRICT VERIFIED AUDIT
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Audit and monitor real background task execution. Operations execute only with user approval.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { sound.playClick(); loadTasks(); }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(['ALL', 'AWAITING_APPROVAL', 'COMPLETED'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { sound.playClick(); setFilter(tab); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              filter === tab
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.replace('_', ' ')} ({tab === 'ALL' ? tasks.length : tasks.filter(t => t.status === tab).length})
          </button>
        ))}
      </div>

      {/* Task Queue Cards */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-3xl border border-slate-800 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-display text-slate-400">No tasks in this filter queue</div>
            <p className="text-xs text-slate-500">Play a mission in any game to generate an execution manifest.</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const Icon = getGameIcon(task.gameType);
            const isAwaiting = task.status === 'AWAITING_APPROVAL';

            return (
              <div
                key={task.id}
                className={`p-6 rounded-3xl glass-panel border transition-all ${
                  isAwaiting
                    ? 'border-cyan-500/50 shadow-[0_0_25px_rgba(0,240,255,0.15)] bg-slate-900/90'
                    : 'border-slate-800 bg-slate-950/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {task.id}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isAwaiting
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/30 animate-pulse'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-lg text-white">
                        {task.title}
                      </h4>
                      <div className="text-xs text-slate-400 font-mono flex items-center gap-3">
                        <span>Items: {task.itemsCount}</span>
                        <span>•</span>
                        <span>Created: {new Date(task.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {isAwaiting ? (
                      <button
                        onClick={() => { sound.playClick(); setPendingManifest(task); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-display font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
                      >
                        <span>Review & Approve</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="text-right">
                        <div className="text-xs font-mono text-emerald-400 font-bold">
                          +{task.xpAwarded} Verified XP
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {task.receipt?.auditId || "RECEIPT VERIFIED"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audit Receipt Dropdown / Log */}
                {task.receipt && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/60 text-xs font-mono text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-slate-500">METHOD: </span>
                      <span className="text-slate-300">{task.receipt.executionMethod}</span>
                    </div>
                    <div className="italic text-slate-300">
                      "{task.receipt.message}"
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
