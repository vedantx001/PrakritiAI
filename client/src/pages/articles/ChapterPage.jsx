// Purpose: Public page showing topics under a selected chapter.

import { getInitialArticleTree } from '../../services/articles/articleTreeService';

export default function ChapterPage() {
	const articleTree = getInitialArticleTree();
	const series = articleTree[0];
	const chapter = series?.chapters?.[0];

	return (
		<main className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-8">
			<div className="max-w-4xl mx-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
				<h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">{chapter?.title || 'Chapter'}</h1>
				<p className="text-sm text-[var(--text-muted)] mb-5">Topics under this chapter</p>

				<ul className="space-y-3">
					{(chapter?.topics || []).map((topic) => (
						<li key={topic.id} className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] text-sm">
							{topic.title}
						</li>
					))}
				</ul>
			</div>
		</main>
	);
}
