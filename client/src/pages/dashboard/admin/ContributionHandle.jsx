import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  ChevronRight,
  FileEdit,
  PlusCircle,
  User,
  Clock,
  MessageSquare,
  ArrowRightLeft,
  AlertCircle,
} from 'lucide-react';

import {
  approveContributionAdmin,
  getPendingContributionsAdmin,
  rejectContributionAdmin,
} from '../../../services/articleService';
import { useAuth } from '../../../context/useAuth';

const POLL_INTERVAL_MS = 15000;

const toHandle = (name, email) => {
  const fromEmail = String(email || '').split('@')[0]?.trim();
  if (fromEmail) return fromEmail;

  const fromName = String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

  return fromName || 'user';
};

const toAvatar = (name, email) => {
  const source = String(name || '').trim() || String(email || '').trim();
  return source ? source[0].toUpperCase() : '?';
};

const toTypeLabel = (contributionType) =>
  String(contributionType || '').toLowerCase() === 'new_topic' ? 'New Topic' : 'Edit Existing';

const toQueueItem = (cont) => {
  const id = cont?._id || cont?.id;
  const displayId = id ? `CONT-${String(id).slice(-6).toUpperCase()}` : 'CONT-—';

  const contributorName = cont?.contributor?.name;
  const contributorEmail = cont?.contributor?.email;
  const username = toHandle(contributorName, contributorEmail);
  const avatar = toAvatar(contributorName, contributorEmail);

  const chapter = cont?.chapter || cont?.topic?.chapter;
  const series = chapter?.series;

  const seriesTitle = series?.title || '—';
  const chapterTitle = chapter?.title || '—';

  const type = toTypeLabel(cont?.contributionType);
  const topicTitle =
    type === 'New Topic'
      ? cont?.proposedTitle || 'New Topic'
      : cont?.topic?.title || cont?.proposedTitle || 'Topic Update';

  const originalContent = type === 'Edit Existing' ? cont?.topic?.content || '' : null;
  const proposedContent = cont?.proposedContent || '';

  return {
    id,
    displayId,
    username,
    avatar,
    series: seriesTitle,
    chapter: chapterTitle,
    topic: topicTitle,
    type,
    submittedAt: cont?.createdAt || cont?.submittedAt,
    note: null,
    originalContent,
    proposedContent,
  };
};

