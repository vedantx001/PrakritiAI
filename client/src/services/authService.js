import {
	normalizeEmail,
	validateLoginInput,
	validateSignupInput,
} from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const parseAuthResponse = (payload) => ({
	token: payload.token,
	user: {
		id: payload.user.id,
		name: payload.user.name,
		fullName: payload.user.name,
		email: payload.user.email,
		age: payload.user.age,
		gender: payload.user.gender,
		role: payload.user.role,
	},
});

export const loginWithEmail = async ({ email, password }) => {
	const normalized = normalizeEmail(email);
	const validationMessage = validateLoginInput({ email: normalized, password });

	if (validationMessage) {
		throw new Error(validationMessage);
	}

	const response = await fetch(buildUrl('/api/auth/login'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: normalized, password }),
	});

	const payload = await response.json();

	if (!response.ok) {
		throw new Error(payload?.message || 'Login failed');
	}

	return parseAuthResponse(payload);
};

export const signupWithEmail = async ({ fullName, age, gender, email, password, confirmPassword }) => {
	const normalized = normalizeEmail(email);
	const validationMessage = validateSignupInput({
		fullName,
		age,
		gender,
		email: normalized,
		password,
		confirmPassword,
	});

	if (validationMessage) {
		throw new Error(validationMessage);
	}

	const response = await fetch(buildUrl('/api/auth/register'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			name: fullName.trim(),
			age: Number(age),
			gender: String(gender).trim(),
			email: normalized,
			password,
		}),
	});

	const payload = await response.json();

	if (!response.ok) {
		throw new Error(payload?.message || 'Signup failed');
	}

	return parseAuthResponse(payload);
};

export const fetchProfile = async ({ token }) => {
	if (!token) {
		throw new Error('Missing auth token');
	}

	const response = await fetch(buildUrl('/api/auth/profile'), {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const payload = await response.json();

	if (!response.ok) {
		throw new Error(payload?.message || 'Failed to fetch profile');
	}

	const user = payload?.user;
	return {
		id: user?._id || user?.id,
		name: user?.name,
		fullName: user?.name,
		email: user?.email,
		age: user?.age,
		gender: user?.gender,
		role: user?.role,
	};
};

export const updateProfile = async ({ token, updates }) => {
	if (!token) {
		throw new Error('Missing auth token');
	}

	const response = await fetch(buildUrl('/api/auth/profile'), {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(updates || {}),
	});

	const payload = await response.json();

	if (!response.ok) {
		throw new Error(payload?.message || 'Failed to update profile');
	}

	const user = payload?.user;
	return {
		id: user?._id || user?.id,
		name: user?.name,
		fullName: user?.name,
		email: user?.email,
		age: user?.age,
		gender: user?.gender,
		role: user?.role,
	};
};

