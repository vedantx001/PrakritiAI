import React from 'react';

export default function SeverityBadge({ severity }) {
  const styles = {
    Low: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', dot: '#22c55e' },
    Medium: { bg: '#fefce8', text: '#a16207', border: '#fde047', dot: '#eab308' },
    High: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', dot: '#ef4444' },
    Unknown: { bg: '#f8fafc', text: '#334155', border: '#e2e8f0', dot: '#64748b' },
  };

  const label = severity || 'Unknown';
  const currentStyle = styles[label] || styles.Unknown;

  return (
    <span
      className="px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5"
      style={{
        backgroundColor: currentStyle.bg,
        color: currentStyle.text,
        border: `1px solid ${currentStyle.border}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: currentStyle.dot }}
      ></span>
      {label}
    </span>
  );
}
