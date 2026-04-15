import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const HealthStatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-[var(--bg-card)] p-4 sm:p-6 rounded-2xl border border-[var(--border-color)] shadow-[var(--shadow-soft)] hover:translate-y-[-2px] transition-transform duration-300 relative overflow-hidden flex flex-col justify-between h-full group">
    <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
      <div className={`p-2.5 sm:p-3 rounded-xl ${colorClass} bg-opacity-20`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-brand)]" />
      </div>
      <div className="bg-[var(--bg-secondary)] p-1 sm:p-1.5 rounded-full opacity-70 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-brand)]" />
      </div>
    </div>
    <div className="relative z-10 flex-1 flex flex-col justify-end">
      <h3 className="text-[var(--text-muted)] text-xs sm:text-sm font-medium mb-1 line-clamp-1">{title}</h3>
      <p className="text-[var(--text-main)] text-2xl sm:text-3xl font-bold">{value}</p>
      <p className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-1 sm:mt-2 line-clamp-1">{subtext}</p>
    </div>

    <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${colorClass} opacity-10`}></div>
  </div>
);

export default HealthStatCard;