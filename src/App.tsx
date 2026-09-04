import { useState, useCallback } from 'react';
import { TopBar } from '@/components/TopBar';
import { Sidebar } from '@/components/Sidebar';
import { KpiRow } from '@/components/KpiCard';
import { ThreatHeatMap } from '@/components/ThreatHeatMap';
import { NetworkGraph } from '@/components/NetworkGraph';
import { FinancialFlowTimeline } from '@/components/FinancialFlowTimeline';
import { ActivityFeed } from '@/components/ActivityFeed';
import { EntityProfile } from '@/components/EntityProfile';
import { ExportModal } from '@/components/ExportModal';
import { AiSuggestionsPanel } from '@/components/AiSuggestionsPanel';
import { NetworkView } from '@/components/NetworkView';
import { EntitySearchView } from '@/components/EntitySearchView';
import { CaseManagementView } from '@/components/CaseManagementView';
import { AlertsView } from '@/components/AlertsView';
import { ReportsView } from '@/components/ReportsView';
import { SettingsView } from '@/components/SettingsView';
import { Network, Download, Sparkles } from 'lucide-react';
import type { ViewName, Entity, ActivityItem, Alert } from '@/types';
import { entities } from '@/data';

function App() {
  const [currentView, setCurrentView] = useState<ViewName>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [graphFilterId, setGraphFilterId] = useState<string | null>(null);

  const handleEntitySelect = useCallback((entity: Entity) => {
    setSelectedEntity(entity);
  }, []);

  const handleInvestigateActivity = useCallback((item: ActivityItem) => {
    if (item.entityId) {
      setGraphFilterId(item.entityId);
      setCurrentView('network');
    }
  }, []);

  const handleInvestigateAlert = useCallback((alert: Alert) => {
    if (alert.entityId) {
      const entity = findEntity(alert.entityId);
      if (entity) setSelectedEntity(entity);
      setGraphFilterId(alert.entityId);
      setCurrentView('network');
    }
  }, []);

  const viewNames: Record<ViewName, string> = {
    dashboard: 'Mission Control Dashboard',
    network: 'Network Graph — Deep Dive',
    search: 'Entity Search',
    cases: 'Case Management',
    alerts: 'Alerts & Watchlists',
    reports: 'Reports & Export',
    settings: 'Admin / Settings',
  };

  return (
    <div className="h-screen flex flex-col bg-bg-base text-white/80 overflow-hidden">
      <TopBar
        onNavigate={setCurrentView}
        onEntitySelect={handleEntitySelect}
        alertCount={6}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          alertCount={6}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* View Header */}
          {currentView !== 'dashboard' && currentView !== 'network' && (
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-bg-surface/30">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="text-white/60">{viewNames[currentView]}</span>
              </div>
              <button
                onClick={() => setExportOpen(true)}
                className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium bg-white/5 text-white/70 border border-white/10 hover:border-cyan/30 hover:text-cyan transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Export Report
              </button>
            </div>
          )}

          {/* Dashboard Export Button */}
          {currentView === 'dashboard' && (
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-bg-surface/30">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white/90">Mission Control</span>
                <span className="text-[10px] text-white/40 px-2 py-0.5 rounded-full bg-white/5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-slow" />
                  All systems operational
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAiPanelOpen(true)}
                  className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium bg-cyan/10 text-cyan border border-cyan/20 hover:bg-cyan/20 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Suggestions
                </button>
                <button
                  onClick={() => setExportOpen(true)}
                  className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium bg-white/5 text-white/70 border border-white/10 hover:border-cyan/30 hover:text-cyan transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Export Report
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {currentView === 'dashboard' && (
              <div className="h-full overflow-y-auto p-4 space-y-3">
                <KpiRow />

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3" style={{ minHeight: '500px' }}>
                  {/* Entity Relationship Graph */}
                  <div className="lg:col-span-2 card p-4 flex flex-col" style={{ minHeight: '400px' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-cyan" />
                        <h3 className="text-sm font-semibold text-white/90">Entity Relationship Graph</h3>
                        <span className="ai-chip">AI-Enhanced</span>
                      </div>
                      <button
                        onClick={() => setCurrentView('network')}
                        className="text-[10px] text-cyan hover:text-white transition-colors"
                      >
                        Deep Dive →
                      </button>
                    </div>
                    <div className="flex-1 relative">
                      <NetworkGraph
                        height="100%"
                        showInferred={true}
                        onNodeClick={handleEntitySelect}
                        filterEntityId={graphFilterId}
                      />
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div style={{ minHeight: '400px' }}>
                    <ActivityFeed
                      onInvestigate={handleInvestigateActivity}
                    />
                  </div>
                </div>

                {/* Bottom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3" style={{ minHeight: '350px' }}>
                  <ThreatHeatMap />
                  <FinancialFlowTimeline />
                </div>
              </div>
            )}

            {currentView === 'network' && (
              <NetworkView
                onEntitySelect={handleEntitySelect}
                onExport={() => setExportOpen(true)}
              />
            )}

            {currentView === 'search' && (
              <EntitySearchView onEntitySelect={handleEntitySelect} />
            )}

            {currentView === 'cases' && <CaseManagementView />}

            {currentView === 'alerts' && (
              <AlertsView onInvestigate={handleInvestigateAlert} />
            )}

            {currentView === 'reports' && <ReportsView onExport={() => setExportOpen(true)} />}

            {currentView === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* AI FAB for non-dashboard views */}
      {currentView !== 'dashboard' && (
        <button
          onClick={() => setAiPanelOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-cyan/30 to-cyan/10 border border-cyan/40 flex items-center justify-center shadow-lg shadow-cyan/20 hover:scale-110 transition-transform animate-glow z-30 group"
        >
          <Sparkles className="w-6 h-6 text-cyan" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan text-[9px] font-bold text-bg-base flex items-center justify-center">4</span>
        </button>
      )}

      {/* Modals & Panels */}
      <EntityProfile entity={selectedEntity} onClose={() => setSelectedEntity(null)} />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} viewName={viewNames[currentView]} />
      <AiSuggestionsPanel open={aiPanelOpen} onClose={() => setAiPanelOpen(false)} />
    </div>
  );
}

function findEntity(id: string): Entity | undefined {
  return entities.find((e) => e.id === id);
}

export default App;
