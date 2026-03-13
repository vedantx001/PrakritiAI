const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const extractInvalidSymptomsExamples = (payload) => {
	// Server wraps AI-service response under `details`.
	const examples = payload?.details?.detail?.examples || payload?.detail?.examples;
	return Array.isArray(examples) ? examples : [];
};

const toErrorMessage = (payload, fallback) => {
	if (!payload) return fallback;
	if (typeof payload === 'string') return payload;
	if (payload?.message) return payload.message;
	if (payload?.detail?.message) return payload.detail.message;
	return fallback;
};

/**
 * Calls the server AI endpoint.
 * Server route: POST /api/ai/analyze
 *
 * @param {Object} input
 * @param {string} input.symptoms
 * @param {number} input.age
 * @param {string} input.gender
 * @param {string} [input.duration]
 * @param {number} [input.severity] 1-10
 * @param {string} [input.additional_details]
 * @param {Object} [options]
 * @param {string} [options.token] Bearer token (optional; enables saving history).
 */
export const analyzeSymptoms = async (input, options = {}) => {
	const response = await fetch(buildUrl('/api/ai/analyze'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
		},
		body: JSON.stringify({
			symptoms: input.symptoms,
			age: Number(input.age),
			gender: String(input.gender || '').trim().toLowerCase(),
			duration: input.duration || '',
			severity: Number.isFinite(Number(input.severity)) ? Number(input.severity) : null,
			additional_details: input.additional_details || '',
		}),
	});

	let payload = null;
	try {
		payload = await response.json();
	} catch {
		payload = null;
	}

	if (!response.ok) {
		const message =
			payload?.details?.detail?.message ||
			payload?.detail?.message ||
			toErrorMessage(payload, 'Failed to analyze symptoms');

		const err = new Error(message);
		err.status = response.status;
		err.payload = payload;

		// AI service strict validation returns 422 with examples.
		if (response.status === 422) {
			const examples = extractInvalidSymptomsExamples(payload);
			if (examples.length) {
				err.code = 'INVALID_SYMPTOMS';
				err.examples = examples;
			}
		}

		throw err;
	}

	return payload;
};
