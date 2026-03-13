// Purpose: Show series > chapter > topic breadcrumb trail in article pages.

const Breadcrumbs = ({ items = [] }) => (
	<nav aria-label="Article breadcrumbs" className="mb-3">
		<ol className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
			{items.filter(Boolean).map((item, index, arr) => (
				<li key={`${item}-${index}`} className="flex items-center gap-2">
					<span className={index === arr.length - 1 ? 'text-[var(--text-brand)] font-semibold' : ''}>{item}</span>
					{index < arr.length - 1 && <span>/</span>}
				</li>
			))}
		</ol>
	</nav>
);

export default Breadcrumbs;
