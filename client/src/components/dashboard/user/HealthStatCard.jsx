import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const HealthStatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-[var(--shadow-soft)] hover:translate-y-[-2px] transition-transform duration-300 relative overflow-hidden">
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-20`}>
        <Icon size={24} className="text-[var(--text-brand)]" />
      </div>
      <div className="bg-[var(--bg-secondary)] p-1.5 rounded-full">
        <ArrowUpRight size={16} className="text-[var(--text-brand)]" />
      </div>
    </div>
    <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1 relative z-10">{title}</h3>
    <p className="text-[var(--text-main)] text-3xl font-bold relative z-10">{value}</p>
    <p className="text-xs text-[var(--text-muted)] mt-2 relative z-10">{subtext}</p>

    <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${colorClass} opacity-10`}></div>
  </div>
);

export default HealthStatCard;