import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Stethoscope, BookOpen, MessageCircle, Heart, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HealthStatCard from './HealthStatCard';
import ActionCard from './ActionCard';
import SavedItem from './SavedItem';
import { useAuth } from '../../../context/useAuth';
import { getAIHistory, getHealthSummary, getSavedLibrary } from '../../../services/dashboardService';
import { getMyContributions } from '../../../services/articleService';

const extractMainSymptom = (text) => {
  if (!text || typeof text !== 'string') return '';
  const firstClause = (text.split(/[;,|/]+/)[0] || '').trim();
  if (!firstClause) return '';

  const connector = /\b(with|and|after|before|during|when|while|for|since|because|due to|at)\b/i;
  const match = firstClause.match(connector);
  const base = (match ? firstClause.slice(0, match.index) : firstClause).trim();
  const cleaned = base.replace(/^(a|an|the)\s+/i, '').replace(/\s{2,}/g, ' ').trim();
  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const formatShortDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatRelative = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hours ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays} days ago`;
};

const pickTopDosha = (doshaTrend) => {
  if (!doshaTrend || typeof doshaTrend !== 'object') return '—';
  const entries = Object.entries(doshaTrend);
  if (!entries.length) return '—';
  entries.sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0));
  return entries[0]?.[0] || '—';
};

export default function UserOverview({ healthStatsData, onSelectTab }) {
  const navigate = useNavigate();
  const { token, isAuthenticated, user } = useAuth();
  const [healthSummary, setHealthSummary] = useState({ totalAnalyses: 0, doshaTrend: {}, lastAnalysis: null });
  const [aiHistory, setAiHistory] = useState([]);
  const [savedLibrary, setSavedLibrary] = useState({ articles: [], discussionPosts: [] });
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    let mounted = true;

    if (!isAuthenticated || !token) {
      setHealthSummary({ totalAnalyses: 0, doshaTrend: {}, lastAnalysis: null });
      setAiHistory([]);
      setSavedLibrary({ articles: [], discussionPosts: [] });
      setContributions([]);
      return () => {
        mounted = false;
      };
    }

    getHealthSummary({ token })
      .then((data) => {
        if (!mounted) return;
        setHealthSummary(data && typeof data === 'object' ? data : { totalAnalyses: 0, doshaTrend: {}, lastAnalysis: null });
      })
      .catch(() => {
        if (!mounted) return;
        setHealthSummary({ totalAnalyses: 0, doshaTrend: {}, lastAnalysis: null });
      });

    getAIHistory({ token })
      .then((data) => {
        if (!mounted) return;
        setAiHistory(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setAiHistory([]);
      });

    getSavedLibrary({ token })
      .then((data) => {
        if (!mounted) return;
        setSavedLibrary(data && typeof data === 'object' ? data : { articles: [], discussionPosts: [] });
      })
      .catch(() => {
        if (!mounted) return;
        setSavedLibrary({ articles: [], discussionPosts: [] });
      });

    getMyContributions({ token })
      .then((data) => {
        if (!mounted) return;
        setContributions(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setContributions([]);
      });

    return () => {
      mounted = false;
    };
  }, [token, isAuthenticated]);

  const computedStats = useMemo(() => {
    const totalAnalyses = Number.isFinite(Number(healthSummary?.totalAnalyses)) ? Number(healthSummary.totalAnalyses) : 0;
    const lastAnalysis = healthSummary?.lastAnalysis;
    const topDosha = pickTopDosha(healthSummary?.doshaTrend);

    const savedArticlesCount = Array.isArray(savedLibrary?.articles) ? savedLibrary.articles.length : 0;

    const totalContributions = Array.isArray(contributions) ? contributions.length : 0;
    const pendingCount = (Array.isArray(contributions) ? contributions : []).filter(
      (c) => String(c?.status || '').toLowerCase() === 'pending'
    ).length;

    return [
      {
        title: 'Most Common Dosha',
        value: topDosha,
        subtext: totalAnalyses > 0 ? `Based on ${totalAnalyses} analyses` : 'No analyses yet',
        icon: Activity,
        colorClass: (healthStatsData && healthStatsData[0]?.colorClass) || 'bg-green-100 text-green-600',
      },
      {
        title: 'Symptoms Analyzed',
        value: String(totalAnalyses),
        subtext: lastAnalysis ? `Last analysis: ${formatRelative(lastAnalysis)}` : 'Last analysis: —',
        icon: Stethoscope,
        colorClass: 'bg-blue-100 text-blue-600',
      },
      {
        title: 'Saved Articles',
        value: String(savedArticlesCount),
        subtext: savedArticlesCount > 0 ? 'Your saved library is growing' : 'No saved articles yet',
        icon: BookOpen,
        colorClass: 'bg-purple-100 text-purple-600',
      },
      {
        title: 'My Contributions',
        value: String(totalContributions).padStart(2, '0'),
        subtext: pendingCount > 0 ? `${pendingCount} pending approval` : 'No pending approvals',
        icon: Edit3,
        colorClass: 'bg-orange-100 text-orange-600',
      },
    ];
  }, [healthSummary, savedLibrary, contributions, healthStatsData]);

  const statsToRender = Array.isArray(healthStatsData) && healthStatsData.length ? healthStatsData : computedStats;

  const savedItemsToRender = useMemo(() => {
    const articles = Array.isArray(savedLibrary?.articles) ? savedLibrary.articles : [];
    const discussions = Array.isArray(savedLibrary?.discussionPosts) ? savedLibrary.discussionPosts : [];

    const combined = [
      ...articles.map((a) => ({
        key: `article-${a.id}`,
        type: 'Article',
        title: a.title || 'Saved Article',
        date: formatShortDate(a.updatedAt),
        onClick: a.seriesSlug && a.chapterSlug && a.topicSlug
          ? () => navigate(`/articles/${a.seriesSlug}/${a.chapterSlug}/${a.topicSlug}`)
          : () => navigate('/articles'),
        updatedAt: a.updatedAt,
      })),
      ...discussions.map((d) => ({
        key: `discussion-${d.id}`,
        type: 'Blog',
        title: d.title || 'Saved Discussion',
        date: formatShortDate(d.updatedAt),
        onClick: () => navigate('/discussions'),
        updatedAt: d.updatedAt,
      })),
    ]
      .sort((x, y) => new Date(y.updatedAt || 0) - new Date(x.updatedAt || 0))
      .slice(0, 4);

    while (combined.length < 4) {
      const idx = combined.length + 1;
      combined.push({
        key: `saved-placeholder-${idx}`,
        type: 'Article',
        title: 'No saved items yet',
        date: '—',
        onClick: undefined,
        updatedAt: null,
      });
    }

    return combined;
  }, [savedLibrary, navigate]);

  const recentHistoryItems = useMemo(() => {
    const reports = Array.isArray(aiHistory) ? aiHistory : [];
    const items = [];

    const firstReport = reports[0];
    if (firstReport) {
      const symptom = extractMainSymptom(firstReport?.symptoms) || 'Symptom Analysis';
      const dosha = firstReport?.dosha || 'Mixed';
      items.push({
        key: firstReport?._id,
        icon: Stethoscope,
        iconColorClass: 'text-[var(--text-brand)]',
        title: `Symptom Analysis: ${symptom}`,
        description: `Result: Dosha ${dosha}.`,
        time: formatRelative(firstReport?.createdAt),
      });
    } else {
      items.push({
        key: 'history-placeholder-1',
        icon: Stethoscope,
        iconColorClass: 'text-[var(--text-brand)]',
        title: 'Symptom Analysis: —',
        description: 'No analyses yet.',
        time: '—',
      });
    }

    const articles = Array.isArray(savedLibrary?.articles) ? savedLibrary.articles : [];
    const mostRecentSavedArticle = [...articles].sort((a, b) => new Date(b?.updatedAt || 0) - new Date(a?.updatedAt || 0))[0];
    if (mostRecentSavedArticle) {
      items.push({
        key: `saved-article-${mostRecentSavedArticle?.id}`,
        icon: BookOpen,
        iconColorClass: 'text-blue-500',
        title: `Read: "${mostRecentSavedArticle?.title || 'Saved Article'}"`,
        description: 'You liked this article.',
        time: formatRelative(mostRecentSavedArticle?.updatedAt),
      });
    } else {
      const secondReport = reports[1];
      if (secondReport) {
        const symptom = extractMainSymptom(secondReport?.symptoms) || 'Symptom Analysis';
        const dosha = secondReport?.dosha || 'Mixed';
        items.push({
          key: secondReport?._id,
          icon: Stethoscope,
          iconColorClass: 'text-[var(--text-brand)]',
          title: `Symptom Analysis: ${symptom}`,
          description: `Result: Dosha ${dosha}.`,
          time: formatRelative(secondReport?.createdAt),
        });
      } else {
        items.push({
          key: 'history-placeholder-2',
          icon: BookOpen,
          iconColorClass: 'text-blue-500',
          title: 'Read: "—"',
          description: 'No saved articles yet.',
          time: '—',
        });
      }
    }

    return items.slice(0, 2);
  }, [aiHistory, savedLibrary]);

  return (
    <main className="flex-1 px-4 py-6 sm:p-6 md:p-8 overflow-y-auto bg-[var(--bg-primary)] relative w-full">
    <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] mb-1">Hello, {user?.name || 'there'}! 👋</h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)]">Here's your daily health overview.</p>
      </div>
      <div className="text-left md:text-right text-xs sm:text-sm">
        <p className="font-medium text-[var(--text-brand)]">Last check-up: {healthSummary?.lastAnalysis ? formatRelative(healthSummary.lastAnalysis) : '—'}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 lg:mb-10 w-full">
      {statsToRender.map((stat) => (
        <HealthStatCard key={stat.title} {...stat} />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
      <div className="lg:col-span-2 space-y-6 lg:space-y-8">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] mb-3 sm:mb-4">What would you like to do?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <ActionCard
              title="Analyze Symptoms"
              desc="Enter your symptoms to get a preliminary AI analysis."
              icon={Stethoscope}
              buttonText="Start Analysis"
              onClick={() => (onSelectTab ? onSelectTab('Analyzer') : navigate('/dashboard/user/symptoms-analyzer'))}
            />
            <ActionCard
              title="Browse Articles"
              desc="Read the latest health insights curated by experts."
              icon={BookOpen}
              buttonText="Read Now"
              onClick={() => navigate('/articles')}
            />
            <ActionCard
              title="Join Discussion"
              desc="Share your experience and connect with the community."
              icon={MessageCircle}
              buttonText="Go to Blogs"
              onClick={() => (onSelectTab ? onSelectTab('Discussions') : navigate('/discussions'))}
            />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-[var(--shadow-soft)] p-4 sm:p-6 w-full">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)]">Recent History</h3>
            <button
              type="button"
              onClick={() => (onSelectTab ? onSelectTab('History') : navigate('/dashboard/user/history'))}
              className="text-sm text-[var(--text-brand)] font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3 sm:space-y-4 w-full">
            {recentHistoryItems.map((entry, idx) => (
                <div
                  key={entry.key || idx}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--text-brand)] transition-colors w-full"
                >
                  <div className={`bg-[var(--bg-card)] p-1.5 sm:p-2 rounded-lg shrink-0 ${entry.iconColorClass || (idx === 0 ? 'text-[var(--text-brand)]' : 'text-blue-500')} border border-[var(--border-color)]`}>
                    {entry.icon ? <entry.icon className="w-4 h-4 sm:w-5 sm:h-5" /> : idx === 0 ? <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" /> : <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-semibold text-[var(--text-main)] truncate">{entry.title}</h4>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5 sm:mt-1 line-clamp-2">{entry.description}</p>
                  </div>
                  <div className="shrink-0 pl-1 sm:pl-2 pt-1">
                    <span className="text-[10px] sm:text-xs text-[var(--text-muted)] font-medium whitespace-nowrap">{entry.time}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="space-y-6 lg:space-y-8 w-full mt-2 lg:mt-0">
        <div className="bg-[var(--bg-card)] p-4 sm:p-6 rounded-2xl border border-[var(--border-color)] shadow-[var(--shadow-soft)] w-full">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)]">Saved & Liked</h3>
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-brand)] fill-[var(--text-brand)]" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            {savedItemsToRender.map((item) => (
              <SavedItem key={item.key} type={item.type} title={item.title} date={item.date} onClick={item.onClick} />
            ))}
          </div>
          <button
            onClick={() => (onSelectTab ? onSelectTab('Saved') : navigate('/dashboard/user/saved'))}
            className="w-full mt-3 sm:mt-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[var(--text-muted)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] hover:text-[var(--text-main)] transition-colors"
          >
            View All Library
          </button>
        </div>

        <div className="bg-gradient-to-br from-[var(--text-brand)] to-teal-700 p-5 sm:p-6 rounded-2xl text-white shadow-lg relative overflow-hidden w-full">
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-2">Have knowledge to share?</h3>
            <p className="text-emerald-50 text-sm mb-4">Contribute to our articles section. Help the community grow.</p>
            <button
              type="button"
              onClick={() => (onSelectTab ? onSelectTab('Contributions') : navigate('/dashboard/user/contributions'))}
              className="bg-white text-[var(--text-brand)] px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors"
            >
              Write Article
            </button>
          </div>
          <Edit3 size={100} className="absolute -bottom-4 -right-4 text-white opacity-10 rotate-12" />
        </div>
      </div>
    </div>
    </main>
  );
}