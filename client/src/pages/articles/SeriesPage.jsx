// Purpose: Public page showing chapters under a selected article series.

import { getInitialArticleTree } from '../../services/articles/articleTreeService';

export default function SeriesPage() {
	const articleTree = getInitialArticleTree();
	const series = articleTree[0];

	return (
		<main className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-8">
			<div className="max-w-4xl mx-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
				<h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">{series?.title || 'Series'}</h1>
				<p className="text-sm text-[var(--text-muted)] mb-5">Chapters in this series</p>

				<ul className="space-y-3">
					{(series?.chapters || []).map((chapter) => (
						<li key={chapter.id} className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] text-sm">
							{chapter.title}
						</li>
					))}
				</ul>
			</div>
		</main>
	);
}
