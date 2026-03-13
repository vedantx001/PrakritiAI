// Purpose: Public page rendering a selected topic's full article content.

import { useMemo, useState } from 'react';
import ArticleContent from '../../components/articles/ArticleContent';
import ArticleLayout from '../../components/articles/ArticleLayout';
import Breadcrumbs from '../../components/articles/BreadCrumbs';
import ArticleTree from '../../components/articles/public/ArticleTree';
import { getInitialArticleTree } from '../../services/articles/articleTreeService';
import { getDefaultSelection } from '../../utils/articles/mapArticleTree';

const getSelectionDetails = (articleTree, selected) => {
	const series = articleTree.find((item) => item.id === selected.seriesId);
	const chapter = series?.chapters.find((item) => item.id === selected.chapterId) || series?.chapters[0];
	const topic = chapter?.topics.find((item) => item.id === selected.topicId) || chapter?.topics[0];

	return { series, chapter, topic };
};

export default function TopicPage() {
	const articleTree = getInitialArticleTree();
	const [selected, setSelected] = useState(getDefaultSelection(articleTree));
	const { series, chapter, topic } = useMemo(() => getSelectionDetails(articleTree, selected), [articleTree, selected]);

	return (
		<main className="h-screen bg-[var(--bg-primary)] p-6 md:p-8 overflow-hidden">
			<div className="max-w-7xl mx-auto h-full min-h-0">
				<ArticleLayout sidebar={<ArticleTree articleTree={articleTree} selected={selected} onSelect={setSelected} />}>
					<div className="p-6 md:p-8 h-full min-h-0">
						<Breadcrumbs items={[series?.title, chapter?.title, topic?.title]} />
						<ArticleContent title={topic?.title || 'Topic'} content={topic?.content} publishedAt={topic?.publishedAt} />
					</div>
				</ArticleLayout>
			</div>
		</main>
	);
}
