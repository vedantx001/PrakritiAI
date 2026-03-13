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

const buildAvatarUrl = (authorName) => {
	const safeName = encodeURIComponent(authorName || 'Anonymous');
	return `https://i.pravatar.cc/150?u=prakritiai_${safeName}`;
};

export const mapArticleComment = (comment) => {
	const authorName = comment?.user?.name || 'Anonymous';
	const authorId = comment?.user?._id || comment?.user?.id || comment?.user || null;
	return {
		id: comment?._id,
		parentId: comment?.parent || null,
		authorId,
		authorName,
		authorAvatar: buildAvatarUrl(authorName),
		content: comment?.content || '',
		createdAt: new Date(comment?.createdAt || Date.now()).getTime(),
		upvotes: comment?.upvotes || 0,
		downvotes: comment?.downvotes || 0,
	};
};

export const getTopicComments = async ({ topicId } = {}) => {
	if (!topicId) throw new Error('Missing topicId');
	const payload = await request(`/api/articles/topic/${topicId}/comments`);
	const list = Array.isArray(payload) ? payload : payload?.comments;
	return (Array.isArray(list) ? list : []).map(mapArticleComment);
};

export const addTopicComment = async ({ topicId, content, parentId = null, token } = {}) => {
	if (!topicId) throw new Error('Missing topicId');
	if (!token) throw new Error('Missing auth token');
	const payload = await request(`/api/articles/topic/${topicId}/comments`, {
		method: 'POST',
		token,
		body: { content, ...(parentId ? { parentId } : {}) },
	});
	return mapArticleComment(payload?.comment);
};

export const voteTopicComment = async ({ topicId, commentId, direction, token } = {}) => {
	if (!topicId) throw new Error('Missing topicId');
	if (!commentId) throw new Error('Missing commentId');
	if (!token) throw new Error('Missing auth token');
	const payload = await request(`/api/articles/topic/${topicId}/comments/${commentId}/vote`, {
		method: 'POST',
		token,
		body: { direction },
	});
	return mapArticleComment(payload?.comment);
};

export const updateTopicComment = async ({ topicId, commentId, content, token } = {}) => {
	if (!topicId) throw new Error('Missing topicId');
	if (!commentId) throw new Error('Missing commentId');
	if (!token) throw new Error('Missing auth token');
	const payload = await request(`/api/articles/topic/${topicId}/comments/${commentId}`, {
		method: 'PUT',
		token,
		body: { content },
	});
	return mapArticleComment(payload?.comment);
};

export const deleteTopicComment = async ({ topicId, commentId, token } = {}) => {
	if (!topicId) throw new Error('Missing topicId');
	if (!commentId) throw new Error('Missing commentId');
	if (!token) throw new Error('Missing auth token');
	return request(`/api/articles/topic/${topicId}/comments/${commentId}`, {
		method: 'DELETE',
		token,
	});
};
