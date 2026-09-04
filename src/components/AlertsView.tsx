import { useState } from 'react';
import { BellRing, AlertCircle, Search, X, Bookmark, Eye, Brain, Clock } from 'lucide-react';
import { alerts as initialAlerts } from '@/data';
import { threatColors } from '@/lib/colors';
import type { Alert, Entity } from '@/types';

interface AlertsViewProps {
  onInvestigate?: (alert: Alert) => void;
  onEntitySelect?: (entity: Entity) => void;
}

export function AlertsView({ onInvestigate }: AlertsViewProps) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<'all' | 'new' | 'investigating' | 'dismissed'>('all');

  const filtered = alerts.filter((a) => filter === 'all' || a.status === filter);

  function updateStatus(id: string, status: Alert['status']) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  const counts = {
    all: alerts.length,
    new: alerts.filter((a) => a.status === 'new').length,
    investigating: alerts.filter((a) => a.status === 'investigating').length,
    dismissed: alerts.filter((a) => a.status === 'dismissed').length,
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white/90 mb-1">Alerts & Watchlists</h1>
            <p className="text-sm text-white/40">{counts.new} new alerts require attention</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-4">
          {(['all', 'new', 'investigating', 'dismissed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                filter === f
                  ? 'bg-cyan/10 text-cyan border-cyan/30'
                  : 'bg-white/[0.02] text-white/50 border-white/5 hover:border-white/15'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-cyan/20' : 'bg-white/5'}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* Alerts */}
        <div className="space-y-2">
          {filtered.map((alert) => {
            const tc = threatColors[alert.severity];
            return (
              <div
                key={alert.id}
                className={`card p-4 transition-all ${
                  alert.status === 'dismissed'
                    ? 'opacity-40'
                    : alert.status === 'new'
                      ? 'border-l-2'
                      : ''
                }`}
                style={{ borderLeftColor: alert.status === 'new' ? tc.text : undefined }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border"
                    style={{ backgroundColor: tc.bg, borderColor: `${tc.text}30` }}
                  >
                    <AlertCircle className="w-5 h-5" style={{ color: tc.text }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm text-white/90 font-medium">{alert.title}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: tc.bg, color: tc.text }}>
                        {tc.label}
                      </span>
                      {alert.aiInferred && <span className="ai-chip flex items-center gap-0.5"><Brain className="w-2.5 h-2.5" /> AI</span>}
                      <span className="flex items-center gap-1 text-[10px] text-white/30 ml-auto">
                        <Clock className="w-2.5 h-2.5" /> {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed mb-2">{alert.description}</p>
                    <div className="text-[10px] text-white/30 mb-2">Source: {alert.source}</div>

                    {alert.status !== 'dismissed' && (
                      <div className="flex items-center gap-1.5">
                        {alert.status === 'new' && (
                          <button
                            onClick={() => onInvestigate?.(alert)}
                            className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors"
                          >
                            <Search className="w-2.5 h-2.5" /> Investigate
                          </button>
                        )}
                        <button
                          onClick={() => updateStatus(alert.id, 'investigating')}
                          className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
                        >
                          <Eye className="w-2.5 h-2.5" /> Mark Investigating
                        </button>
                        <button
                          onClick={() => updateStatus(alert.id, 'dismissed')}
                          className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-white/5 text-white/50 hover:bg-white/10 transition-colors"
                        >
                          <X className="w-2.5 h-2.5" /> Dismiss
                        </button>
                        <button
                          className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                        >
                          <Bookmark className="w-2.5 h-2.5" /> Watchlist
                        </button>
                      </div>
                    )}
                    {alert.status === 'dismissed' && (
                      <button
                        onClick={() => updateStatus(alert.id, 'new')}
                        className="text-[10px] text-white/40 hover:text-white/70 transition-colors"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BellRing className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">No alerts in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
