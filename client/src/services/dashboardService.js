const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const buildUrl = (path) => `${API_BASE_URL}${path}`;

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

export const getSavedLibrary = async ({ token } = {}) => {
	if (!token) throw new Error('Please log in to view your saved library');
	return request('/api/dashboard/saved-library', { method: 'GET', token });
};

export const getHealthSummary = async ({ token } = {}) => {
	if (!token) throw new Error('Please log in to view your health summary');
	return request('/api/dashboard/health-summary', { method: 'GET', token });
};

export const getAIHistory = async ({ token } = {}) => {
	if (!token) throw new Error('Please log in to view your history');
	return request('/api/dashboard/ai-history', { method: 'GET', token });
};
