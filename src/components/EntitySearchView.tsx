import { useState } from 'react';
import { Search, User, Phone, CreditCard, Car, MapPin, Filter, Brain } from 'lucide-react';
import { entities } from '@/data';
import { statusColors, threatColors } from '@/lib/colors';
import type { Entity, EntityType } from '@/types';

interface EntitySearchViewProps {
  onEntitySelect: (entity: Entity) => void;
}

const typeIcons: Record<EntityType, typeof User> = {
  person: User,
  phone: Phone,
  account: CreditCard,
  vehicle: Car,
  location: MapPin,
};

export function EntitySearchView({ onEntitySelect }: EntitySearchViewProps) {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<EntityType | 'all'>('all');

  const filtered = entities.filter((e) => {
    const matchesQuery =
      query.length === 0 ||
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.aliases.some((a) => a.toLowerCase().includes(query.toLowerCase())) ||
      e.id.toLowerCase().includes(query.toLowerCase()) ||
      e.phone?.toLowerCase().includes(query.toLowerCase());

    const matchesType = filterType === 'all' || e.type === filterType;

    return matchesQuery && matchesType;
  });

  const typeCounts = {
    all: entities.length,
    person: entities.filter((e) => e.type === 'person').length,
    phone: entities.filter((e) => e.type === 'phone').length,
    account: entities.filter((e) => e.type === 'account').length,
    vehicle: entities.filter((e) => e.type === 'vehicle').length,
    location: entities.filter((e) => e.type === 'location').length,
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white/90 mb-1">Entity Search</h1>
          <p className="text-sm text-white/40">Search across persons, phones, accounts, vehicles, and locations</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, alias, ID, phone number..."
            className="w-full h-12 pl-12 pr-4 bg-bg-card border border-white/10 rounded-xl text-sm text-white/90 placeholder:text-white/25 focus:outline-none focus:border-cyan/40 focus:ring-2 focus:ring-cyan/10 transition-all"
          />
        </div>

        {/* Type Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          <Filter className="w-4 h-4 text-white/30 flex-shrink-0" />
          {(['all', 'person', 'phone', 'account', 'vehicle', 'location'] as const).map((t) => {
            const Icon = t === 'all' ? null : typeIcons[t];
            const isActive = filterType === t;
            const count = typeCounts[t];
            return (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-cyan/10 text-cyan border-cyan/30'
                    : 'bg-white/[0.02] text-white/50 border-white/5 hover:border-white/15'
                }`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                {t === 'all' ? 'All Entities' : t.charAt(0).toUpperCase() + t.slice(1) + 's'}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-cyan/20' : 'bg-white/5'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((entity) => {
            const sc = statusColors[entity.status];
            const tc = threatColors[entity.threatLevel];
            const Icon = typeIcons[entity.type];
            return (
              <button
                key={entity.id}
                onClick={() => onEntitySelect(entity)}
                className="card card-hover p-4 text-left group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 border"
                    style={{ backgroundColor: sc.bg, borderColor: sc.border }}
                  >
                    <Icon className="w-5 h-5" style={{ color: sc.text }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-white/90 font-medium truncate group-hover:text-cyan transition-colors">
                        {entity.name}
                      </span>
                      {entity.aiInferred && <span className="ai-chip flex-shrink-0">AI</span>}
                    </div>
                    <div className="text-[11px] text-white/40 mb-2">
                      {entity.id} · {entity.type}
                      {entity.aliases.length > 0 && ` · aka ${entity.aliases[0]}`}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                        style={{ backgroundColor: sc.bg, color: sc.text }}
                      >
                        {sc.label}
                      </span>
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                        style={{ backgroundColor: tc.bg, color: tc.text }}
                      >
                        {tc.label}
                      </span>
                      {entity.confidenceScore && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-cyan/10 text-cyan flex items-center gap-0.5">
                          <Brain className="w-2.5 h-2.5" /> {entity.confidenceScore}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">No entities found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
