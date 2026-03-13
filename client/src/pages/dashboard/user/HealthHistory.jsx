import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';
import HistoryDetailModal from '../../../components/dashboard/user/history/HistoryDetailModal';
import HistoryFilters from '../../../components/dashboard/user/history/HistoryFilters';
import HistorySummaryCards from '../../../components/dashboard/user/history/HistorySummaryCards';
import HistoryTimeline from '../../../components/dashboard/user/history/HistoryTimeline';
import { useAuth } from '../../../context/useAuth';
import { getAIHistory, getHealthSummary } from '../../../services/dashboardService';

const extractMainSymptom = (text) => {
  if (!text || typeof text !== 'string') return '';

  const firstClause = (text.split(/[;,|/]+/)[0] || '').trim();
  if (!firstClause) return '';

  const connector = /\b(with|and|after|before|during|when|while|for|since|because|due to|at)\b/i;
  const match = firstClause.match(connector);
  const base = (match ? firstClause.slice(0, match.index) : firstClause).trim();

  const cleaned = base
    .replace(/^(a|an|the)\s+/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const toSymptomTags = (rawSymptoms) => {
  if (!rawSymptoms || typeof rawSymptoms !== 'string') return [];

  const firstClause = (rawSymptoms.split(/[;|/]+/)[0] || '').trim();
  if (!firstClause) return [];

  // Split into multiple symptoms when users write "X with Y" or "X and Y".
  const parts = firstClause
    .split(/\bwith\b|\band\b|,/i)
    .map((p) => extractMainSymptom(p))
    .filter(Boolean);

  return Array.from(new Set(parts));
};

const mapReportToHistoryItem = (report) => {
  const symptomsText = report?.symptoms || '';
  const tags = toSymptomTags(symptomsText);

  const severityScore = Number.isFinite(Number(report?.severity)) ? Number(report.severity) : null;
  const severityLabel =
    severityScore === null
      ? 'Unknown'
      : severityScore >= 8
        ? 'High'
        : severityScore >= 4
          ? 'Medium'
          : 'Low';

  const title = extractMainSymptom(symptomsText) || 'Symptom Analysis';

  return {
    id: report?._id,
    date: report?.createdAt,
    prediction: title,
    symptoms: tags.length ? tags : [extractMainSymptom(symptomsText) || String(symptomsText || '').trim()].filter(Boolean),
    severity: severityLabel,
    severityScore,
    dosha: report?.dosha || 'Mixed',
    reasoning: report?.reasoning || '',
    remedies: Array.isArray(report?.remedies) ? report.remedies.filter(Boolean) : [],
    therapies: Array.isArray(report?.therapies) ? report.therapies : [],
    dietRecommendations: Array.isArray(report?.dietRecommendations) ? report.dietRecommendations.filter(Boolean) : [],
    lifestyleRecommendations: Array.isArray(report?.lifestyleRecommendations) ? report.lifestyleRecommendations.filter(Boolean) : [],
  };
};

export default function HealthHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [healthSummary, setHealthSummary] = useState({
    totalAnalyses: 0,
    mostCommonSymptom: null,
    lastAnalysis: null,
  });
  const [historyItems, setHistoryItems] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      setHealthSummary({
        totalAnalyses: 0,
        mostCommonSymptom: null,
        lastAnalysis: null,
      });
      return;
    }

    let cancelled = false;

    getHealthSummary({ token })
      .then((data) => {
        if (!cancelled) setHealthSummary(data);
      })
      .catch(() => {
        if (!cancelled)
          setHealthSummary({
            totalAnalyses: 0,
            mostCommonSymptom: null,
            lastAnalysis: null,
          });
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token) {
      setHistoryItems([]);
      return;
    }

    let cancelled = false;

    getAIHistory({ token })
      .then((reports) => {
        if (cancelled) return;
        const mapped = (Array.isArray(reports) ? reports : [])
          .map(mapReportToHistoryItem)
          .filter((item) => item.id);
        setHistoryItems(mapped);
      })
      .catch(() => {
        if (!cancelled) setHistoryItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  // Filter Data
  const filteredData = useMemo(() => {
    return historyItems.filter((item) => {
      // 1. Search Filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        String(item.prediction || '').toLowerCase().includes(searchLower) ||
        (Array.isArray(item.symptoms) ? item.symptoms : []).some(sym => String(sym || '').toLowerCase().includes(searchLower));
      
      // 2. Date Filter
      let matchesDate = true;
      if (filter !== 'All') {
        const itemDate = new Date(item.date);
        const now = new Date();
        const diffTime = Math.abs(now - itemDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (filter === 'Last 7 Days') matchesDate = diffDays <= 7;
        if (filter === 'Last 30 Days') matchesDate = diffDays <= 30;
        if (filter === 'Last 3 Months') matchesDate = diffDays <= 90;
      }

      return matchesSearch && matchesDate;
    });
  }, [historyItems, searchQuery, filter]);

  return (
    <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2 text-[var(--text-brand)]">
              <Activity size={28} strokeWidth={2.5} />
              <h1 className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">My Health History</h1>
            </div>
            <p className="text-[var(--text-muted)] text-base max-w-xl leading-relaxed">
              Track your past symptom analyses and monitor your health insights over time.
            </p>
          </div>
        </header>

        <HistorySummaryCards data={[]} summary={healthSummary} />
        <HistoryFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
        />

        <div className="bg-[var(--bg-primary)] rounded-3xl">
          <HistoryTimeline data={filteredData} onViewDetails={(item) => setSelectedAnalysis(item)} />
        </div>
      </div>

      {selectedAnalysis ? (
        <HistoryDetailModal item={selectedAnalysis} onClose={() => setSelectedAnalysis(null)} />
      ) : null}
    </main>
  );
}