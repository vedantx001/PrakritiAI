const AUTH_STORAGE_KEY = 'prakritiai_auth';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getAuthStorage = () => {
	if (typeof window === 'undefined') {
		return null;
	}

	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
};

const clearLegacyLocalStorage = () => {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		window.localStorage.removeItem(AUTH_STORAGE_KEY);
	} catch {
		// Ignore storage access issues (e.g. blocked in private mode)
	}
};

export const saveAuthSession = (session) => {
	const storage = getAuthStorage();
	if (!storage) {
		return;
	}

	storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
	// Ensure auth does not leak across tabs from previous versions.
	clearLegacyLocalStorage();
};

export const getAuthSession = () => {
	const storage = getAuthStorage();
	// Always clear legacy localStorage so opening a new tab starts fresh.
	clearLegacyLocalStorage();

	if (!storage) {
		return null;
	}

	const raw = storage.getItem(AUTH_STORAGE_KEY);

	if (!raw) {
		return null;
	}

	try {
		return JSON.parse(raw);
	} catch {
		try {
			storage.removeItem(AUTH_STORAGE_KEY);
		} catch {
			// ignore
		}
		return null;
	}
};

export const clearAuthSession = () => {
	const storage = getAuthStorage();
	try {
		storage?.removeItem(AUTH_STORAGE_KEY);
	} finally {
		clearLegacyLocalStorage();
	}
};

export const normalizeEmail = (email) => email.trim().toLowerCase();

export const validateLoginInput = ({ email, password }) => {
	if (!EMAIL_REGEX.test(email)) {
		return 'Please enter a valid email address.';
	}

	if (!password || password.length < 6) {
		return 'Password must be at least 6 characters.';
	}

	return '';
};

export const validateSignupInput = ({ fullName, age, gender, email, password, confirmPassword }) => {
	if (!fullName.trim()) {
		return 'Full name is required.';
	}

	const parsedAge = Number(age);
	if (!Number.isFinite(parsedAge) || parsedAge < 0 || parsedAge > 150) {
		return 'Please enter a valid age.';
	}

	const normalizedGender = String(gender ?? '').trim().toLowerCase();
	if (!normalizedGender) {
		return 'Gender is required.';
	}
	if (!['male', 'female'].includes(normalizedGender)) {
		return 'Gender must be Male or Female.';
	}

	if (!EMAIL_REGEX.test(email)) {
		return 'Please enter a valid email address.';
	}

	if (!password || password.length < 8) {
		return 'Password must be at least 8 characters.';
	}

	if (password !== confirmPassword) {
		return 'Passwords do not match.';
	}

	return '';
};

export const buildMockToken = (email) => {
	const payload = `${normalizeEmail(email)}:${Date.now()}`;
	return btoa(payload);
};

