// Purpose: Shared loading UI state for article pages and components.

const ArticleLoadingState = () => (
	<div className="p-8 text-center border border-[var(--border-color)] rounded-xl bg-[var(--bg-card)]">
		<p className="text-sm text-[var(--text-muted)]">Loading articles...</p>
	</div>
);

export default ArticleLoadingState;
