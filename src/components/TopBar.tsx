import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Shield, ChevronDown, Clock, AlertTriangle } from 'lucide-react';
import type { Entity, ViewName } from '@/types';
import { entities } from '@/data';

interface TopBarProps {
  onNavigate: (view: ViewName) => void;
  onEntitySelect: (entity: Entity) => void;
  alertCount: number;
}

export function TopBar({ onNavigate, onEntitySelect, alertCount }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Entity[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = entities.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.aliases.some((a) => a.toLowerCase().includes(q)) ||
        e.phone?.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
    );
    setSearchResults(results.slice(0, 6));
  }, [searchQuery]);

  function handleSelectEntity(entity: Entity) {
    onEntitySelect(entity);
    setSearchQuery('');
    setShowResults(false);
  }

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-bg-surface/80 backdrop-blur-xl relative z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan/20 to-cyan/5 border border-cyan/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-success animate-pulse-slow" />
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-wider">NCRB</div>
            <div className="text-[9px] text-white/40 tracking-wide uppercase">Intel Dashboard</div>
          </div>
        </div>
        <div className="h-6 w-px bg-white/10 mx-1" />
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-white/40">
          <Clock className="w-3 h-3" />
          <span>Updated: 04 Sep 2025, 15:42 IST</span>
        </div>
      </div>

      {/* Search */}
      <div ref={searchRef} className="flex-1 max-w-xl mx-4 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search entities — persons, phones, accounts, vehicles, locations..."
            className="w-full h-9 pl-10 pr-4 bg-bg-card border border-white/10 rounded-lg text-sm text-white/90 placeholder:text-white/25 focus:outline-none focus:border-cyan/40 focus:ring-1 focus:ring-cyan/20 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/30 border border-white/10 rounded px-1.5 py-0.5 hidden sm:block">
            ⌘K
          </kbd>
        </div>

        {/* Search Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full glass-strong rounded-lg overflow-hidden shadow-2xl animate-slide-in-up z-50">
            <div className="px-3 py-2 text-[10px] text-white/40 uppercase tracking-wider border-b border-white/5">
              {searchResults.length} matches found
            </div>
            {searchResults.map((entity) => (
              <button
                key={entity.id}
                onClick={() => handleSelectEntity(entity)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left group"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      entity.status === 'criminal'
                        ? '#FF0055'
                        : entity.status === 'poi'
                          ? '#FFB300'
                          : entity.status === 'verified'
                            ? '#00E676'
                            : '#00E5FF',
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white/90 truncate group-hover:text-cyan transition-colors">
                    {entity.name}
                  </div>
                  <div className="text-[11px] text-white/40 truncate">
                    {entity.id} · {entity.type} {entity.aliases.length > 0 ? `· aka ${entity.aliases[0]}` : ''}
                  </div>
                </div>
                {entity.aiInferred && <span className="ai-chip">AI</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('alerts')}
          className="relative w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors group"
        >
          <Bell className="w-4.5 h-4.5 text-white/60 group-hover:text-white/90 transition-colors" />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-danger text-[9px] font-bold text-white flex items-center justify-center animate-pulse-slow">
              {alertCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan/30 to-cyan/10 border border-cyan/30 flex items-center justify-center text-[11px] font-bold text-cyan">
              RS
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs text-white/90 font-medium leading-tight">R. Sharma</div>
              <div className="text-[9px] text-white/40 leading-tight">Sr. Investigator</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/30 hidden md:block" />
          </button>

          {showProfile && (
            <div className="absolute top-full right-0 mt-2 w-56 glass-strong rounded-lg overflow-hidden shadow-2xl animate-slide-in-up z-50">
              <div className="p-3 border-b border-white/5">
                <div className="text-sm text-white/90 font-medium">Rajesh Sharma</div>
                <div className="text-[11px] text-white/40">Senior Investigator · Level 4 Clearance</div>
              </div>
              <div className="p-1.5">
                <div className="px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded cursor-pointer transition-colors">
                  Profile Settings
                </div>
                <div className="px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded cursor-pointer transition-colors">
                  Audit Log
                </div>
                <div className="px-3 py-2 text-xs text-danger hover:bg-danger/10 rounded cursor-pointer transition-colors flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" />
                  Sign Out
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
