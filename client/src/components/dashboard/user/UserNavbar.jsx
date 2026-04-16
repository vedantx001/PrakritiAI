import React, { useMemo, useState } from 'react';
import { Menu, Bell, Moon, Sun, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../context/useAuth';
import { buildGenderAvatarUrl } from '../../../utils/avatar';

const UserNavbar = ({ toggleSidebar, isDarkMode, toggleTheme, onProfileClick }) => {
  const { user } = useAuth();
  const [avatarFailed, setAvatarFailed] = useState(false);

  const displayName = user?.name || user?.fullName || 'User';
  const displayEmail = user?.email || '';

  const avatarUrl = useMemo(() => buildGenderAvatarUrl({
    name: displayName,
    gender: user?.gender,
  }), [displayName, user?.gender]);

  return (
    <header className="h-14 sm:h-16 sticky top-0 z-40 bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--border-color)] flex items-center justify-between px-3 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleSidebar}
          className="p-1.5 sm:p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] truncate max-w-[150px] sm:max-w-none">User Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-brand)] transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] px-2 py-1 text-xs text-[var(--text-main)] shadow-sm opacity-0 pointer-events-none transition-opacity duration-150 group-hover:opacity-100">
            Toggle theme
          </span>
        </div>

        <div className="pl-2 sm:pl-4 border-l border-[var(--border-color)]">
          <button
            type="button"
            onClick={onProfileClick}
            className="flex items-center gap-2 sm:gap-3 rounded-xl px-1 sm:px-2 py-1.5 text-left transition-colors hover:bg-[var(--bg-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]"
            aria-label="User profile"
          >
            <div className="hidden lg:flex flex-col leading-tight">
              <span className="text-sm font-semibold text-[var(--text-main)]">{displayName}</span>
              <span className="text-xs text-[var(--text-muted)] break-all">{displayEmail}</span>
            </div>

            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[var(--bg-secondary)] ring-1 ring-[var(--border-color)] shadow-sm overflow-hidden flex items-center justify-center shrink-0">
              {!avatarFailed && avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${displayName} profile`}
                  className="h-full w-full object-cover"
                  onError={() => setAvatarFailed(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[var(--text-brand)]">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              )}
            </div>

            <ChevronDown size={16} className="text-[var(--text-muted)]" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;