import React from 'react';
import { Calendar, ChevronRight, Clock } from 'lucide-react';
import SeverityBadge from './SeverityBadge';

export default function HistoryCard({ item, onViewDetails }) {
  const dateObj = new Date(item.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative pl-8 sm:pl-12 py-6 group">
      <div className="absolute left-0 top-10 sm:top-12 w-4 h-4 rounded-full bg-[var(--text-brand)] shadow-[0_0_0_4px_var(--bg-primary)] z-10 group-hover:scale-125 transition-transform duration-300"></div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 text-sm text-[var(--text-muted)] font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {formattedDate}
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {formattedTime}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-2 flex items-center gap-2">{item.prediction}</h3>
              <div className="flex flex-wrap gap-2">
                {item.symptoms.map((sym) => (
                  <span
                    key={sym}
                    className="px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-main)] text-sm rounded-lg border border-[var(--border-color)]"
                  >
                    {sym}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-[var(--border-color)] pt-4 lg:pt-0 lg:pl-6 w-full lg:w-48">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex justify-between items-center w-full">
                <span className="text-sm text-[var(--text-muted)]">Severity</span>
                <SeverityBadge severity={item.severity || 'Unknown'} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onViewDetails(item)}
              className="mt-2 w-full py-2.5 px-4 bg-[var(--bg-secondary)] hover:bg-[var(--text-brand)] text-[var(--text-main)] hover:text-white rounded-xl text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2 group/btn border border-[var(--border-color)] hover:border-transparent"
            >
              View Details
              <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
