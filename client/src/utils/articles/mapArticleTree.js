// Purpose: Transform backend article responses into frontend tree-friendly shape.

import { slugify } from './slugHelpers';

const withTopicShape = (topic, chapterId) => ({
	id: topic.id,
	chapterId,
	title: topic.title,
	slug: topic.slug || slugify(topic.title),
	content: topic.content || '',
	tags: Array.isArray(topic.tags) ? topic.tags : [],
	publishedAt: topic.publishedAt || new Date().toISOString(),
});

const withChapterShape = (chapter, seriesId) => ({
	id: chapter.id,
	seriesId,
	title: chapter.title,
	slug: chapter.slug || slugify(chapter.title),
	topics: (chapter.topics || []).map((topic) => withTopicShape(topic, chapter.id)),
});

export const mapArticleTree = (seriesList = []) =>
	(seriesList || []).map((series) => ({
		id: series.id,
		title: series.title,
		slug: series.slug || slugify(series.title),
		chapters: (series.chapters || []).map((chapter) => withChapterShape(chapter, series.id)),
	}));

export const getDefaultSelection = (articleTree = []) => {
	const firstSeries = articleTree[0];
	const firstChapter = firstSeries?.chapters?.[0];
	const firstTopic = firstChapter?.topics?.[0];

	return {
		seriesId: firstSeries?.id || '',
		chapterId: firstChapter?.id || '',
		topicId: firstTopic?.id || '',
	};
};
