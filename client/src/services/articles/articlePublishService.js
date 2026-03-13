// Purpose: API service helpers for create, update, and publish article actions.

import { slugify, isSameLabel } from '../../utils/articles/slugHelpers';

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const publishArticleDraft = ({ articleTree, draft }) => {
	const seriesTitle = draft.seriesTitle.trim();
	const chapterTitle = draft.chapterTitle.trim();
	const topicTitle = draft.topicTitle.trim();
	const content = draft.content.trim();
	const tags = (draft.tags || '')
		.split(',')
		.map((tag) => tag.trim())
		.filter((tag) => tag.length > 0);

	if (!seriesTitle || !chapterTitle || !topicTitle || !content) {
		return {
			ok: false,
			message: 'Series, chapter, topic, and content are required to publish.',
			nextTree: articleTree,
			nextSelection: null,
		};
	}

	const nextTree = structuredClone(articleTree);

	let series = nextTree.find((item) => isSameLabel(item.title, seriesTitle));
	if (!series) {
		series = {
			id: makeId('series'),
			title: seriesTitle,
			slug: slugify(seriesTitle),
			chapters: [],
		};
		nextTree.push(series);
	}

	let chapter = series.chapters.find((item) => isSameLabel(item.title, chapterTitle));
	if (!chapter) {
		chapter = {
			id: makeId('chapter'),
			title: chapterTitle,
			slug: slugify(chapterTitle),
			topics: [],
		};
		series.chapters.push(chapter);
	}

	const existingTopic = chapter.topics.find((item) => isSameLabel(item.title, topicTitle));
	const publishedAt = new Date().toISOString();

	if (existingTopic) {
		existingTopic.content = content;
		existingTopic.tags = tags;
		existingTopic.publishedAt = publishedAt;
		existingTopic.slug = slugify(topicTitle);
	} else {
		chapter.topics.push({
			id: makeId('topic'),
			chapterId: chapter.id,
			title: topicTitle,
			slug: slugify(topicTitle),
			content,
			tags,
			publishedAt,
		});
	}

	const topic = chapter.topics.find((item) => isSameLabel(item.title, topicTitle));

	return {
		ok: true,
		message: `Published "${topicTitle}" under ${seriesTitle} > ${chapterTitle}.`,
		nextTree,
		nextSelection: {
			seriesId: series.id,
			chapterId: chapter.id,
			topicId: topic.id,
		},
	};
};
