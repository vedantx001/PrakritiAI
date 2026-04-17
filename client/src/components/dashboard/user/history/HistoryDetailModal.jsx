import React, { useEffect } from 'react';
import { Calendar, HeartPulse, Leaf, Sparkles, Utensils, X, Zap } from 'lucide-react';
import SeverityBadge from './SeverityBadge';

const ActivitySquare = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M17 12h-2l-2 5-2-10-2 5H7" />
  </svg>
);

export default function HistoryDetailModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return undefined;

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-main)] mb-1">{item.prediction}</h2>
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {new Date(item.date).toLocaleDateString()}
              </span>
              <SeverityBadge severity={item.severity} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          <section>
            <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <ActivitySquare size={16} /> Reported Symptoms
            </h4>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(item.symptoms) ? item.symptoms : []).map((sym) => (
                <span
                  key={sym}
                  className="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-main)] text-sm font-medium rounded-lg border border-[var(--border-color)]"
                >
                  {sym}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-color)]">
            <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <HeartPulse size={16} /> AI Insight
            </h4>
            <p className="text-[var(--text-main)] leading-relaxed">{item.reasoning || 'No reasoning available.'}</p>
          </section>

          {(Array.isArray(item.immediateSolutions) ? item.immediateSolutions : []).length > 0 && (
            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 p-5 rounded-2xl border border-emerald-500/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 bg-emerald-500/20 rounded-full blur-xl"></div>
              <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2 relative z-10">
                <Zap size={16} /> Immediate Relief
              </h4>
              <ul className="space-y-2 relative z-10">
                {item.immediateSolutions.map((solution, idx) => (
                  <li key={idx} className="flex gap-3 text-[var(--text-main)] text-sm font-medium">
                    <span className="text-emerald-600 dark:text-emerald-500 mt-0.5 font-bold">0{idx + 1}</span>
                    <span className="leading-tight">{solution}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Leaf size={16} /> Herbs
              </h4>
              <ul className="space-y-2">
                {(Array.isArray(item.remedies) ? item.remedies : []).length ? (
                  (Array.isArray(item.remedies) ? item.remedies : []).map((herb) => (
                    <li key={herb} className="flex gap-3 text-[var(--text-main)] text-sm">
                      <span className="text-[var(--text-brand)] mt-0.5">•</span>
                      <span className="leading-tight">{herb}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-[var(--text-muted)]">No herbs available.</li>
                )}
              </ul>
            </section>

            <section className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles size={16} /> Therapies
              </h4>
              <ul className="space-y-3">
                {(Array.isArray(item.therapies) ? item.therapies : []).length ? (
                  (Array.isArray(item.therapies) ? item.therapies : []).map((therapy, idx) => (
                    <li key={`${therapy?.name || 'therapy'}-${idx}`} className="text-[var(--text-main)] text-sm">
                      <div className="flex gap-3">
                        <span className="text-[var(--text-brand)] mt-0.5">•</span>
                        <div>
                          <div className="font-semibold leading-tight">{therapy?.name || 'Therapy'}</div>
                          {therapy?.description ? (
                            <div className="text-[var(--text-muted)] leading-tight mt-0.5">{therapy.description}</div>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-[var(--text-muted)]">No therapies available.</li>
                )}
              </ul>
            </section>

            <section className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Utensils size={16} /> Diet Recommendations
              </h4>
              <ul className="space-y-2">
                {(Array.isArray(item.dietRecommendations) ? item.dietRecommendations : []).length ? (
                  (Array.isArray(item.dietRecommendations) ? item.dietRecommendations : []).map((tip) => (
                    <li key={tip} className="flex gap-3 text-[var(--text-main)] text-sm">
                      <span className="text-[var(--text-brand)] mt-0.5">•</span>
                      <span className="leading-tight">{tip}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-[var(--text-muted)]">No diet recommendations available.</li>
                )}
              </ul>
            </section>

            <section className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <ActivitySquare size={16} /> Lifestyle Recommendations
              </h4>
              <ul className="space-y-2">
                {(Array.isArray(item.lifestyleRecommendations) ? item.lifestyleRecommendations : []).length ? (
                  (Array.isArray(item.lifestyleRecommendations) ? item.lifestyleRecommendations : []).map((tip) => (
                    <li key={tip} className="flex gap-3 text-[var(--text-main)] text-sm">
                      <span className="text-[var(--text-brand)] mt-0.5">•</span>
                      <span className="leading-tight">{tip}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-[var(--text-muted)]">No lifestyle recommendations available.</li>
                )}
              </ul>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}
