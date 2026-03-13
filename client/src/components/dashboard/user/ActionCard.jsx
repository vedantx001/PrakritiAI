import React from 'react';
import { ChevronRight } from 'lucide-react';

const ActionCard = ({ title, desc, icon: Icon, buttonText, onClick }) => (
  <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-[var(--shadow-soft)] flex flex-col justify-between h-full hover:border-[var(--text-brand)] transition-all group">
    <div>
      <div className="mb-4 bg-[var(--bg-secondary)] w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon size={24} className="text-[var(--text-brand)]" />
      </div>
      <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-muted)] mb-4">{desc}</p>
    </div>
    <button
      onClick={onClick}
      type="button"
      className="w-full py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-brand)] font-medium hover:bg-[var(--btn-primary)] hover:text-[var(--btn-text)] transition-colors flex items-center justify-center gap-2"
    >
      {buttonText} <ChevronRight size={16} />
    </button>
  </div>
);

export default ActionCard;