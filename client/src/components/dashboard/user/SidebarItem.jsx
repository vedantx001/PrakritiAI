import React from 'react';

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 group relative
      ${active
        ? 'bg-[var(--bg-secondary)] border-r-4 border-[var(--text-brand)]'
        : 'hover:bg-[var(--bg-secondary)] opacity-80 hover:opacity-100'
      }
    `}
  >
    <Icon
      size={20}
      className={`${active ? 'text-[var(--text-brand)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-brand)]'}`}
    />
    {!collapsed && (
      <span className={`font-medium ${active ? 'text-[var(--text-brand)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'}`}>
        {label}
      </span>
    )}
  </button>
);

export default SidebarItem;