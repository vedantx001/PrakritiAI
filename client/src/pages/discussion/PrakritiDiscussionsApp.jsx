import { Leaf, Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';

import DiscussionsPageContent from './DiscussionsPageContent.jsx';
import injectStyles from './styles/injectStyles';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function PrakritiDiscussionsApp() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    injectStyles();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      <aside className="hidden md:flex flex-col w-64 bg-[var(--bg-card)] border-r border-[var(--border-color)] z-40 transition-colors">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[var(--text-brand)] flex items-center gap-2">
            <Leaf className="w-6 h-6" /> PrakritiAI
          </h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div className="px-3 py-2 text-[var(--text-muted)] text-sm font-medium hover:bg-[var(--bg-secondary)] rounded-lg cursor-pointer transition-colors">
            Dashboard
          </div>
          <div className="px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-brand)] text-sm font-semibold rounded-lg cursor-pointer flex justify-between items-center transition-colors">
            Discussions{' '}
            <span className="w-2 h-2 rounded-full bg-[var(--text-brand)]" />
          </div>
          <div className="px-3 py-2 text-[var(--text-muted)] text-sm font-medium hover:bg-[var(--bg-secondary)] rounded-lg cursor-pointer transition-colors">
            Consultations
          </div>
          <div className="px-3 py-2 text-[var(--text-muted)] text-sm font-medium hover:bg-[var(--bg-secondary)] rounded-lg cursor-pointer transition-colors">
            My Dosha Profile
          </div>
        </nav>

        <div className="p-4 border-t border-[var(--border-color)]">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-main)] rounded-xl text-sm font-medium border border-[var(--border-color)] hover:opacity-80 transition-opacity"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto overflow-x-hidden relative" id="scroll-container">
        <div className="md:hidden sticky top-0 bg-[var(--bg-card)] border-b border-[var(--border-color)] p-4 z-40 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[var(--text-brand)] flex items-center gap-1">
            <Leaf className="w-5 h-5" /> PrakritiAI
          </h2>
          <button
            onClick={toggleTheme}
            className="text-[var(--text-main)] p-2"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        <DiscussionsPageContent />
      </div>
    </div>
  );
}
