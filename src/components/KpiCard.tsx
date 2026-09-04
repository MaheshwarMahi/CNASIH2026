import { TrendingUp, TrendingDown, Users, FolderKanban, BellRing, Network } from 'lucide-react';

interface KpiCardProps {
  icon: typeof Users;
  label: string;
  value: string;
  subValue?: string;
  trend?: string;
  trendUp?: boolean;
  color: 'cyan' | 'danger' | 'warning' | 'success';
  badge?: { text: string; color: string };
}

const colorMap = {
  cyan: { text: 'text-cyan', bg: 'bg-cyan/10', border: 'border-cyan/20', glow: 'rgba(0, 229, 255, 0.1)' },
  danger: { text: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20', glow: 'rgba(255, 0, 85, 0.1)' },
  warning: { text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', glow: 'rgba(255, 179, 0, 0.1)' },
  success: { text: 'text-success', bg: 'bg-success/10', border: 'border-success/20', glow: 'rgba(0, 230, 118, 0.1)' },
};

export function KpiCard({ icon: Icon, label, value, subValue, trend, trendUp, color, badge }: KpiCardProps) {
  const c = colorMap[color];
  return (
    <div className="card card-hover p-4 relative overflow-hidden group">
      <div
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-50 transition-opacity group-hover:opacity-80"
        style={{ backgroundColor: c.glow }}
      />
      <div className="relative flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${c.bg} ${c.border} border flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
        {badge && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium animate-pulse-slow"
            style={{ backgroundColor: `${badge.color}15`, color: badge.color, border: `1px solid ${badge.color}30` }}
          >
            {badge.text}
          </span>
        )}
        {trend && !badge && (
          <div className={`flex items-center gap-1 text-xs ${trendUp ? 'text-success' : 'text-danger'}`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      <div className="relative">
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        <div className="text-xs text-white/40 mt-0.5">{label}</div>
        {subValue && <div className={`text-[11px] mt-1 ${c.text}`}>{subValue}</div>}
      </div>
    </div>
  );
}

export function KpiRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard
        icon={Users}
        label="Total Entities Monitored"
        value="12,847"
        trend="+5.2%"
        trendUp
        color="cyan"
      />
      <KpiCard
        icon={FolderKanban}
        label="Active Investigations"
        value="342"
        subValue="24 High Priority"
        color="warning"
      />
      <KpiCard
        icon={BellRing}
        label="Real-Time Alerts"
        value="6"
        badge={{ text: '3 CRITICAL', color: '#FF0055' }}
        color="danger"
      />
      <KpiCard
        icon={Network}
        label="Network Density"
        value="78.4%"
        subValue="High interconnectedness"
        trend="+2.1%"
        trendUp
        color="success"
      />
    </div>
  );
}
