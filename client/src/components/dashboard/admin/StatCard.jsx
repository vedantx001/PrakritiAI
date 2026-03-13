import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendUp }) => (
  <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-[var(--shadow-soft)] hover:translate-y-[-2px] transition-transform duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-[var(--bg-secondary)]">
        <Icon size={24} className="text-[var(--text-brand)]" />
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
        {trend}
      </span>
    </div>
    <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">{title}</h3>
    <p className="text-[var(--text-main)] text-3xl font-bold">{value}</p>
  </div>
);

export default StatCard;