export default function ContributionHandle() {
  const { token } = useAuth();
  const [queue, setQueue] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState('');

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const selectedContribution = useMemo(
    () => queue.find((c) => c.id === selectedId),
    [queue, selectedId]
  );

  const loadQueue = async ({ keepSelection = true } = {}) => {
    if (!token) {
      setQueue([]);
      setSelectedId(null);
      return;
    }

    const pending = await getPendingContributionsAdmin({ token });
    const nextQueue = Array.isArray(pending) ? pending.map(toQueueItem) : [];

    setQueue(nextQueue);
    setSelectedId((previousSelectedId) => {
      if (keepSelection && previousSelectedId && nextQueue.some((c) => c.id === previousSelectedId)) {
        return previousSelectedId;
      }
      return nextQueue[0]?.id || null;
    });
  };

  useEffect(() => {
    let isMounted = true;
    let intervalId = null;

    if (!token) {
      setQueue([]);
      setSelectedId(null);
      setError('');
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);
    setError('');

    getPendingContributionsAdmin({ token })
      .then((pending) => {
        if (!isMounted) return;
        const nextQueue = Array.isArray(pending) ? pending.map(toQueueItem) : [];
        setQueue(nextQueue);
        setSelectedId((previousSelectedId) => {
          if (previousSelectedId && nextQueue.some((c) => c.id === previousSelectedId)) {
            return previousSelectedId;
          }
          return nextQueue[0]?.id || null;
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || 'Failed to load contributions');
        setQueue([]);
        setSelectedId(null);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    intervalId = window.setInterval(() => {
      loadQueue({ keepSelection: true }).catch(() => {
        // keep last known queue if polling fails
      });
    }, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [token]);

  const handleApprove = (id) => {
    (async () => {
      if (!token || !id) return;

      setActionLoadingId(id);
      setError('');

      try {
        await approveContributionAdmin({ contributionId: id, token });

        setQueue((previousQueue) => {
          const nextQueue = previousQueue.filter((c) => c.id !== id);
          setSelectedId((previousSelectedId) => {
            if (previousSelectedId !== id) return previousSelectedId;
            return nextQueue[0]?.id || null;
          });
          return nextQueue;
        });

        await loadQueue({ keepSelection: true });
      } catch (err) {
        setError(err?.message || 'Failed to approve contribution');
      } finally {
        setActionLoadingId('');
      }
    })();
  };

  const handleRejectSubmit = () => {
    if (!selectedId) return;

    (async () => {
      if (!token) return;

      setActionLoadingId(selectedId);
      setError('');

      try {
        await rejectContributionAdmin({ contributionId: selectedId, feedback: rejectReason.trim(), token });

        setQueue((previousQueue) => {
          const nextQueue = previousQueue.filter((c) => c.id !== selectedId);
          setSelectedId(nextQueue[0]?.id || null);
          return nextQueue;
        });

        setIsRejectModalOpen(false);
        setRejectReason('');

        await loadQueue({ keepSelection: true });
      } catch (err) {
        setError(err?.message || 'Failed to reject contribution');
      } finally {
        setActionLoadingId('');
      }
    })();
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-primary)]">
      <div className="px-6 md:px-8 py-6 border-b border-[var(--border-color)] bg-[var(--bg-card)] shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-[var(--text-brand)]">
              <FileEdit size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
                Contribution Handle
              </h1>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                Examine and moderate community submissions.
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-secondary)] text-[var(--text-brand)] border border-[var(--border-color)]">
            {queue.length} Pending Review
          </span>
        </div>

        {isLoading && <p className="mt-3 text-xs text-[var(--text-muted)]">Loading contributions…</p>}
        {error && !isLoading && <p className="mt-3 text-xs text-red-500">{error}</p>}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <aside className="w-full lg:w-80 border-r border-[var(--border-color)] bg-[var(--bg-primary)] overflow-y-auto shrink-0 flex flex-col">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Review Queue
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {queue.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-muted)]">
                <CheckCircle size={32} className="mx-auto mb-3 opacity-50 text-[var(--text-brand)]" />
                <p className="text-sm">Inbox Zero!</p>
                <p className="text-xs mt-1">No pending contributions.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--border-color)]">
                {queue.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full text-left p-4 hover:bg-[var(--bg-secondary)] transition-colors ${
                        selectedId === item.id
                          ? 'bg-[var(--bg-secondary)] border-l-4 border-l-[var(--text-brand)]'
                          : 'border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            item.type === 'New Topic'
                              ? 'bg-[var(--text-brand)]/10 text-[var(--text-brand)] border-[var(--text-brand)]/20'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                          }`}
                        >
                          {item.type}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(item.submittedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--text-main)] mb-1 truncate">{item.topic}</h3>
                      <p className="text-xs text-[var(--text-muted)] truncate flex items-center gap-1.5">
                        <User size={12} /> {item.username}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <section className="flex-1 bg-[var(--bg-primary)] overflow-hidden flex flex-col relative">
          {selectedContribution ? (
            <>
              <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-card)] shrink-0">
                <div className="flex flex-wrap items-center text-xs font-medium text-[var(--text-muted)] mb-3">
                  <span>{selectedContribution.series}</span>
                  <ChevronRight size={14} className="mx-1.5 opacity-50" />
                  <span>{selectedContribution.chapter}</span>
                  <ChevronRight size={14} className="mx-1.5 opacity-50" />
                  <span className="text-[var(--text-main)] font-semibold">{selectedContribution.topic}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-3">
                      {selectedContribution.type === 'New Topic' ? (
                        <PlusCircle size={24} className="text-[var(--text-brand)]" />
                      ) : (
                        <FileEdit size={24} className="text-blue-500" />
                      )}
                      {selectedContribution.topic}
                    </h2>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-brand)] font-bold text-sm">
                        {selectedContribution.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-main)]">
                          Submitted by @{selectedContribution.username}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">{selectedContribution.displayId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsRejectModalOpen(true)}
                      disabled={Boolean(actionLoadingId)}
                      className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center gap-2"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedContribution.id)}
                      disabled={Boolean(actionLoadingId)}
                      className="px-6 py-2 text-sm font-medium text-[var(--btn-text)] bg-[var(--btn-primary)] rounded-lg hover:opacity-90 shadow-sm transition-opacity flex items-center gap-2"
                    >
                      <CheckCircle size={16} /> Approve & Publish
                    </button>
                  </div>
                </div>

                {selectedContribution.note && (
                  <div className="mt-5 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] flex gap-3 items-start">
                    <MessageSquare size={16} className="text-[var(--text-muted)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-main)] mb-0.5">Contributor Note</p>
                      <p className="text-sm text-[var(--text-muted)] italic">"{selectedContribution.note}"</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg-secondary)]/30">
                {selectedContribution.type === 'Edit Existing' ? (
                  <div className="flex flex-col lg:flex-row gap-6 h-full">
                    <div className="flex-1 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-sm flex flex-col overflow-hidden">
                      <div className="bg-red-50 dark:bg-red-950/20 border-b border-[var(--border-color)] p-3 px-4 flex items-center justify-between shrink-0">
                        <span className="text-sm font-bold text-red-700 dark:text-red-400">Original Current Live</span>
                      </div>
                      <div
                        className="p-6 overflow-y-auto article-prose"
                        dangerouslySetInnerHTML={{ __html: selectedContribution.originalContent }}
                      />
                    </div>

                    <div className="hidden lg:flex items-center justify-center text-[var(--border-color)]">
                      <ArrowRightLeft size={24} />
                    </div>

                    <div className="flex-1 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-sm flex flex-col overflow-hidden ring-1 ring-[var(--text-brand)]/30">
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 border-b border-[var(--border-color)] p-3 px-4 flex items-center justify-between shrink-0">
                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Proposed Changes</span>
                      </div>
                      <div
                        className="p-6 overflow-y-auto article-prose"
                        dangerouslySetInnerHTML={{ __html: selectedContribution.proposedContent }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-sm flex flex-col overflow-hidden">
                    <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] p-3 px-6 flex items-center justify-between shrink-0">
                      <span className="text-sm font-bold text-[var(--text-main)]">New Content Preview</span>
                    </div>
                    <div
                      className="p-8 overflow-y-auto article-prose"
                      dangerouslySetInnerHTML={{ __html: selectedContribution.proposedContent }}
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
              <div className="text-center">
                <FileEdit size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium text-[var(--text-main)]">Select a contribution</p>
                <p className="text-sm">Choose an item from the queue to review.</p>
              </div>
            </div>
          )}
        </section>
      </div>

      {isRejectModalOpen && selectedContribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[var(--border-color)] flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-full text-red-600 dark:text-red-400">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-main)]">Reject Contribution</h3>
                <p className="text-xs text-[var(--text-muted)]">ID: {selectedContribution.displayId}</p>
              </div>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                Feedback for @{selectedContribution.username} <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-[var(--text-muted)] mb-3">
                This message will be visible in their "My Contributions" section. Explain clearly why this change was not approved.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Thanks for contributing! However, this topic is currently being rewritten internally..."
                className="w-full h-32 p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] focus:border-transparent resize-none"
              />
            </div>

            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim() || Boolean(actionLoadingId)}
                className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
