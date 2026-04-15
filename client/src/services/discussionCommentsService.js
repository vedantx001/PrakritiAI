const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const normalizedBaseUrl = String(API_BASE_URL || '').trim().replace(/\/+$/, '');

const buildUrl = (path) => {
	const normalizedPath = String(path || '');
	if (!normalizedBaseUrl) return normalizedPath;
	return `${normalizedBaseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
};

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

export const mapDiscussionComment = (comment) => {
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

export const getPostComments = async ({ postId } = {}) => {
	if (!postId) throw new Error('Missing postId');
	const payload = await request(`/api/discussions/posts/${postId}/comments`);
	const list = Array.isArray(payload) ? payload : payload?.comments;
	return (Array.isArray(list) ? list : []).map(mapDiscussionComment);
};

export const addPostComment = async ({ postId, content, parentId = null, token } = {}) => {
	if (!postId) throw new Error('Missing postId');
	if (!token) throw new Error('Missing auth token');
	const payload = await request(`/api/discussions/posts/${postId}/comments`, {
		method: 'POST',
		token,
		body: { content, ...(parentId ? { parentId } : {}) },
	});
	return mapDiscussionComment(payload?.comment);
};

export const votePostComment = async ({ postId, commentId, direction, token } = {}) => {
	if (!postId) throw new Error('Missing postId');
	if (!commentId) throw new Error('Missing commentId');
	if (!token) throw new Error('Missing auth token');
	const payload = await request(`/api/discussions/posts/${postId}/comments/${commentId}/vote`, {
		method: 'POST',
		token,
		body: { direction },
	});
	return mapDiscussionComment(payload?.comment);
};

export const updatePostComment = async ({ postId, commentId, content, token } = {}) => {
	if (!postId) throw new Error('Missing postId');
	if (!commentId) throw new Error('Missing commentId');
	if (!token) throw new Error('Missing auth token');
	const payload = await request(`/api/discussions/posts/${postId}/comments/${commentId}`, {
		method: 'PUT',
		token,
		body: { content },
	});
	return mapDiscussionComment(payload?.comment);
};

export const deletePostComment = async ({ postId, commentId, token } = {}) => {
	if (!postId) throw new Error('Missing postId');
	if (!commentId) throw new Error('Missing commentId');
	if (!token) throw new Error('Missing auth token');
	return request(`/api/discussions/posts/${postId}/comments/${commentId}`, {
		method: 'DELETE',
		token,
	});
};
