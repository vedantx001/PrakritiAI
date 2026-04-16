import React from 'react';
import { Calendar, ChevronRight, Clock } from 'lucide-react';
import SeverityBadge from './SeverityBadge';

export default function HistoryCard({ item, onViewDetails }) {
  const dateObj = new Date(item.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex gap-3 md:gap-5 lg:gap-0 lg:block lg:relative lg:pl-12 py-3 md:py-5 lg:py-6 group w-full relative">
      <div className="flex flex-col items-center mt-6 md:mt-7 lg:mt-0 lg:absolute lg:left-0 lg:top-12 z-10 shrink-0">
        <div className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4 rounded-full bg-[var(--text-brand)] shadow-[0_0_0_4px_var(--bg-primary)] z-10 group-hover:scale-125 transition-transform duration-300"></div>
        <div className="w-px flex-1 min-h-[40px] bg-[var(--border-color)] lg:hidden my-2 -mb-8 pointer-events-none group-last:hidden"></div>
      </div>

      <div className="flex-1 min-w-0 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 md:p-5 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 md:gap-6 lg:gap-6">
          <div className="flex-1 space-y-3 md:space-y-4 lg:space-y-4">
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
              <h3 className="text-lg md:text-xl lg:text-xl font-bold text-[var(--text-main)] mb-2 md:mb-2 flex items-center gap-2">{item.prediction}</h3>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {item.symptoms.map((sym) => (
                  <span
                    key={sym}
                    className="px-2.5 py-1 md:px-3 lg:px-3 bg-[var(--bg-secondary)] text-[var(--text-main)] text-xs md:text-sm lg:text-sm rounded-lg border border-[var(--border-color)]"
                  >
                    {sym}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-col lg:flex-col items-center lg:items-end justify-between gap-4 md:gap-5 lg:gap-4 border-t lg:border-t-0 lg:border-l border-[var(--border-color)] pt-4 md:pt-5 lg:pt-0 lg:pl-6 w-full lg:w-48 shrink-0">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex justify-between items-center w-full">
                <span className="text-sm md:text-base lg:text-sm text-[var(--text-muted)] mt-1 lg:mt-0 font-medium lg:font-normal">Severity</span>
                <SeverityBadge severity={item.severity || 'Unknown'} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onViewDetails(item)}
              className="mt-1 md:mt-2 lg:mt-2 w-full py-3 md:py-3 lg:py-2.5 px-4 bg-[var(--bg-secondary)] hover:bg-[var(--text-brand)] text-[var(--text-main)] hover:text-white rounded-xl text-base md:text-base lg:text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2 group/btn border border-[var(--border-color)] hover:border-transparent"
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
