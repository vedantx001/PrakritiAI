export default function injectStyles() {
  if (document.getElementById('prakriti-theme')) return;

  const style = document.createElement('style');
  style.id = 'prakriti-theme';
  style.innerHTML = `
    :root {
      --bg-primary: #f8fafc;
      --bg-secondary: #f1f5f9;
      --bg-card: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --text-brand: #059669;
      --border-color: #e2e8f0;
      --btn-primary: #059669;
      --btn-text: #ffffff;
    }
    .dark {
      --bg-primary: #0f172a;
      --bg-secondary: #1e293b;
      --bg-card: #0f172a;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-brand: #10b981;
      --border-color: #334155;
      --btn-primary: #10b981;
      --btn-text: #ffffff;
    }
    body {
      background-color: var(--bg-primary);
      color: var(--text-main);
      transition: background-color 0.3s, color 0.3s;
    }

    /* Custom Scrollbar for a polished feel */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
  `;
  document.head.appendChild(style);
}
