import { useState } from 'react';
import {
  X, User, Network, DollarSign, Phone, Users, FolderKanban,
  Fingerprint, MapPin, Calendar, AlertCircle, Brain, TrendingUp, Car, CreditCard,
} from 'lucide-react';
import type { Entity } from '@/types';
import { statusColors, threatColors } from '@/lib/colors';
import { NetworkGraph } from './NetworkGraph';
import { transactions, cases } from '@/data';
import { formatINR } from '@/data';

interface EntityProfileProps {
  entity: Entity | null;
  onClose: () => void;
}

type Tab = 'profile' | 'network' | 'financial' | 'communication' | 'associates' | 'cases';

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'network', label: 'Network', icon: Network },
  { id: 'financial', label: 'Financial Trail', icon: DollarSign },
  { id: 'communication', label: 'Communication', icon: Phone },
  { id: 'associates', label: 'Known Associates', icon: Users },
  { id: 'cases', label: 'Case Involvement', icon: FolderKanban },
];

export function EntityProfile({ entity, onClose }: EntityProfileProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  if (!entity) return null;

  const sc = statusColors[entity.status];
  const tc = threatColors[entity.threatLevel];

  const entityTransactions = transactions.filter(
    (t) => t.from === entity.id || t.to === entity.id
  );

  const entityCases = cases.filter((c) =>
    c.summary.toLowerCase().includes(entity.name.toLowerCase()) ||
    (entity.id === 'P001' && c.id === 'C2') ||
    (entity.id === 'P002' && c.id === 'C3') ||
    (entity.id === 'P003' && c.id === 'C4') ||
    (entity.id === 'P006' && (c.id === 'C1' || c.id === 'C6'))
  );

  const mockCalls = [
    { id: 'C1', time: '04 Sep 15:32', number: '+91 99100 44567', duration: '12:34', direction: 'out' },
    { id: 'C2', time: '04 Sep 14:15', number: '+91 98220 67430', duration: '08:21', direction: 'in' },
    { id: 'C3', time: '04 Sep 11:45', number: '+91 90043 11245', duration: '03:12', direction: 'out' },
    { id: 'C4', time: '03 Sep 22:30', number: '+91 99100 44567', duration: '45:10', direction: 'out' },
    { id: 'C5', time: '03 Sep 18:00', number: '+91 70123 88910', duration: '01:45', direction: 'in' },
  ];

  const mockAssociates = [
    { name: 'Deepak Tyagi', id: 'P006', degree: 1, confidence: 97, status: 'criminal' as const },
    { name: 'Sunita Devi', id: 'P003', degree: 1, confidence: 72, status: 'poi' as const, aiInferred: true },
    { name: 'Imran Sheikh', id: 'P002', degree: 2, confidence: 78, status: 'criminal' as const, aiInferred: true },
    { name: 'Vikram Singh', id: 'P004', degree: 2, confidence: 71, status: 'poi' as const, aiInferred: true },
    { name: 'Anil Mehta', id: 'P005', degree: 2, confidence: 54, status: 'verified' as const, aiInferred: true },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-strong border-l border-white/10 z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border"
              style={{ backgroundColor: sc.bg, borderColor: sc.border }}
            >
              {entity.type === 'person' ? (
                <User className="w-5 h-5" style={{ color: sc.text }} />
              ) : entity.type === 'phone' ? (
                <Phone className="w-5 h-5" style={{ color: sc.text }} />
              ) : entity.type === 'account' ? (
                <CreditCard className="w-5 h-5" style={{ color: sc.text }} />
              ) : entity.type === 'vehicle' ? (
                <Car className="w-5 h-5" style={{ color: sc.text }} />
              ) : (
                <MapPin className="w-5 h-5" style={{ color: sc.text }} />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-white font-semibold text-sm truncate">{entity.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                  style={{ backgroundColor: sc.bg, color: sc.text }}
                >
                  {sc.label}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                  style={{ backgroundColor: tc.bg, color: tc.text }}
                >
                  {tc.label}
                </span>
                {entity.aiInferred && <span className="ai-chip">AI</span>}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-4.5 h-4.5 text-white/60" />
          </button>
        </div>

        {/* Confidence Score */}
        {entity.confidenceScore && (
          <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2 bg-cyan/5">
            <Brain className="w-4 h-4 text-cyan flex-shrink-0" />
            <span className="text-[11px] text-white/60">AI Confidence Score</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan/60 to-cyan rounded-full transition-all"
                style={{ width: `${entity.confidenceScore}%` }}
              />
            </div>
            <span className="text-xs font-bold text-cyan">{entity.confidenceScore}%</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? 'text-cyan border-cyan'
                    : 'text-white/40 border-transparent hover:text-white/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'profile' && (
            <div className="space-y-3 animate-fade-in">
              <InfoRow icon={Fingerprint} label="Entity ID" value={entity.id} />
              <InfoRow icon={User} label="Aliases" value={entity.aliases.join(', ') || 'None'} />
              {entity.dob && <InfoRow icon={Calendar} label="Date of Birth" value={entity.dob} />}
              {entity.aadhaar && <InfoRow icon={CreditCard} label="Aadhaar" value={entity.aadhaar} />}
              {entity.phone && <InfoRow icon={Phone} label="Phone" value={entity.phone} />}
              {entity.address && <InfoRow icon={MapPin} label="Address" value={entity.address} />}
              {entity.criminalRecord && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                    <AlertCircle className="w-3 h-3" />
                    Criminal Record Summary
                  </div>
                  <div className="text-xs text-white/70 leading-relaxed bg-danger/5 border border-danger/15 rounded-lg p-3">
                    {entity.criminalRecord}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'network' && (
            <div className="animate-fade-in">
              <p className="text-xs text-white/40 mb-3">Immediate connections — drag to explore</p>
              <div className="card overflow-hidden">
                <NetworkGraph
                  height={320}
                  filterEntityId={entity.id}
                  showInferred={true}
                  mini={true}
                />
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-2 animate-fade-in">
              {entityTransactions.length === 0 && (
                <div className="text-center text-xs text-white/40 py-8">No financial records linked</div>
              )}
              {entityTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`card p-3 ${tx.flagged ? 'border-danger/20' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-white/40 font-mono">{tx.date}</span>
                    {tx.flagged && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-danger/15 text-danger font-medium flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" /> FLAGGED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white/70 truncate flex-1">{tx.fromLabel}</span>
                    <span className="text-cyan">→</span>
                    <span className="text-white/70 truncate flex-1 text-right">{tx.toLabel}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-sm font-bold ${tx.flagged ? 'text-danger' : 'text-white/90'}`}>
                      {formatINR(tx.amount)}
                    </span>
                    {tx.aiInferred && (
                      <span className="ai-chip flex items-center gap-1">
                        <Brain className="w-2.5 h-2.5" /> {tx.confidence}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="space-y-2 animate-fade-in">
              <div className="relative pl-4">
                <div className="absolute left-1.5 top-0 bottom-0 w-px bg-white/10" />
                {mockCalls.map((call) => (
                  <div key={call.id} className="relative mb-3">
                    <div className="absolute -left-3.5 top-3 w-2.5 h-2.5 rounded-full bg-cyan/40 border-2 border-cyan" />
                    <div className="card p-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/80 font-mono">{call.number}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${call.direction === 'out' ? 'bg-cyan/10 text-cyan' : 'bg-success/10 text-success'}`}>
                          {call.direction === 'out' ? 'OUTGOING' : 'INCOMING'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/40">
                        <span>{call.time}</span>
                        <span>Duration: {call.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'associates' && (
            <div className="space-y-2 animate-fade-in">
              {mockAssociates.map((assoc) => {
                const ascSc = statusColors[assoc.status];
                return (
                  <div key={assoc.id} className="card p-3 card-hover">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border"
                        style={{ backgroundColor: ascSc.bg, borderColor: ascSc.border }}
                      >
                        <User className="w-4 h-4" style={{ color: ascSc.text }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white/90 truncate">{assoc.name}</div>
                        <div className="text-[10px] text-white/40">
                          {assoc.degree}° separation · {assoc.confidence}% confidence
                        </div>
                      </div>
                      {assoc.aiInferred && <span className="ai-chip">AI</span>}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${assoc.confidence}%`,
                            backgroundColor: ascSc.border,
                          }}
                        />
                      </div>
                      <TrendingUp className="w-3 h-3 text-white/30" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="space-y-2 animate-fade-in">
              {entityCases.length === 0 && (
                <div className="text-center text-xs text-white/40 py-8">No cases linked</div>
              )}
              {entityCases.map((c) => (
                <div key={c.id} className="card p-3 card-hover">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-cyan">{c.firNumber}</span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                      style={{
                        backgroundColor: threatColors[c.priority].bg,
                        color: threatColors[c.priority].text,
                      }}
                    >
                      {threatColors[c.priority].label}
                    </span>
                  </div>
                  <div className="text-sm text-white/90 font-medium mb-1">{c.title}</div>
                  <div className="text-[11px] text-white/50 leading-relaxed">{c.summary}</div>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-white/40">
                    <span>{c.location}</span>
                    <span>·</span>
                    <span>{c.date}</span>
                    <span>·</span>
                    <span>{c.suspects} suspects</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className="text-[10px] text-white/40 uppercase tracking-wider">{label}</div>
        <div className="text-sm text-white/80 break-words">{value}</div>
      </div>
    </div>
  );
}
