// Purpose: Shared empty/error fallback UI when article data is unavailable.

const ArticleEmptyState = ({ message = 'No articles available yet.' }) => (
	<div className="p-8 text-center border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--bg-card)]">
		<p className="text-sm text-[var(--text-muted)]">{message}</p>
	</div>
);

export default ArticleEmptyState;
