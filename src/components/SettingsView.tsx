import { Settings, Shield, Database, Bell, Lock, Users, Brain, Eye } from 'lucide-react';

export function SettingsView() {
  const sections = [
    {
      title: 'System Configuration',
      icon: Settings,
      items: [
        { label: 'Data Ingestion Pipeline', desc: 'CDR, FIR, Financial, Social Media sources', status: 'Active' },
        { label: 'AI Inference Engine', desc: 'Pattern recognition and link inference', status: 'Active' },
        { label: 'Real-time Alert System', desc: 'Automated threat detection alerts', status: 'Active' },
        { label: 'Geospatial Mapping', desc: 'Heat map and ANPR integration', status: 'Active' },
      ],
    },
    {
      title: 'Security & Access',
      icon: Shield,
      items: [
        { label: 'Two-Factor Authentication', desc: 'Required for all analyst accounts', status: 'Enabled' },
        { label: 'Audit Logging', desc: 'All actions logged for compliance', status: 'Enabled' },
        { label: 'Data Encryption', desc: 'End-to-end encryption for all data', status: 'AES-256' },
        { label: 'Session Timeout', desc: 'Auto-logout after inactivity', status: '30 min' },
      ],
    },
    {
      title: 'AI Configuration',
      icon: Brain,
      items: [
        { label: 'Confidence Threshold', desc: 'Minimum confidence for AI-inferred links', status: '60%' },
        { label: 'Inference Model', desc: 'Pattern recognition model version', status: 'v3.2.1' },
        { label: 'Auto-Suggest Actions', desc: 'AI investigative step recommendations', status: 'Enabled' },
        { label: 'Threat Prediction', desc: 'Predictive threat modeling', status: 'Beta' },
      ],
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white/90 mb-1">Admin / Settings</h1>
          <p className="text-sm text-white/40">System configuration and security settings</p>
        </div>

        {/* User Profile Card */}
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan/30 to-cyan/10 border border-cyan/30 flex items-center justify-center text-lg font-bold text-cyan">
              RS
            </div>
            <div className="flex-1">
              <div className="text-sm text-white/90 font-medium">Rajesh Sharma</div>
              <div className="text-xs text-white/40">Senior Investigator · Level 4 Clearance</div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-success/15 text-success font-medium flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" /> Active
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan/15 text-cyan font-medium flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> 2FA Enabled
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-cyan" />
                <h2 className="text-xs text-white/60 uppercase tracking-wider font-semibold">{section.title}</h2>
              </div>
              <div className="card divide-y divide-white/5">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3.5 hover:bg-white/[0.02] transition-colors group">
                    <div className="min-w-0">
                      <div className="text-sm text-white/80 font-medium">{item.label}</div>
                      <div className="text-[11px] text-white/40 mt-0.5">{item.desc}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] px-2 py-1 rounded font-medium ${
                        item.status === 'Active' || item.status === 'Enabled'
                          ? 'bg-success/15 text-success'
                          : item.status === 'Beta'
                            ? 'bg-warning/15 text-warning'
                            : 'bg-cyan/15 text-cyan'
                      }`}>
                        {item.status}
                      </span>
                      <Eye className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
