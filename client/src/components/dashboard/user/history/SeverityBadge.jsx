import React from 'react';

export default function SeverityBadge({ severity }) {
  const colors = {
    Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    Unknown: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300 border-slate-200 dark:border-slate-800',
  };

  const label = severity || 'Unknown';

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full border ${colors[label] || colors.Unknown} flex items-center gap-1.5`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          label === 'Low'
            ? 'bg-green-500'
            : label === 'Medium'
              ? 'bg-yellow-500'
              : label === 'High'
                ? 'bg-red-500'
                : 'bg-slate-500'
        } animate-pulse`}
      ></span>
      {label}
    </span>
  );
}
