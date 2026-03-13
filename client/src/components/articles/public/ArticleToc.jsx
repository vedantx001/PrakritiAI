// Purpose: Display the table of contents for the current article content.

const buildToc = (content = '') =>
	content
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.length > 0)
		.slice(0, 5);

const ArticleToc = ({ content }) => {
	const items = buildToc(content);

	if (items.length === 0) {
		return null;
	}

	return (
		<section className="mb-6 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
			<h3 className="text-sm font-semibold text-[var(--text-main)] mb-2">Contents</h3>
			<ul className="space-y-1.5">
				{items.map((item, index) => (
					<li key={`${item}-${index}`} className="text-xs text-[var(--text-muted)]">
						{index + 1}. {item}
					</li>
				))}
			</ul>
		</section>
	);
};

export default ArticleToc;
