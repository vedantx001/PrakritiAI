import React from 'react';
import { Play, Stethoscope } from 'lucide-react';
import HistoryCard from './HistoryCard';

export default function HistoryTimeline({ data, onViewDetails }) {
  const items = Array.isArray(data) ? data : [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl shadow-sm">
        <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-6 text-[var(--text-brand)]">
          <Stethoscope size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-bold text-[var(--text-main)] mb-2">No History Found</h3>
        <p className="text-[var(--text-muted)] max-w-md mb-8">
          You haven't analyzed any symptoms yet or no results match your current filters.
        </p>
        <button
          type="button"
          className="px-6 py-3 bg-[var(--btn-primary)] hover:bg-[var(--btn-primary-hover)] text-white font-semibold rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
        >
          <Play size={18} fill="currentColor" />
          Start First Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-1.5 sm:left-[22px] top-8 bottom-8 w-px bg-[var(--border-color)]"></div>

      <div className="space-y-4">
        {items.map((item) => (
          <HistoryCard key={item.id} item={item} onViewDetails={onViewDetails} />
        ))}
      </div>
    </div>
  );
}
