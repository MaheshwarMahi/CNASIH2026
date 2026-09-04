import { FileText, Download, Shield, Clock, CheckCircle } from 'lucide-react';

interface ReportsViewProps {
  onExport: () => void;
}

const reportTemplates = [
  { id: 'R1', title: 'Network Analysis Brief', desc: 'Full network graph with entity relationships and AI-inferred links', icon: 'network', lastGenerated: '03 Sep 2025', classification: 'SECRET' },
  { id: 'R2', title: 'Financial Trail Report', desc: 'Money flow analysis with flagged transactions and structuring patterns', icon: 'financial', lastGenerated: '02 Sep 2025', classification: 'TOP SECRET' },
  { id: 'R3', title: 'Entity Dossier', desc: 'Comprehensive profile of monitored entities with criminal records', icon: 'entity', lastGenerated: '01 Sep 2025', classification: 'SECRET' },
  { id: 'R4', title: 'Threat Assessment Summary', desc: 'Geospatial threat map with hotspot analysis and predictions', icon: 'threat', lastGenerated: '30 Aug 2025', classification: 'CONFIDENTIAL' },
  { id: 'R5', title: 'Case Status Overview', desc: 'All active investigations with suspect counts and progress', icon: 'case', lastGenerated: '28 Aug 2025', classification: 'RESTRICTED' },
  { id: 'R6', title: 'AI Intelligence Summary', desc: 'AI-generated investigative recommendations and confidence scores', icon: 'ai', lastGenerated: '04 Sep 2025', classification: 'TOP SECRET' },
];

const classColors: Record<string, string> = {
  'TOP SECRET': '#FF0055',
  SECRET: '#FFB300',
  CONFIDENTIAL: '#00E5FF',
  RESTRICTED: '#00E676',
};

export function ReportsView({ onExport }: ReportsViewProps) {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white/90 mb-1">Reports</h1>
            <p className="text-sm text-white/40">Generate and export intelligence reports</p>
          </div>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-cyan/15 text-cyan border border-cyan/30 hover:bg-cyan/25 transition-all"
          >
            <FileText className="w-4 h-4" /> New Report
          </button>
        </div>

        {/* Recent Reports */}
        <div className="mb-6">
          <h2 className="text-xs text-white/40 uppercase tracking-wider mb-3">Recent Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reportTemplates.map((r) => (
              <div key={r.id} className="card card-hover p-4 group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-cyan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-white/90 font-medium">{r.title}</span>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed mb-2">{r.desc}</p>
                    <div className="flex items-center gap-3 text-[10px] text-white/40">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {r.lastGenerated}
                      </span>
                      <span
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded font-medium"
                        style={{ backgroundColor: `${classColors[r.classification]}15`, color: classColors[r.classification] }}
                      >
                        <Shield className="w-2.5 h-2.5" /> {r.classification}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-white/5 text-white/60 hover:bg-white/10 transition-colors">
                    <Download className="w-3 h-3" /> Download
                  </button>
                  <button className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors">
                    <CheckCircle className="w-3 h-3" /> Regenerate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
