import React from 'react';
import { ChevronRight } from 'lucide-react';

const ActionCard = ({ title, desc, icon: Icon, buttonText, onClick }) => (
  <div className="bg-[var(--bg-card)] p-4 sm:p-5 lg:p-6 rounded-2xl border border-[var(--border-color)] shadow-[var(--shadow-soft)] flex flex-col justify-between h-full hover:border-[var(--text-brand)] transition-all group">
    <div>
      <div className="mb-3 sm:mb-4 bg-[var(--bg-secondary)] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-brand)]" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] mb-1 sm:mb-2 line-clamp-1">{title}</h3>
      <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-3 sm:mb-4 line-clamp-2">{desc}</p>
    </div>
    <button
      onClick={onClick}
      type="button"
      className="w-full py-1.5 sm:py-2 text-sm sm:text-base rounded-lg border border-[var(--border-color)] text-[var(--text-brand)] font-medium hover:bg-[var(--btn-primary)] hover:text-[var(--btn-text)] transition-colors flex items-center justify-center gap-2 mt-auto"
    >
      {buttonText} <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  </div>
);

export default ActionCard;