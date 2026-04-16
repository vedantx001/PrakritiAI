import React, { useMemo } from 'react';
import { Activity, Clock, Thermometer } from 'lucide-react';

const formatLastAnalysis = (value) => {
  if (!value) return 'No records';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No records';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function HistorySummaryCards({ data, summary }) {
  const { totalAnalyses, mostCommonSymptom, lastAnalysis } = useMemo(() => {
    if (summary && typeof summary === 'object') {
      return {
        totalAnalyses: Number.isFinite(Number(summary.totalAnalyses)) ? Number(summary.totalAnalyses) : 0,
        mostCommonSymptom: summary.mostCommonSymptom || 'N/A',
        lastAnalysis: formatLastAnalysis(summary.lastAnalysis),
      };
    }

    const total = Array.isArray(data) ? data.length : 0;

    const symptomCounts = (Array.isArray(data) ? data : []).reduce((acc, item) => {
      (item?.symptoms || []).forEach((sym) => {
        acc[sym] = (acc[sym] || 0) + 1;
      });
      return acc;
    }, {});

    let common = 'N/A';
    let maxCount = 0;
    for (const [symptom, count] of Object.entries(symptomCounts)) {
      if (count > maxCount) {
        common = symptom;
        maxCount = count;
      }
    }

    const sortedData = [...(Array.isArray(data) ? data : [])].sort((a, b) => new Date(b.date) - new Date(a.date));
    const last = sortedData.length > 0 ? formatLastAnalysis(sortedData[0].date) : 'No records';

    return { totalAnalyses: total, mostCommonSymptom: common, lastAnalysis: last };
  }, [data, summary]);

  const cards = [
    {
      title: 'Total Analyses',
      value: totalAnalyses,
      icon: Activity,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Most Common Symptom',
      value: mostCommonSymptom,
      icon: Thermometer,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
    {
      title: 'Last Analysis',
      value: lastAnalysis,
      icon: Clock,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 lg:mb-10 w-full">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 lg:gap-5 group cursor-default w-full"
        >
          <div className={`p-3 md:p-4 rounded-xl shrink-0 ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-300`}>
            <card.icon size={24} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[var(--text-muted)] text-sm font-medium mb-1">{card.title}</p>
            <p className="text-[var(--text-main)] text-2xl font-bold tracking-tight">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
