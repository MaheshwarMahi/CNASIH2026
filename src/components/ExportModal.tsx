import { useState } from 'react';
import { X, FileText, FileSpreadsheet, Presentation, Shield, Calendar } from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  viewName: string;
}

export function ExportModal({ open, onClose, viewName }: ExportModalProps) {
  const [format, setFormat] = useState<'pdf' | 'excel' | 'ppt'>('pdf');
  const [classification, setClassification] = useState<'top-secret' | 'secret' | 'confidential' | 'restricted'>('secret');
  const [dateRange, setDateRange] = useState({ from: '2025-08-01', to: '2025-09-04' });

  if (!open) return null;

  const formats = [
    { id: 'pdf' as const, label: 'PDF Report', icon: FileText, desc: 'Formatted intelligence brief' },
    { id: 'excel' as const, label: 'Excel Sheet', icon: FileSpreadsheet, desc: 'Raw data export with all fields' },
    { id: 'ppt' as const, label: 'PowerPoint', icon: Presentation, desc: 'Briefing presentation slides' },
  ];

  const classifications = [
    { id: 'top-secret' as const, label: 'TOP SECRET', color: '#FF0055' },
    { id: 'secret' as const, label: 'SECRET', color: '#FFB300' },
    { id: 'confidential' as const, label: 'CONFIDENTIAL', color: '#00E5FF' },
    { id: 'restricted' as const, label: 'RESTRICTED', color: '#00E676' },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-strong rounded-xl z-50 animate-slide-in-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Shield className="w-4.5 h-4.5 text-cyan" />
            <h2 className="text-sm font-semibold text-white/90">Export Intelligence Report</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Source View */}
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Source View</div>
            <div className="card px-3 py-2 text-sm text-white/70">{viewName}</div>
          </div>

          {/* Format Selection */}
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Export Format</div>
            <div className="grid grid-cols-3 gap-2">
              {formats.map((f) => {
                const Icon = f.icon;
                const isActive = format === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isActive
                        ? 'bg-cyan/10 border-cyan/30'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-cyan' : 'text-white/40'}`} />
                    <div className={`text-xs font-medium ${isActive ? 'text-cyan' : 'text-white/70'}`}>{f.label}</div>
                    <div className="text-[10px] text-white/30 mt-0.5">{f.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Data Range
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-white/40 block mb-1">From</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="w-full h-9 px-3 bg-bg-card border border-white/10 rounded-lg text-sm text-white/80 focus:outline-none focus:border-cyan/40"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/40 block mb-1">To</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="w-full h-9 px-3 bg-bg-card border border-white/10 rounded-lg text-sm text-white/80 focus:outline-none focus:border-cyan/40"
                />
              </div>
            </div>
          </div>

          {/* Security Classification */}
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Security Classification Header</div>
            <div className="grid grid-cols-2 gap-2">
              {classifications.map((c) => {
                const isActive = classification === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setClassification(c.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold tracking-wide transition-all ${
                      isActive ? 'border-current' : 'border-white/5 hover:border-white/15'
                    }`}
                    style={{
                      backgroundColor: isActive ? `${c.color}15` : 'rgba(255,255,255,0.02)',
                      color: isActive ? c.color : 'rgba(255,255,255,0.4)',
                      borderColor: isActive ? `${c.color}40` : undefined,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-white/60 hover:text-white/90 transition-colors rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-cyan/15 text-cyan border border-cyan/30 rounded-lg hover:bg-cyan/25 transition-all"
          >
            Generate Report
          </button>
        </div>
      </div>
    </>
  );
}
