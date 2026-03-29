// Purpose: Render the main article body content for the selected topic.

import { useMemo } from 'react';
import { Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react';
import DOMPurify from 'dompurify';

const isProbablyHtml = (value) => /<\/?[a-z][\s\S]*>/i.test(value || '');

const ArticleContent = ({
	title,
	content,
	publishedAt,
	contributorName,
	tags = [],
	onOpenComments,
	onShare,
	likesCount,
	savesCount,
	isLiked,
	isSaved,
	onToggleLike,
	onToggleSave,
	likeDisabled,
	saveDisabled,
}) => {
	const asString = content || '';
	const htmlContent = useMemo(() => {
		if (!isProbablyHtml(asString)) return '';
		return DOMPurify.sanitize(asString, {
			ALLOWED_TAGS: [
				'p',
				'br',
				'strong',
				'em',
				'u',
				's',
				'a',
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'ul',
				'ol',
				'li',
				'blockquote',
				'code',
				'pre',
				'hr',
				'table',
				'thead',
				'tbody',
				'tr',
				'th',
				'td',
			],
			ALLOWED_ATTR: ['href', 'target', 'rel', 'colspan', 'rowspan'],
		});
	}, [asString]);

	const paragraphs = useMemo(
		() => asString.split('\n').filter((line) => line.trim().length > 0),
		[asString]
	);

	return (
		<article className="p-6 md:p-8">
			<h1 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-2 leading-tight">{title}</h1>

			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					{publishedAt ? (
						<p className="text-xs text-[var(--text-muted)]">Last Updated {new Date(publishedAt).toLocaleString()}</p>
					) : (
						<p className="text-xs text-[var(--text-muted)]">Last Updated —</p>
					)}
					{contributorName ? (
						<p className="text-xs text-[var(--text-muted)]">Contributed by {contributorName}</p>
					) : null}
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={onShare}
						disabled={!onShare}
						className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-2.5 py-1.5 text-xs text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
					>
						<Share2 size={14} />
						Share
					</button>
					<button
						type="button"
						onClick={onOpenComments}
						className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-2.5 py-1.5 text-xs text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
					>
						<MessageCircle size={14} />
						Comment
					</button>
					<button
						type="button"
						onClick={onToggleLike}
						disabled={Boolean(likeDisabled)}
						className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-2.5 py-1.5 text-xs text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
					>
						<Heart
							size={14}
							className={isLiked ? 'text-[var(--text-brand)]' : undefined}
							fill={isLiked ? 'currentColor' : 'none'}
						/>
						<span className={isLiked ? 'text-[var(--text-brand)] font-medium' : undefined}>
							Like{typeof likesCount === 'number' ? ` (${likesCount})` : ''}
						</span>
					</button>
					<button
						type="button"
						onClick={onToggleSave}
						disabled={Boolean(saveDisabled)}
						className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-2.5 py-1.5 text-xs text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
					>
						<Bookmark
							size={14}
							className={isSaved ? 'text-[var(--text-brand)]' : undefined}
							fill={isSaved ? 'currentColor' : 'none'}
						/>
						<span className={isSaved ? 'text-[var(--text-brand)] font-medium' : undefined}>
							Save{typeof savesCount === 'number' ? ` (${savesCount})` : ''}
						</span>
					</button>
				</div>
			</div>

			{tags.length > 0 && (
				<div className="mb-5 flex flex-wrap gap-2">
					{tags.map((tag) => (
						<span
							key={tag}
							className="inline-flex items-center rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-xs font-medium text-[var(--text-main)] border border-[var(--border-color)]"
						>
							{tag}
						</span>
					))}
				</div>
			)}

			<div className="article-prose">
				{htmlContent ? (
					<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
				) : paragraphs.length > 0 ? (
					paragraphs.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)
				) : (
					<p className="text-[var(--text-muted)]">No content published for this topic yet.</p>
				)}
			</div>
		</article>
	);
};

export default ArticleContent;
