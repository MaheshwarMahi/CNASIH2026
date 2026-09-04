import { Brain, X, ArrowRight, Lightbulb } from 'lucide-react';
import { aiSuggestions } from '@/data';

interface AiSuggestionsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function AiSuggestionsPanel({ open, onClose }: AiSuggestionsPanelProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 animate-fade-in" onClick={onClose} />
      <div className="fixed right-0 bottom-0 top-14 w-80 glass-strong border-l border-cyan/20 z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan/10 bg-cyan/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan/15 border border-cyan/30 flex items-center justify-center">
              <Brain className="w-4.5 h-4.5 text-cyan" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white/90">AI Investigative Steps</h2>
              <div className="text-[10px] text-cyan/70">Recommended actions based on analysis</div>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Suggestions */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {aiSuggestions.map((s, i) => (
            <div key={s.id} className="card p-3 card-hover border-cyan/10">
              <div className="flex items-start gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center text-[10px] font-bold text-cyan flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white/90 font-medium">{s.title}</div>
                  <div className="text-[11px] text-white/50 mt-1 leading-relaxed">{s.description}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pl-8">
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="w-3 h-3 text-cyan/50" />
                  <span className="text-[10px] text-white/40">Confidence</span>
                  <span className="text-[11px] font-bold text-cyan">{s.confidence}%</span>
                </div>
                <button className="flex items-center gap-1 text-[10px] text-cyan hover:text-white transition-colors">
                  Execute <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/5">
          <div className="text-[10px] text-white/30 text-center leading-relaxed">
            AI suggestions are based on pattern analysis and should be verified by a human analyst before action.
          </div>
        </div>
      </div>
    </>
  );
}
