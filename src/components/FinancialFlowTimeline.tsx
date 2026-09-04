import { DollarSign, AlertCircle, Brain, ArrowRight } from 'lucide-react';
import { transactions, formatINR } from '@/data';

export function FinancialFlowTimeline() {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-success" />
          <h3 className="text-sm font-semibold text-white/90">Financial Flow Timeline</h3>
        </div>
        <span className="text-[10px] text-white/40">Recent Suspicious Transactions</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
        {sorted.map((tx) => (
          <div
            key={tx.id}
            className={`relative p-3 rounded-lg border transition-all hover:border-white/15 ${
              tx.flagged
                ? 'bg-danger/5 border-danger/15 hover:border-danger/30'
                : 'bg-white/[0.02] border-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-white/40">{tx.date}</span>
              {tx.flagged ? (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-danger/15 text-danger font-medium flex items-center gap-1">
                  <AlertCircle className="w-2.5 h-2.5" /> FLAGGED
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-success/10 text-success/70 font-medium">
                  CLEAR
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white/80 truncate">{tx.fromLabel}</div>
              </div>
              <div className="flex flex-col items-center">
                <ArrowRight className={`w-3.5 h-3.5 ${tx.flagged ? 'text-danger' : 'text-white/30'}`} />
                {tx.aiInferred && (
                  <span className="ai-chip mt-1 flex items-center gap-0.5">
                    <Brain className="w-2 h-2" /> {tx.confidence}%
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-right">
                <div className="text-xs text-white/80 truncate">{tx.toLabel}</div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className={`text-sm font-bold ${tx.flagged ? 'text-danger' : 'text-white/90'}`}>
                {formatINR(tx.amount)}
              </span>
              {/* Flow bar */}
              <div className="flex-1 max-w-[40%] h-1 bg-white/5 rounded-full overflow-hidden ml-3">
                <div
                  className={`h-full rounded-full ${tx.flagged ? 'bg-danger/60' : 'bg-success/40'}`}
                  style={{ width: `${Math.min(100, (tx.amount / 500000) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
