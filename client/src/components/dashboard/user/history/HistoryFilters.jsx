import React from 'react';
import { Calendar, Search } from 'lucide-react';

export default function HistoryFilters({ searchQuery, setSearchQuery, filter, setFilter }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="relative w-full sm:w-96 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--text-brand)] transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search symptoms or conditions..."
          className="w-full pl-11 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] focus:border-transparent transition-all shadow-sm placeholder:text-[var(--text-muted)]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="relative w-full sm:w-auto">
        <select
          className="w-full sm:w-48 appearance-none pl-4 pr-10 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] focus:border-transparent transition-all shadow-sm cursor-pointer font-medium"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Time</option>
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="Last 30 Days">Last 30 Days</option>
          <option value="Last 3 Months">Last 3 Months</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[var(--text-muted)]">
          <Calendar size={18} />
        </div>
      </div>
    </div>
  );
}
