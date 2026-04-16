import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  FileEdit,
  PlusCircle,
  Search,
  MessageSquare,
} from 'lucide-react';

import { getMyContributions } from '../../../services/articleService';
import { useAuth } from '../../../context/useAuth';
import { useNavigate } from 'react-router-dom';

const stripHtml = (html) =>
  String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const truncate = (text, maxLength) => {
  const value = String(text || '').trim();
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
};

const toStatusLabel = (status) => {
  switch (String(status || '').toLowerCase()) {
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'pending':
    default:
      return 'Pending';
  }
};

const toTypeLabel = (contributionType) =>
  String(contributionType || '').toLowerCase() === 'new_topic' ? 'New Topic' : 'Edit Existing';

const buildLiveArticleUrl = ({ seriesSlug, chapterSlug, topicSlug }) => {
  if (!seriesSlug || !chapterSlug || !topicSlug) return null;
  return `/articles/${seriesSlug}/${chapterSlug}/${topicSlug}`;
};

const mapContribution = (cont) => {
  const id = cont?._id || cont?.id;
  const displayId = id ? `CONT-${String(id).slice(-6).toUpperCase()}` : 'CONT-—';

  const chapter = cont?.chapter || cont?.topic?.chapter;
  const series = chapter?.series;

  const seriesTitle = series?.title || '—';
  const chapterTitle = chapter?.title || '—';

  const contributionType = cont?.contributionType;
  const type = toTypeLabel(contributionType);

  const topicTitle =
    String(contributionType || '').toLowerCase() === 'new_topic'
      ? cont?.proposedTitle || 'New Topic'
      : cont?.topic?.title || cont?.proposedTitle || 'Topic Update';

  const excerpt = truncate(stripHtml(cont?.proposedContent), 160);
  const status = toStatusLabel(cont?.status);
  const feedback = cont?.adminFeedback || null;
  const submittedAt = cont?.createdAt || cont?.submittedAt;

  const seriesSlug = series?.slug;
  const chapterSlug = chapter?.slug;
  const topicSlug =
    status === 'Approved'
      ? cont?.createdTopic?.slug || cont?.appliedTopic?.slug || cont?.topic?.slug
      : null;

  const liveUrl = buildLiveArticleUrl({ seriesSlug, chapterSlug, topicSlug });

  return {
    id,
    displayId,
    series: seriesTitle,
    chapter: chapterTitle,
    topic: topicTitle,
    type,
    status,
    submittedAt,
    excerpt,
    feedback,
    liveUrl,
  };
};

const getStatusConfig = (status) => {
  switch (status) {
    case 'Approved':
      return {
        icon: CheckCircle,
        color: 'text-[var(--text-brand)]',
        bg: 'bg-[var(--bg-secondary)]',
        border: 'border-[var(--text-brand)]',
      };
    case 'Pending':
      return {
        icon: Clock,
        color: 'text-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        border: 'border-amber-200 dark:border-amber-900',
      };
    case 'Rejected':
      return {
        icon: XCircle,
        color: 'text-red-500',
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-200 dark:border-red-900',
      };
    default:
      return {
        icon: Clock,
        color: 'text-[var(--text-muted)]',
        bg: 'bg-[var(--bg-secondary)]',
        border: 'border-[var(--border-color)]',
      };
  }
};

