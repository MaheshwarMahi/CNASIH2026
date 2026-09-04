import { useState } from 'react';
import { Filter, FileText, Users, Phone, CreditCard, Car, MapPin, Calendar, Brain, Sparkles, ZoomIn, ZoomOut, Maximize2, Play, Pause } from 'lucide-react';
import { NetworkGraph } from './NetworkGraph';
import type { Entity } from '@/types';

interface NetworkViewProps {
  onEntitySelect: (entity: Entity) => void;
  onExport: () => void;
}

export function NetworkView({ onEntitySelect, onExport }: NetworkViewProps) {
  const [showInferred, setShowInferred] = useState(true);
  const [sources, setSources] = useState({ cdr: true, financial: true, fir: true, social: true });
  const [entityTypes, setEntityTypes] = useState({ person: true, phone: true, account: true, vehicle: true, location: true });
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Filter Panel */}
      <div className="w-64 flex-shrink-0 border-r border-white/5 bg-bg-surface/40 overflow-y-auto scrollbar-thin">
        <div className="p-4 space-y-5">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan" />
            <h3 className="text-sm font-semibold text-white/90">Graph Filters</h3>
          </div>

          {/* Data Sources */}
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Data Sources</div>
            <div className="space-y-1.5">
              {[
                { key: 'cdr' as const, label: 'CDR (Call Records)', icon: Phone },
                { key: 'financial' as const, label: 'Financial Records', icon: CreditCard },
                { key: 'fir' as const, label: 'FIR / Cases', icon: FileText },
                { key: 'social' as const, label: 'Social Media', icon: Users },
              ].map((s) => {
                const Icon = s.icon;
                const checked = sources[s.key];
                return (
                  <label key={s.key} className="flex items-center gap-2 cursor-pointer group">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        checked ? 'bg-cyan/20 border-cyan/50' : 'border-white/15 group-hover:border-white/30'
                      }`}
                      onClick={() => setSources({ ...sources, [s.key]: !checked })}
                    >
                      {checked && <div className="w-2 h-2 rounded-sm bg-cyan" />}
                    </div>
                    <Icon className={`w-3.5 h-3.5 ${checked ? 'text-cyan' : 'text-white/30'}`} />
                    <span className={`text-xs ${checked ? 'text-white/70' : 'text-white/40'}`}>{s.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Entity Types */}
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Entity Types</div>
            <div className="space-y-1.5">
              {[
                { key: 'person' as const, label: 'People', icon: Users, color: '#FF0055' },
                { key: 'phone' as const, label: 'Phones', icon: Phone, color: '#FFB300' },
                { key: 'account' as const, label: 'Accounts', icon: CreditCard, color: '#00E676' },
                { key: 'vehicle' as const, label: 'Vehicles', icon: Car, color: '#FF6400' },
                { key: 'location' as const, label: 'Locations', icon: MapPin, color: '#00E5FF' },
              ].map((t) => {
                const Icon = t.icon;
                const checked = entityTypes[t.key];
                return (
                  <label key={t.key} className="flex items-center gap-2 cursor-pointer group">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        checked ? 'border-cyan/50' : 'border-white/15 group-hover:border-white/30'
                      }`}
                      style={{ backgroundColor: checked ? `${t.color}20` : undefined, borderColor: checked ? `${t.color}50` : undefined }}
                      onClick={() => setEntityTypes({ ...entityTypes, [t.key]: !checked })}
                    >
                      {checked && <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: t.color }} />}
                    </div>
                    <Icon className="w-3.5 h-3.5" style={{ color: checked ? t.color : 'rgba(255,255,255,0.3)' }} />
                    <span className={`text-xs ${checked ? 'text-white/70' : 'text-white/40'}`}>{t.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Time Range */}
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Time Range
            </div>
            <div className="space-y-2">
              <input
                type="date"
                defaultValue="2025-06-01"
                className="w-full h-8 px-2 bg-bg-card border border-white/10 rounded text-xs text-white/70 focus:outline-none focus:border-cyan/40"
              />
              <input
                type="date"
                defaultValue="2025-09-04"
                className="w-full h-8 px-2 bg-bg-card border border-white/10 rounded text-xs text-white/70 focus:outline-none focus:border-cyan/40"
              />
            </div>
          </div>

          {/* AI Toggle */}
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">AI Options</div>
            <button
              onClick={() => setShowInferred(!showInferred)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                showInferred
                  ? 'bg-cyan/10 border-cyan/30 text-cyan'
                  : 'bg-white/[0.02] border-white/10 text-white/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span className="text-xs font-medium">AI-Inferred Links</span>
              </div>
              <div className={`w-8 h-4 rounded-full transition-all relative ${showInferred ? 'bg-cyan/30' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${showInferred ? 'left-4 bg-cyan' : 'left-0.5 bg-white/40'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-bg-surface/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white/90">Network Graph</span>
            <span className="text-[10px] text-white/40 px-2 py-0.5 rounded-full bg-white/5">20 nodes · 23 edges</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setZoom((z) => Math.max(0.3, z - 0.2))}
              className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
            >
              <ZoomOut className="w-4 h-4 text-white/60" />
            </button>
            <span className="text-[10px] text-white/40 w-10 text-center font-mono">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
              className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
            >
              <ZoomIn className="w-4 h-4 text-white/60" />
            </button>
            <button className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors">
              <Maximize2 className="w-4 h-4 text-white/60" />
            </button>
            <div className="h-5 w-px bg-white/10 mx-1" />
            <button
              onClick={() => setPlaying(!playing)}
              className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium transition-all ${
                playing
                  ? 'bg-cyan/15 text-cyan border border-cyan/30'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/20'
              }`}
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {playing ? 'Pause' : 'Playback'}
            </button>
            <div className="h-5 w-px bg-white/10 mx-1" />
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium bg-white/5 text-white/70 border border-white/10 hover:border-cyan/30 hover:text-cyan transition-all"
            >
              <FileText className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        {/* Graph */}
        <div className="flex-1 relative">
          <NetworkGraph
            height="100%"
            showInferred={showInferred}
            onNodeClick={onEntitySelect}
          />

          {/* Playback timeline */}
          {playing && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/3 glass-strong rounded-lg p-3 animate-slide-in-up">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-white/40 font-mono whitespace-nowrap">Jun 2025</span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-cyan/40 rounded-full" />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan shadow-lg shadow-cyan/30" style={{ left: '33%' }} />
                </div>
                <span className="text-[10px] text-white/40 font-mono whitespace-nowrap">Sep 2025</span>
              </div>
              <div className="text-[10px] text-cyan/70 text-center mt-1.5">Animating network evolution over time...</div>
            </div>
          )}
        </div>

        {/* AI FAB */}
        <button className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-cyan/30 to-cyan/10 border border-cyan/40 flex items-center justify-center shadow-lg shadow-cyan/20 hover:scale-110 transition-transform animate-glow z-10 group">
          <Sparkles className="w-6 h-6 text-cyan" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan text-[9px] font-bold text-bg-base flex items-center justify-center">4</span>
        </button>
      </div>
    </div>
  );
}
