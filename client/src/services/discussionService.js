const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

	const payload = await readJsonSafely(response);
	if (!response.ok) {
		throw new Error(toErrorMessage(payload, 'Request failed'));
	}

	return payload;
};

const readJsonSafely = async (response) => {
	try {
		return await response.json();
	} catch {
		return null;
	}
};

const toErrorMessage = (payload, fallback) => {
	if (!payload) return fallback;
	if (typeof payload === 'string') return payload;
	if (payload?.message) return payload.message;
	return fallback;
};

export const fetchDiscussionPosts = async ({ page = 1, limit = 10, token } = {}) => {
	const response = await fetch(
		buildUrl(`/api/discussions/posts?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`),
		{
			method: 'GET',
			headers: {
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
		},
	);

	const payload = await readJsonSafely(response);
	if (!response.ok) {
		throw new Error(toErrorMessage(payload, 'Failed to load discussion posts'));
	}

	return payload;
};

export const fetchDiscussionPostById = async ({ postId, token } = {}) => {
	if (!postId) throw new Error('Post id is required');

	const response = await fetch(buildUrl(`/api/discussions/posts/${encodeURIComponent(postId)}`), {
		method: 'GET',
		headers: {
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	});

	const payload = await readJsonSafely(response);
	if (!response.ok) {
		throw new Error(toErrorMessage(payload, 'Failed to load discussion post'));
	}

	return payload?.post || null;
};

export const createDiscussionPost = async ({ title, content, tags }, { token } = {}) => {
	if (!token) throw new Error('Please log in to create a post');

	const response = await fetch(buildUrl('/api/discussions/posts'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			title,
			content,
			tags,
		}),
	});

	const payload = await readJsonSafely(response);
	if (!response.ok) {
		throw new Error(toErrorMessage(payload, 'Failed to create post'));
	}

	return payload?.post;
};

export const updateDiscussionPost = async (postId, { title, content, tags }, { token } = {}) => {
	if (!token) throw new Error('Please log in to edit a post');

	const response = await fetch(buildUrl(`/api/discussions/posts/${postId}`), {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			title,
			content,
			tags,
		}),
	});

	const payload = await readJsonSafely(response);
	if (!response.ok) {
		throw new Error(toErrorMessage(payload, 'Failed to update post'));
	}

	return payload?.post;
};

export const deleteDiscussionPost = async (postId, { token } = {}) => {
	if (!token) throw new Error('Please log in to delete a post');

	const response = await fetch(buildUrl(`/api/discussions/posts/${postId}`), {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const payload = await readJsonSafely(response);
	if (!response.ok) {
		throw new Error(toErrorMessage(payload, 'Failed to delete post'));
	}

	return payload;
};

// --- Engagement (Like / Save) ---

export const getDiscussionPostEngagement = async ({ postId, token } = {}) =>
	request(`/api/discussions/posts/${postId}/engagement`, {
		method: 'GET',
		token,
	});

export const likeDiscussionPost = async ({ postId, token }) =>
	request(`/api/discussions/posts/${postId}/like`, {
		method: 'POST',
		token,
	});

export const unlikeDiscussionPost = async ({ postId, token }) =>
	request(`/api/discussions/posts/${postId}/like`, {
		method: 'DELETE',
		token,
	});

export const saveDiscussionPost = async ({ postId, token }) =>
	request(`/api/save/discussion/${postId}`, {
		method: 'POST',
		token,
	});

export const unsaveDiscussionPost = async ({ postId, token }) =>
	request(`/api/save/discussion/${postId}`, {
		method: 'DELETE',
		token,
	});
