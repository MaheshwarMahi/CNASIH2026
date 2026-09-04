import { Activity, Search, Eye, X, Bookmark } from 'lucide-react';
import { activityFeed } from '@/data';
import { threatColors } from '@/lib/colors';
import type { ActivityItem } from '@/types';

interface ActivityFeedProps {
  onInvestigate?: (item: ActivityItem) => void;
  onDismiss?: (id: string) => void;
  onWatchlist?: (id: string) => void;
}

const sourceColors: Record<string, string> = {
  CDR: '#00E5FF',
  FIR: '#FF0055',
  Financial: '#00E676',
  'Social Media': '#FFB300',
  Surveillance: '#FF6400',
  AI: '#00E5FF',
};

export function ActivityFeed({ onInvestigate, onDismiss, onWatchlist }: ActivityFeedProps) {
  return (
    <div className="card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan" />
          <h3 className="text-sm font-semibold text-white/90">Recent Activity & Alerts</h3>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-slow" />
          LIVE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
        {activityFeed.map((item) => {
          const tc = threatColors[item.threatLevel];
          return (
            <div
              key={item.id}
              className="group p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all"
            >
              <div className="flex items-start gap-2 mb-2">
                <div
                  className="w-1 h-full rounded-full flex-shrink-0 self-stretch"
                  style={{ backgroundColor: tc.border }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                      style={{
                        backgroundColor: `${sourceColors[item.source]}15`,
                        color: sourceColors[item.source],
                      }}
                    >
                      {item.source}
                    </span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                      style={{ backgroundColor: tc.bg, color: tc.text }}
                    >
                      {tc.label}
                    </span>
                    {item.aiInferred && <span className="ai-chip flex-shrink-0">AI</span>}
                    <span className="text-[10px] text-white/30 ml-auto flex-shrink-0">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onInvestigate?.(item)}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors"
                >
                  <Search className="w-2.5 h-2.5" /> Investigate
                </button>
                <button
                  onClick={() => onDismiss?.(item.id)}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-white/5 text-white/50 hover:bg-white/10 transition-colors"
                >
                  <X className="w-2.5 h-2.5" /> Dismiss
                </button>
                <button
                  onClick={() => onWatchlist?.(item.id)}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
                >
                  <Bookmark className="w-2.5 h-2.5" /> Watchlist
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
