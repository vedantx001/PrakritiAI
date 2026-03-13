// Purpose: Public landing page listing available article series and entry points.

import { Link } from 'react-router-dom';
import { getInitialArticleTree } from '../../services/articles/articleTreeService';

export default function ArticlesHome() {
	const articleTree = getInitialArticleTree();

	return (
		<main className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-8">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-[var(--text-main)] mb-2">Articles</h1>
				<p className="text-[var(--text-muted)] mb-8">Explore published content by series and chapter.</p>

				<div className="space-y-6">
					{articleTree.map((series) => (
						<section key={series.id} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
							<h2 className="text-xl font-semibold text-[var(--text-main)] mb-3">{series.title}</h2>
							<ul className="space-y-2">
								{series.chapters.map((chapter) => (
									<li key={chapter.id} className="text-sm text-[var(--text-main)]">
										<span className="font-medium">{chapter.title}</span>
										<span className="text-[var(--text-muted)]"> ({chapter.topics.length} topics)</span>
									</li>
								))}
							</ul>

							<Link
								to="/dashboard/admin"
								className="inline-block mt-4 px-4 py-2 text-sm rounded-lg bg-[var(--btn-primary)] text-[var(--btn-text)] hover:opacity-90"
							>
								Open Admin Articles
							</Link>
						</section>
					))}
				</div>
			</div>
		</main>
	);
}
