import { Plus, Search } from 'lucide-react';

export default function SearchHeader({ searchTerm, setSearchTerm, onOpenModal }) {
  return (
    <div
      className="sticky top-0 z-30 pt-4 pb-4 sm:pb-6 border-b border-[var(--border-color)] mb-6 sm:mb-8 transition-all duration-300"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg-primary) 85%, transparent)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] tracking-tight">
            Community Discussions
          </h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm sm:text-base">
            Share insights and seek Ayurvedic wisdom.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 md:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--text-brand)] transition-colors">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <input
              type="text"
              placeholder="Search topics, doshas, herbs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 sm:py-2.5 border border-[var(--border-color)] rounded-xl leading-5 bg-[var(--bg-card)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] focus:border-transparent transition-all sm:text-sm"
            />
          </div>

          <button
            onClick={onOpenModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--btn-primary)] text-[var(--btn-text)] px-4 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-brand)]"
          >
            <Plus className="w-5 h-5" />
            <span>New Post</span>
          </button>
        </div>
      </div>
    </div>
  );
}
