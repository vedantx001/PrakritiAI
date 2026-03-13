// Purpose: Arrange article reader layout with sidebar navigation and content area.

const ArticleLayout = ({ sidebar, children }) => (
	<div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-r-2xl lg:rounded-r-2xl lg:rounded-l-none shadow-[var(--shadow-soft)] overflow-hidden h-full">
		<div className="grid grid-cols-1 grid-rows-[auto_1fr] lg:grid-cols-[280px_1fr] lg:grid-rows-1 h-full min-h-0">
			<aside className="border-r border-[var(--border-color)] bg-[var(--bg-secondary)]">{sidebar}</aside>
			<section className="bg-[var(--bg-primary)] min-h-0">
				<div className="h-full overflow-y-auto">{children}</div>
			</section>
		</div>
	</div>
);

export default ArticleLayout;
