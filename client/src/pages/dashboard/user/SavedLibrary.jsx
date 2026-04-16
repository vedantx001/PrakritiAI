import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, MessageCircle } from 'lucide-react';
import { useAuth } from '../../../context/useAuth';
import { getSavedLibrary } from '../../../services/dashboardService';
import SavedItem from '../../../components/dashboard/user/SavedItem';

const formatShortDate = (value) => {
	if (!value) return '';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';
	return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export default function SavedLibrary() {
	const navigate = useNavigate();
	const { token } = useAuth();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [library, setLibrary] = useState({ articles: [], discussionPosts: [] });

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			setLoading(true);
			setError('');
			try {
				const payload = await getSavedLibrary({ token });
				if (cancelled) return;
				setLibrary({
					articles: Array.isArray(payload?.articles) ? payload.articles : [],
					discussionPosts: Array.isArray(payload?.discussionPosts) ? payload.discussionPosts : [],
				});
			} catch (err) {
				if (!cancelled) {
					setLibrary({ articles: [], discussionPosts: [] });
					setError(err?.message || 'Failed to load saved library');
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		load();
		return () => {
			cancelled = true;
		};
	}, [token]);

	const articleItems = useMemo(() => library.articles || [], [library.articles]);
	const postItems = useMemo(() => library.discussionPosts || [], [library.discussionPosts]);

	return (
		<main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden bg-[var(--bg-primary)]">
			<div className="mb-6 lg:mb-8">
				<h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] mb-1">Saved Library</h1>
				<p className="text-sm sm:text-base lg:text-base text-[var(--text-muted)]">Your saved articles and discussion posts.</p>
			</div>

			{error ? (
				<div className="mb-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 text-[var(--text-muted)]">
					{error}
				</div>
			) : null}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full">
				<div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-[var(--shadow-soft)] p-4 sm:p-5 lg:p-6 w-full flex flex-col">
					<div className="flex items-center justify-between mb-3 lg:mb-4 gap-2">
						<div className="flex items-center gap-2 sm:gap-3 min-w-0">
							<div className="p-1.5 sm:p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-brand)] shrink-0">
								<BookOpen size={18} />
							</div>
							<h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] truncate">Saved Articles</h2>
						</div>
						<span className="text-xs sm:text-sm text-[var(--text-muted)] font-medium shrink-0">{articleItems.length}</span>
					</div>

					{loading ? (
						<div className="text-sm text-[var(--text-muted)]">Loading…</div>
					) : articleItems.length === 0 ? (
						<div className="text-sm text-[var(--text-muted)]">No saved articles yet.</div>
					) : (
						<div className="space-y-1">
							{articleItems.map((item) => (
								<SavedItem
									key={item.id}
									type="Article"
									title={item.title || 'Untitled'}
									date={formatShortDate(item.updatedAt)}
									onClick={() => {
										if (item?.seriesSlug && item?.chapterSlug && item?.topicSlug) {
											navigate(`/articles/${item.seriesSlug}/${item.chapterSlug}/${item.topicSlug}`);
											return;
										}
											navigate('/articles');
									}}
								/>
							))}
						</div>
					)}
				</div>

				<div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-[var(--shadow-soft)] p-4 sm:p-5 lg:p-6 w-full flex flex-col">
					<div className="flex items-center justify-between mb-3 lg:mb-4 gap-2">
						<div className="flex items-center gap-2 sm:gap-3 min-w-0">
							<div className="p-1.5 sm:p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-brand)] shrink-0">
								<MessageCircle size={18} />
							</div>
							<h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] truncate">Saved Posts</h2>
						</div>
						<span className="text-xs sm:text-sm text-[var(--text-muted)] font-medium shrink-0">{postItems.length}</span>
					</div>

					{loading ? (
						<div className="text-sm text-[var(--text-muted)]">Loading…</div>
					) : postItems.length === 0 ? (
						<div className="text-sm text-[var(--text-muted)]">No saved posts yet.</div>
					) : (
						<div className="space-y-1">
							{postItems.map((item) => (
								<SavedItem
									key={item.id}
									type="Post"
									title={item.title || 'Untitled'}
									date={formatShortDate(item.updatedAt)}
									onClick={() => navigate('/discussions')}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
