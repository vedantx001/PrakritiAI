import React from 'react';
import { Sparkles } from 'lucide-react';

const SymptomsAnalyzerLoading = () => (
  <div className="w-full h-[calc(100vh-100px)] flex flex-col items-center justify-center bg-[var(--bg-primary)] text-center p-6 relative overflow-hidden rounded-3xl transition-colors duration-300">
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-3xl animate-pulse" />
    </div>

    <div className="relative z-10 bg-[var(--bg-card)]/80 backdrop-blur-xl p-10 rounded-full shadow-[var(--shadow-soft)] border border-[var(--border-color)] mb-8 transition-colors duration-300">
      <Sparkles className="w-16 h-16 text-[var(--text-brand)] animate-spin-slow" />
    </div>

    <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2 animate-pulse">Analyzing Pattern...</h2>
    <p className="text-[var(--text-muted)] max-w-md">Our AI is mapping your symptoms against Ayurvedic texts and modern medical databases.</p>

    <div className="mt-8 w-64 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border-color)]">
      <div className="h-full bg-[var(--text-brand)] animate-progress-bar shadow-[0_0_10px_var(--text-brand)]"></div>
    </div>
  </div>
);

export default SymptomsAnalyzerLoading;