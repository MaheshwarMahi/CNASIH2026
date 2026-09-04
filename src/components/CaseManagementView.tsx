import { useState } from 'react';
import { FolderKanban, Search, MapPin, Users, Calendar, ChevronRight } from 'lucide-react';
import { cases } from '@/data';
import { threatColors } from '@/lib/colors';
import type { CaseFile } from '@/types';

const statusColors: Record<CaseFile['status'], { bg: string; text: string; label: string }> = {
  open: { bg: 'rgba(0, 229, 255, 0.12)', text: '#00E5FF', label: 'Open' },
  'under-investigation': { bg: 'rgba(255, 179, 0, 0.12)', text: '#FFB300', label: 'Under Investigation' },
  closed: { bg: 'rgba(0, 230, 118, 0.12)', text: '#00E676', label: 'Closed' },
  cold: { bg: 'rgba(100, 100, 100, 0.15)', text: '#888888', label: 'Cold Case' },
};

export function CaseManagementView() {
  const [query, setQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);

  const filtered = cases.filter(
    (c) =>
      query.length === 0 ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.firNumber.toLowerCase().includes(query.toLowerCase()) ||
      c.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white/90 mb-1">Case Management</h1>
            <p className="text-sm text-white/40">{cases.length} cases · {cases.filter(c => c.status === 'open' || c.status === 'under-investigation').length} active</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by case title, FIR number, or location..."
            className="w-full h-11 pl-12 pr-4 bg-bg-card border border-white/10 rounded-xl text-sm text-white/90 placeholder:text-white/25 focus:outline-none focus:border-cyan/40 transition-all"
          />
        </div>

        {/* Cases */}
        <div className="space-y-2">
          {filtered.map((c) => {
            const sc = statusColors[c.status];
            const tc = threatColors[c.priority];
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className="card card-hover p-4 cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center flex-shrink-0">
                    <FolderKanban className="w-5 h-5 text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-cyan">{c.firNumber}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {sc.label}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: tc.bg, color: tc.text }}>
                        {tc.label}
                      </span>
                    </div>
                    <div className="text-sm text-white/90 font-medium group-hover:text-cyan transition-colors mb-1">{c.title}</div>
                    <div className="text-xs text-white/50 leading-relaxed mb-2">{c.summary}</div>
                    <div className="flex items-center gap-4 text-[10px] text-white/40">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.date}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.suspects} suspects</span>
                      <span className="flex items-center gap-1 ml-auto"><Users className="w-3 h-3" /> {c.assignedTo}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-cyan transition-colors flex-shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
