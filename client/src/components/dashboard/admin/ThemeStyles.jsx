import React from 'react';

const ThemeStyles = () => (
  <style>{`
    :root {
      /* --- LIGHT THEME (Nature Day) --- */
      --bg-primary: #ffffff;          /* Pure White */
      --bg-secondary: #f0fdf4;        /* Emerald-50 */
      --bg-card: #ffffff;             /* Card Background */
      
      --text-main: #111827;           /* Gray-900 */
      --text-muted: #4b5563;          /* Gray-600 */
      --text-brand: #059669;          /* Emerald-600 */

      --border-color: #e5e7eb;        /* Gray-200 */
      
      --btn-primary: #059669;         /* Emerald-600 */
      --btn-text: #ffffff;            /* White */
      --shadow-soft: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }

    .dark {
      /* --- DARK THEME (Night Forest) --- */
      --bg-primary: #020617;          /* Slate-950 */
      --bg-secondary: #0f172a;        /* Slate-900 */
      --bg-card: #1e293b;             /* Slate-800 */
      
      --text-main: #f1f5f9;           /* Slate-100 */
      --text-muted: #94a3b8;          /* Slate-400 */
      --text-brand: #34d399;          /* Emerald-400 */

      --border-color: #1e293b;        /* Slate-800 */
      
      --btn-primary: #059669;         /* Emerald-600 */
      --btn-text: #ffffff;
      --shadow-soft: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
    }

    body {
      background-color: var(--bg-primary);
      color: var(--text-main);
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    /* Custom Scrollbar for a polished look */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: var(--bg-primary); 
    }
    ::-webkit-scrollbar-thumb {
      background: var(--border-color); 
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--text-muted); 
    }
  `}</style>
);

export default ThemeStyles;