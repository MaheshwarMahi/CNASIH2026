import { useState } from 'react';
import { MapPin, Flame } from 'lucide-react';
import { hotspots } from '@/data';

interface ThreatHeatMapProps {
  onHotspotClick?: (hotspot: typeof hotspots[0]) => void;
}

export function ThreatHeatMap({ onHotspotClick }: ThreatHeatMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  function handleClick(h: typeof hotspots[0]) {
    setSelected(h.id);
    onHotspotClick?.(h);
  }

  return (
    <div className="card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-danger" />
          <h3 className="text-sm font-semibold text-white/90">Threat Heat Map</h3>
        </div>
        <span className="text-[10px] text-white/40">India · Criminal Activity Hotspots</span>
      </div>

      <div className="flex-1 relative grid-bg rounded-lg overflow-hidden border border-white/5 bg-bg-base/50">
        {/* Simplified India map silhouette */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <radialGradient id="heatGrad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#FF0055" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#FF6400" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* India outline approximation */}
          <path
            d="M 30 18 L 42 15 L 55 20 L 65 25 L 70 35 L 72 45 L 68 55 L 62 65 L 55 75 L 48 82 L 42 78 L 38 70 L 35 60 L 32 50 L 28 40 L 26 30 Z"
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.3"
          />
          {/* Heat zones */}
          {hotspots.map((h) => (
            <g key={h.id}>
              <circle
                cx={h.x}
                cy={h.y}
                r={h.intensity * 12}
                fill="url(#heatGrad)"
                opacity={hovered === h.id || selected === h.id ? 1 : 0.7}
                style={{ transition: 'opacity 0.2s' }}
              />
            </g>
          ))}
        </svg>

        {/* Interactive hotspot markers */}
        {hotspots.map((h) => (
          <button
            key={h.id}
            onClick={() => handleClick(h)}
            onMouseEnter={() => setHovered(h.id)}
            onMouseLeave={() => setHovered(null)}
            className="absolute group"
            style={{
              left: `${h.x}%`,
              top: `${h.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className={`w-3 h-3 rounded-full border-2 transition-all ${
                selected === h.id
                  ? 'scale-150 border-white'
                  : hovered === h.id
                    ? 'scale-125 border-white/80'
                    : 'border-white/40'
              }`}
              style={{
                backgroundColor:
                  h.intensity > 0.85 ? '#FF0055' : h.intensity > 0.65 ? '#FF6400' : '#FFB300',
                boxShadow: `0 0 ${h.intensity * 20}px ${h.intensity > 0.85 ? '#FF0055' : '#FFB300'}`,
              }}
            />
            {/* Tooltip */}
            {hovered === h.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 glass-strong rounded-lg p-2 z-10 pointer-events-none animate-slide-in-up">
                <div className="text-xs text-white/90 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan" />
                  {h.name}
                </div>
                <div className="text-[10px] text-white/50 mt-1">{h.type}</div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-white/40">{h.incidents} incidents</span>
                  <span
                    className="text-[10px] font-bold"
                    style={{
                      color: h.intensity > 0.85 ? '#FF0055' : h.intensity > 0.65 ? '#FF6400' : '#FFB300',
                    }}
                  >
                    {Math.round(h.intensity * 100)}%
                  </span>
                </div>
              </div>
            )}
          </button>
        ))}

        {/* Legend */}
        <div className="absolute bottom-2 right-2 glass rounded p-2 text-[9px] text-white/50 space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-danger" /> Critical (85%+)
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FF6400' }} /> High (65-85%)
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-warning" /> Moderate (45-65%)
          </div>
        </div>
      </div>
    </div>
  );
}
