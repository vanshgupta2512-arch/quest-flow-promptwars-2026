import React, { useState, useEffect } from 'react';
import {
  CircleDollarSign,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  Upload,
  Download,
  Sparkles,
  Zap,
  RotateCcw,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';
import { sound } from '../services/soundEffects';

interface ExpenseItem {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  type: string;
  status: string;
  isRecurring: boolean;
  isAnomaly: boolean;
  flagReason: string | null;
}

export const MoneyMission: React.FC = () => {
  const { setPendingManifest } = useGame();
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [reviewed, setReviewed] = useState<Array<{ id: string; merchant: string; amount: number; decision: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [potentialSavings, setPotentialSavings] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const res = await api.getExpenses();
      if (res?.expenses) {
        setExpenses(res.expenses);
      }
    } catch (e) {
      // ignore
    }
  };

  const currentExpense = expenses[currentIndex];

  const handleDecision = (decision: 'business_necessity' | 'personal_necessity' | 'cancel_subscription' | 'flag_anomaly') => {
    if (!currentExpense) return;

    sound.playSwipe();

    let gainedScore = 40;
    if (decision === 'cancel_subscription') {
      sound.playScore();
      setPotentialSavings(prev => prev + currentExpense.amount);
      gainedScore = 80;
    } else if (decision === 'flag_anomaly') {
      sound.playLaser();
      gainedScore = 100;
    }

    setScore(prev => prev + gainedScore);

    const newReviewed = [
      ...reviewed,
      {
        id: currentExpense.id,
        merchant: currentExpense.merchant,
        amount: currentExpense.amount,
        decision
      }
    ];
    setReviewed(newReviewed);

    if (currentIndex + 1 >= expenses.length) {
      handleFinish(newReviewed);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleFinish = async (items: any[]) => {
    sound.playVictory();
    try {
      const res = await api.createExpenseManifest(items);
      if (res.success && res.manifest) {
        setPendingManifest(res.manifest);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setCurrentIndex(0);
    setReviewed([]);
    setPotentialSavings(0);
    setScore(0);
    loadExpenses();
  };

  // CSV Export
  const exportCSV = () => {
    sound.playClick();
    const rows = [
      ["ID", "Date", "Merchant", "Amount", "Category", "Decision"],
      ...reviewed.map(r => [r.id, "2026-10", r.merchant, `$${r.amount}`, "Audited", r.decision])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `questflow_financial_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-amber-500/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <CircleDollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-2xl text-white">Money Mission</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-500/30 text-amber-300">
                FINANCIAL ANOMALY DETECTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Audit transactions, catch zombie subscriptions, and isolate anomalies. Zero external transactions initiated.
            </p>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl font-mono text-xs">
            <div className="text-[9px] uppercase text-slate-400">Identified Savings</div>
            <div className="text-emerald-400 font-bold">${potentialSavings.toFixed(2)}/mo</div>
          </div>

          <div className="bg-slate-900/90 border border-amber-500/30 px-3.5 py-1.5 rounded-xl font-mono text-xs">
            <div className="text-[9px] uppercase text-slate-400">Score</div>
            <div className="text-amber-400 font-bold">{score} PTS</div>
          </div>
        </div>
      </div>

      {currentIndex < expenses.length && currentExpense ? (
        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2">
            <span>TRANSACTION {currentIndex + 1} OF {expenses.length}</span>
            <span className="text-amber-400">+35 XP / Audited Transaction</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / expenses.length) * 100}%` }}
            />
          </div>

          {/* Interactive Transaction Review Card */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel-glow border-2 border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.15)] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400">{currentExpense.date}</span>
                <h3 className="font-display font-bold text-2xl text-white mt-0.5">
                  {currentExpense.merchant}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400">AMOUNT</span>
                <div className="font-display font-black text-2xl text-white">
                  ${currentExpense.amount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* AI Flag / Reason */}
            {currentExpense.flagReason ? (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 text-xs text-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300">ANOMALY RADAR ALERT:</div>
                  <div className="mt-0.5 leading-relaxed">{currentExpense.flagReason}</div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Category: {currentExpense.category}</span>
                </div>
                <span className="font-mono text-slate-400">
                  {currentExpense.isRecurring ? "Recurring Monthly" : "One-Time"}
                </span>
              </div>
            )}

            {/* Decision Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <button
                onClick={() => handleDecision('business_necessity')}
                className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/40 text-left transition-all cursor-pointer group"
              >
                <div className="font-display font-bold text-xs text-emerald-400 group-hover:translate-x-1 transition-transform">
                  ✓ VERIFY BUSINESS EXPENSE
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Tag as legitimate software / infrastructure expense for tax ledger.
                </div>
              </button>

              <button
                onClick={() => handleDecision('personal_necessity')}
                className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 text-left transition-all cursor-pointer group"
              >
                <div className="font-display font-bold text-xs text-cyan-400 group-hover:translate-x-1 transition-transform">
                  ✓ KEEP PERSONAL NECESSITY
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Approve as verified essential personal expenditure.
                </div>
              </button>

              <button
                onClick={() => handleDecision('cancel_subscription')}
                className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/40 text-left transition-all cursor-pointer group"
              >
                <div className="font-display font-bold text-xs text-amber-400 group-hover:translate-x-1 transition-transform">
                  ✂️ FLAG UNUSED SUBSCRIPTION
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Queue for cancellation. Saves ${currentExpense.amount.toFixed(2)}/mo recurring burn.
                </div>
              </button>

              <button
                onClick={() => handleDecision('flag_anomaly')}
                className="p-4 rounded-2xl bg-slate-900/90 border border-red-500/30 hover:border-red-400 hover:bg-red-950/40 text-left transition-all cursor-pointer group"
              >
                <div className="font-display font-bold text-xs text-red-400 group-hover:translate-x-1 transition-transform">
                  🚨 QUARANTINE ANOMALY / FRAUD
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Isolate suspicious foreign or unrecognized transaction for bank dispute.
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Round Complete Screen */
        <div className="glass-panel-glow rounded-3xl p-8 text-center space-y-6 border border-emerald-500/40">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)]">
            <CheckCircle className="w-8 h-8 text-slate-950" />
          </div>

          <div>
            <h3 className="font-display font-bold text-2xl text-white">
              FINANCIAL AUDIT COMPLETE!
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              You reviewed {reviewed.length} transactions and discovered ${potentialSavings.toFixed(2)}/mo in potential savings!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2 max-w-lg mx-auto text-xs font-mono">
            <div className="text-slate-400 border-b border-slate-800 pb-2">Audited Transactions:</div>
            {reviewed.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-slate-300 truncate max-w-[200px]">{item.merchant}</span>
                <span className="text-slate-400">${item.amount.toFixed(2)}</span>
                <span className="text-amber-400 text-[10px] uppercase font-bold">{item.decision}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-mono"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Audited CSV</span>
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-mono"
            >
              Audit Another Batch
            </button>
            <button
              onClick={() => handleFinish(reviewed)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-display font-bold text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
            >
              Commit Ledger & Claim XP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
