import React from 'react';
import { BookOpen, MessageCircle, Heart } from 'lucide-react';

const SavedItem = ({ type, title, date, onClick }) => (
  <div
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onClick={onClick}
    onKeyDown={(e) => {
      if (!onClick) return;
      if (e.key === 'Enter' || e.key === ' ') onClick();
    }}
    className={`flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-secondary)] group transition-colors border border-transparent hover:border-[var(--border-color)] ${
      onClick ? 'cursor-pointer' : ''
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg ${type === 'Article' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30'}`}>
        {type === 'Article' ? <BookOpen size={18} /> : <MessageCircle size={18} />}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--text-brand)] transition-colors">{title}</h4>
        <p className="text-xs text-[var(--text-muted)]">{type} • {date}</p>
      </div>
    </div>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <Heart size={18} className="fill-[var(--text-brand)] text-[var(--text-brand)]" />
    </div>
  </div>
);

export default SavedItem;