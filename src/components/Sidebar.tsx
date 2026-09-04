import { LayoutDashboard, Network, Search, FolderKanban, BellRing, FileText, Settings, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import type { ViewName } from '@/types';

interface SidebarProps {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  alertCount: number;
}

const navItems: { id: ViewName; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'network', label: 'Network Graph', icon: Network },
  { id: 'search', label: 'Entity Search', icon: Search },
  { id: 'cases', label: 'Case Management', icon: FolderKanban },
  { id: 'alerts', label: 'Alerts & Watchlists', icon: BellRing },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Admin / Settings', icon: Settings },
];

export function Sidebar({ currentView, onNavigate, collapsed, onToggleCollapse, alertCount }: SidebarProps) {
  return (
    <aside
      className={`${collapsed ? 'w-16' : 'w-56'} flex-shrink-0 border-r border-white/5 bg-bg-surface/60 backdrop-blur-xl flex flex-col transition-all duration-300 relative`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-bg-elevated border border-white/10 flex items-center justify-center hover:border-cyan/40 transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-white/60" /> : <ChevronLeft className="w-3.5 h-3.5 text-white/60" />}
      </button>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                isActive
                  ? 'bg-cyan/10 text-cyan border border-cyan/20'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'
              }`}
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan rounded-r-full" />}
              <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-cyan' : ''}`} />
              {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
              {!collapsed && item.id === 'alerts' && alertCount > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-danger/20 text-danger text-[10px] font-bold flex items-center justify-center border border-danger/30">
                  {alertCount}
                </span>
              )}
              {collapsed && item.id === 'alerts' && alertCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger animate-pulse-slow" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-success" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[11px] text-white/70 font-medium leading-tight">Secure Connection</div>
              <div className="text-[9px] text-white/30 leading-tight">End-to-end encrypted</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
