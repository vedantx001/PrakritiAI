import React from 'react';

const SymptomsThemeStyles = () => (
  <style>{`
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f0fdf4;
      --bg-card: #ffffff;

      --text-main: #111827;
      --text-muted: #4b5563;
      --text-brand: #059669;

      --border-color: #e5e7eb;

      --btn-primary: #059669;
      --btn-text: #ffffff;
      --shadow-soft: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }

    .dark {
      --bg-primary: #020617;
      --bg-secondary: #0f172a;
      --bg-card: #1e293b;

      --text-main: #f1f5f9;
      --text-muted: #94a3b8;
      --text-brand: #34d399;

      --border-color: #1e293b;

      --btn-primary: #059669;
      --btn-text: #ffffff;
      --shadow-soft: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
    }

    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 3s linear infinite;
    }

    @keyframes progress {
      0% { width: 0%; }
      50% { width: 70%; }
      100% { width: 100%; }
    }
    .animate-progress-bar {
      animation: progress 2.5s ease-in-out forwards;
    }
  `}</style>
);

export default SymptomsThemeStyles;