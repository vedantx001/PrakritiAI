// Purpose: Render article title and metadata for reader pages.

const ArticleHeader = ({ title, description }) => (
	<div className="mb-5">
		<h1 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] leading-tight">{title}</h1>
		{description && <p className="text-sm text-[var(--text-muted)] mt-2">{description}</p>}
	</div>
);

export default ArticleHeader;