export default function ContributionHistory() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [contributions, setContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated || !token) {
      setContributions([]);
      setError('');
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);
    setError('');

    getMyContributions({ token })
      .then((data) => {
        if (!isMounted) return;
        const next = Array.isArray(data) ? data.map(mapContribution) : [];
        setContributions(next);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || 'Failed to load contributions');
        setContributions([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token, isAuthenticated]);

  const filteredContributions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return contributions.filter((cont) => {
      const matchesTab = activeTab === 'All' || cont.status === activeTab;
      const matchesSearch =
        query.length === 0 ||
        cont.topic.toLowerCase().includes(query) ||
        cont.series.toLowerCase().includes(query);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, contributions]);

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden bg-[var(--bg-primary)]">
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4 lg:gap-4">
        <div>
          <h1 className="text-2xl md:text-2xl lg:text-2xl font-bold tracking-tight text-[var(--text-main)]">My Contributions</h1>
          <p className="text-sm lg:text-sm text-[var(--text-muted)] mt-1">
            Track the status of your submitted articles and edits.
          </p>
        </div>
        <button 
          onClick={() => navigate('/articles')}
          className="bg-[var(--btn-primary)] text-[var(--btn-text)] px-4 py-3 sm:py-2 rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto"
        >
          <PlusCircle size={18} />
          <span className="inline">New Contribution</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row lg:flex-row justify-between items-start md:items-center lg:items-center gap-4 lg:gap-4 mb-6 md:mb-8 lg:mb-8 w-full">
        <div className="flex overflow-x-auto w-full md:w-auto gap-2 lg:gap-0 lg:space-x-1 bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-color)]">
          {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 whitespace-nowrap px-4 py-1.5 lg:py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-[var(--bg-card)] text-[var(--text-main)] shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 lg:w-64 shrink-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="space-y-4">
        {isLoading && (
          <div className="text-sm text-[var(--text-muted)]">Loading contributions…</div>
        )}

        {error && !isLoading && (
          <div className="text-sm text-red-500">{error}</div>
        )}

        {filteredContributions.length > 0 ? (
          filteredContributions.map((cont) => {
            const statusConfig = getStatusConfig(cont.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={cont.id || cont.displayId}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-5 lg:p-5 shadow-sm hover:shadow-md transition-shadow duration-200 w-full"
              >
                <div className="flex flex-col md:flex-row lg:flex-row md:items-start lg:items-start justify-between gap-4 md:gap-5 lg:gap-4 w-full">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                      >
                        <StatusIcon size={14} />
                        {cont.status}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs text-[var(--text-muted)] font-mono">{cont.displayId}</span>
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <span className="hidden sm:inline">•</span>
                          {new Date(cont.submittedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center text-xs sm:text-sm lg:text-sm font-medium text-[var(--text-muted)] mb-1">
                      <span className="hover:text-[var(--text-main)] cursor-pointer truncate lg:whitespace-normal">{cont.series}</span>
                      <ChevronRight size={14} className="mx-1 min-w-[14px] lg:mx-1.5 opacity-50" />
                      <span className="hover:text-[var(--text-main)] cursor-pointer truncate lg:whitespace-normal">{cont.chapter}</span>
                    </div>

                    <h3 className="text-base sm:text-lg lg:text-lg font-bold text-[var(--text-main)] mb-2 flex flex-col sm:flex-row sm:items-center sm:flex-wrap items-start gap-1.5 sm:gap-2 lg:gap-2">
                      <span className="truncate max-w-full lg:whitespace-normal">{cont.topic}</span>
                      <span className="inline-flex shrink-0 items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]">
                        {cont.type === 'New Topic' ? (
                          <PlusCircle size={10} className="mr-1" />
                        ) : (
                          <FileEdit size={10} className="mr-1" />
                        )}
                        {cont.type}
                      </span>
                    </h3>

                    <p className="text-[var(--text-muted)] text-sm line-clamp-2">{cont.excerpt}</p>

                    {cont.status === 'Rejected' && cont.feedback && (
                      <div className="mt-4 p-3 rounded-lg bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 flex gap-3 items-start">
                        <MessageSquare size={16} className="text-red-500 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-0.5">
                            Admin Feedback
                          </p>
                          <p className="text-sm text-[var(--text-muted)] break-words">{cont.feedback}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="md:text-right flex flex-col items-stretch md:items-end justify-start border-t md:border-t-0 border-[var(--border-color)] pt-4 md:pt-0 mt-4 md:mt-0 shrink-0 lg:w-40">
                    {cont.status === 'Approved' && cont.liveUrl ? (
                      <a
                        href={cont.liveUrl}
                        className="w-full md:w-auto lg:w-auto text-sm font-medium text-[var(--text-main)] md:text-[var(--text-brand)] lg:text-[var(--text-brand)] bg-[var(--bg-secondary)] md:bg-transparent lg:bg-transparent hover:bg-[var(--border-color)] md:hover:bg-transparent lg:hover:bg-transparent border border-[var(--border-color)] md:border-transparent lg:border-transparent rounded-xl md:rounded-none lg:rounded-none py-2.5 md:py-0 lg:py-0 md:hover:underline lg:hover:underline underline-offset-4 transition-all flex items-center justify-center md:justify-end gap-1.5 group/btn"
                      >
                        View Live Article
                        <ChevronRight size={14} className="md:hidden group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    ) : (
                      <span
                        title={cont.status !== 'Approved' ? 'Article is not yet approved' : 'Link unavailable'}
                        className="w-full md:w-auto lg:w-auto text-sm font-medium text-[var(--text-muted)] bg-[var(--bg-secondary)] md:bg-transparent lg:bg-transparent border border-[var(--border-color)] md:border-transparent lg:border-transparent rounded-xl md:rounded-none lg:rounded-none py-2.5 md:py-0 lg:py-0 transition-all opacity-60 cursor-not-allowed flex items-center justify-center md:justify-end gap-1.5"
                      >
                        View Live Article
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 px-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl border-dashed">
            <FileEdit size={40} className="mx-auto text-[var(--text-muted)] mb-3 opacity-50" />
            <h3 className="text-lg font-medium text-[var(--text-main)] mb-1">No contributions found</h3>
            <p className="text-[var(--text-muted)] text-sm mb-4">
              {searchQuery
                ? "We couldn't find any contributions matching your search."
                : "You haven't made any contributions in this category yet."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[var(--text-brand)] text-sm font-medium hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
