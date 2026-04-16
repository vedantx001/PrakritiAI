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
		<article className="py-2 sm:py-6 mx-auto w-full max-w-prose lg:max-w-3xl">
			<h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)] mb-4 leading-tight tracking-tight">{title}</h1>

			<div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
				<div className="flex flex-col gap-0.5">
					{publishedAt ? (
						<p className="text-sm text-[var(--text-muted)]">Last Updated {new Date(publishedAt).toLocaleString()}</p>
					) : (
						<p className="text-sm text-[var(--text-muted)]">Last Updated —</p>
					)}
					{contributorName ? (
						<p className="text-sm font-medium text-[var(--text-main)] mt-1">By {contributorName}</p>
					) : null}
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={onShare}
						disabled={!onShare}
						className="inline-flex items-center justify-center rounded-full sm:rounded-lg border border-[var(--border-color)] p-2 sm:px-3 sm:py-1.5 text-xs text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
						aria-label="Share"
					>
						<Share2 size={16} />
						<span className="hidden sm:ml-1.5 sm:inline font-medium">Share</span>
					</button>
					<button
						type="button"
						onClick={onOpenComments}
						className="inline-flex items-center justify-center rounded-full sm:rounded-lg border border-[var(--border-color)] p-2 sm:px-3 sm:py-1.5 text-xs text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
						aria-label="Comment"
					>
						<MessageCircle size={16} />
						<span className="hidden sm:ml-1.5 sm:inline font-medium">Comment</span>
					</button>
					<button
						type="button"
						onClick={onToggleLike}
						disabled={Boolean(likeDisabled)}
						className="inline-flex items-center justify-center rounded-full sm:rounded-lg border border-[var(--border-color)] p-2 sm:px-3 sm:py-1.5 text-xs text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
						aria-label="Like"
					>
						<Heart
							size={16}
							className={isLiked ? 'text-[var(--text-brand)]' : undefined}
							fill={isLiked ? 'currentColor' : 'none'}
						/>
						<span className={`hidden sm:ml-1.5 sm:inline font-medium ${isLiked ? 'text-[var(--text-brand)]' : ''}`}>
							{typeof likesCount === 'number' && likesCount > 0 ? likesCount : 'Like'}
						</span>
					</button>
					<button
						type="button"
						onClick={onToggleSave}
						disabled={Boolean(saveDisabled)}
						className="inline-flex items-center justify-center rounded-full sm:rounded-lg border border-[var(--border-color)] p-2 sm:px-3 sm:py-1.5 text-xs text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
						aria-label="Save"
					>
						<Bookmark
							size={16}
							className={isSaved ? 'text-[var(--text-brand)]' : undefined}
							fill={isSaved ? 'currentColor' : 'none'}
						/>
						<span className={`hidden sm:ml-1.5 sm:inline font-medium ${isSaved ? 'text-[var(--text-brand)]' : ''}`}>
							{typeof savesCount === 'number' && savesCount > 0 ? savesCount : 'Save'}
						</span>
					</button>
				</div>
			</div>

			{tags.length > 0 && (
				<div className="mb-6 flex flex-wrap gap-2">
					{tags.map((tag) => (
						<span
							key={tag}
							className="inline-flex items-center rounded-md bg-[var(--bg-secondary)] px-2.5 py-1 text-sm font-medium text-[var(--text-main)] border border-[var(--border-color)]/60"
						>
							{tag}
						</span>
					))}
				</div>
			)}

			<div className="article-prose prose-p:text-lg prose-p:leading-relaxed text-[var(--text-main)]">
				{htmlContent ? (
					<div dangerouslySetInnerHTML={{ __html: htmlContent }} className="space-y-4" />
				) : paragraphs.length > 0 ? (
					<div className="space-y-4">
						{paragraphs.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)}
					</div>
				) : (
					<p className="text-[var(--text-muted)] text-base">No content published for this topic yet.</p>
				)}
			</div>
		</article>
	);
};

export default ArticleContent;
