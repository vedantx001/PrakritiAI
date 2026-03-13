// Purpose: API service helpers for fetching series/chapter/topic hierarchy data.

import { mapArticleTree } from '../../utils/articles/mapArticleTree';
import { slugify } from '../../utils/articles/slugHelpers';

const ARTICLE_TREE_STORAGE_KEY = 'prakritiai.articleTree';

const seedTree = [
	{
		id: 'series-ayurveda-intro',
		title: 'Introduction to Ayurveda',
		slug: slugify('Introduction to Ayurveda'),
		chapters: [
			{
				id: 'chapter-history-ayurveda',
				title: 'History of Ayurveda',
				slug: slugify('History of Ayurveda'),
				topics: [
					{
						id: 'topic-what-is-ayurveda',
						title: 'What is Ayurveda',
						slug: slugify('What is Ayurveda'),
						content:
							'Ayurveda is a traditional system of health and wellness rooted in Indian knowledge systems.\n\nIt focuses on balance between body, mind, and lifestyle, with personalized guidance based on constitution and daily routine.',
						tags: ['Ayurveda', 'Wellness', 'Foundations'],
						publishedAt: new Date().toISOString(),
					},
				],
			},
		],
	},
];

export const getInitialArticleTree = () => mapArticleTree(seedTree);

export const getArticleTree = () => {
	if (typeof window === 'undefined') {
		return getInitialArticleTree();
	}

	const raw = window.localStorage.getItem(ARTICLE_TREE_STORAGE_KEY);

	if (!raw) {
		const initial = getInitialArticleTree();
		window.localStorage.setItem(ARTICLE_TREE_STORAGE_KEY, JSON.stringify(initial));
		return initial;
	}

	try {
		const parsed = JSON.parse(raw);
		return mapArticleTree(parsed);
	} catch {
		const initial = getInitialArticleTree();
		window.localStorage.setItem(ARTICLE_TREE_STORAGE_KEY, JSON.stringify(initial));
		return initial;
	}
};

export const saveArticleTree = (articleTree = []) => {
	if (typeof window === 'undefined') {
		return;
	}

	window.localStorage.setItem(ARTICLE_TREE_STORAGE_KEY, JSON.stringify(articleTree));
};
