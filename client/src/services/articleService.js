const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const request = async (path, { method = 'GET', token, body } = {}) => {
	const response = await fetch(buildUrl(path), {
		method,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		...(body ? { body: JSON.stringify(body) } : {}),
	});

	let payload = null;
	try {
		payload = await response.json();
	} catch {
		payload = null;
	}

	if (!response.ok) {
		throw new Error(payload?.message || 'Request failed');
	}

	return payload;
};

const resolveContributorName = (contributor) => {
	if (!contributor) return null;
	if (typeof contributor === 'string') return null;
	return contributor?.name || null;
};

const mapTopic = (topic, chapterId) => ({
	id: topic._id,
	chapterId,
	title: topic.title,
	slug: topic.slug,
	content: topic.content || '',
	tags: Array.isArray(topic.tags) ? topic.tags : [],
	contributorName: resolveContributorName(topic.contributor),
	publishedAt: topic.updatedAt || topic.createdAt,
});

const mapChapter = (chapter, seriesId, topics = []) => ({
	id: chapter._id,
	seriesId,
	title: chapter.title,
	slug: chapter.slug,
	topics: topics.map((topic) => mapTopic(topic, chapter._id)),
});

const mapSeries = (series, chapters = []) => ({
	id: series._id,
	title: series.title,
	slug: series.slug,
	chapters: chapters.map((chapter) => chapter),
});

export const getPublishedArticleTree = async () => {
	const seriesList = await request('/api/articles/series');

	const tree = await Promise.all(
		seriesList.map(async (series) => {
			const chapters = await request(`/api/articles/${series.slug}/chapters`);

			const mappedChapters = await Promise.all(
				chapters.map(async (chapter) => {
					const topics = await request(`/api/articles/chapter/${chapter.slug}/topics`);
					return mapChapter(chapter, series._id, topics);
				})
			);

			return mapSeries(series, mappedChapters);
		})
	);

	return tree;
};

export const createSeriesAdmin = async ({ title, description = '', order = 0, token }) =>
	request('/api/admin/articles/series', {
		method: 'POST',
		token,
		body: { title, description, order },
	});

export const createChapterAdmin = async ({ title, seriesId, order = 0, token }) =>
	request('/api/admin/articles/chapter', {
		method: 'POST',
		token,
		body: { title, seriesId, order },
	});

export const updateSeriesAdmin = async ({ seriesId, title, description, order, published, token }) =>
	request(`/api/admin/articles/series/${seriesId}`, {
		method: 'PUT',
		token,
		body: { title, description, order, published },
	});

export const updateChapterAdmin = async ({ chapterId, title, seriesId, order, published, token }) =>
	request(`/api/admin/articles/chapter/${chapterId}`, {
		method: 'PUT',
		token,
		body: { title, seriesId, order, published },
	});

export const createTopicAdmin = async ({ title, chapterId, content, tags, token }) =>
	request('/api/admin/articles/topic', {
		method: 'POST',
		token,
		body: { title, chapterId, content, tags },
	});

export const updateTopicAdmin = async ({ topicId, title, chapterId, content, tags, token }) =>
	request(`/api/admin/articles/topic/${topicId}`, {
		method: 'PUT',
		token,
		body: { title, chapterId, content, tags },
	});

export const publishTopicAdmin = async ({ topicId, token }) =>
	request(`/api/admin/articles/topic/${topicId}/publish`, {
		method: 'PUT',
		token,
	});

export const deleteSeriesAdmin = async ({ seriesId, token }) =>
	request(`/api/admin/articles/series/${seriesId}`, {
		method: 'DELETE',
		token,
	});

export const deleteChapterAdmin = async ({ chapterId, token }) =>
	request(`/api/admin/articles/chapter/${chapterId}`, {
		method: 'DELETE',
		token,
	});

export const deleteTopicAdmin = async ({ topicId, token }) =>
	request(`/api/admin/articles/topic/${topicId}`, {
		method: 'DELETE',
		token,
	});

export const submitContribution = async ({ contributionType, chapterId, topicId, title, content, tags, token }) =>
	request('/api/contributions', {
		method: 'POST',
		token,
		body: { contributionType, chapterId, topicId, title, content, tags },
	});

export const getMyContributions = async ({ token }) =>
	request('/api/contributions/mine', {
		method: 'GET',
		token,
	});

// --- Admin Contributions ---

export const getPendingContributionsAdmin = async ({ token }) =>
	request('/api/admin/contributions', {
		method: 'GET',
		token,
	});

export const approveContributionAdmin = async ({ contributionId, token }) =>
	request(`/api/admin/contributions/${contributionId}/approve`, {
		method: 'PATCH',
		token,
	});

export const rejectContributionAdmin = async ({ contributionId, feedback, token }) =>
	request(`/api/admin/contributions/${contributionId}/reject`, {
		method: 'PATCH',
		token,
		body: { feedback },
	});

// --- Engagement (Like / Save) ---

export const getArticleTopicEngagement = async ({ topicId, token } = {}) =>
	request(`/api/articles/topic/${topicId}/engagement`, {
		method: 'GET',
		token,
	});

export const likeArticleTopic = async ({ topicId, token }) =>
	request(`/api/articles/topic/${topicId}/like`, {
		method: 'POST',
		token,
	});

export const unlikeArticleTopic = async ({ topicId, token }) =>
	request(`/api/articles/topic/${topicId}/like`, {
		method: 'DELETE',
		token,
	});

export const saveArticleTopic = async ({ topicId, token }) =>
	request(`/api/save/article/${topicId}`, {
		method: 'POST',
		token,
	});

export const unsaveArticleTopic = async ({ topicId, token }) =>
	request(`/api/save/article/${topicId}`, {
		method: 'DELETE',
		token,
	});
