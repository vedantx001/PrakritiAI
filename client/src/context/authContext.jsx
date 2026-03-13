import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchProfile, loginWithEmail, signupWithEmail } from '../services/authService';
import { clearAuthSession, getAuthSession, saveAuthSession } from '../utils/auth';
import { AuthContext } from './authContextInstance';

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState('');
	const [authLoading, setAuthLoading] = useState(false);
	const [isInitializing, setIsInitializing] = useState(true);

	useEffect(() => {
		const session = getAuthSession();

		if (session?.user && session?.token) {
			setUser(session.user);
			setToken(session.token);
		}

		setIsInitializing(false);
	}, []);

	const setSession = useCallback((session) => {
		setUser(session.user);
		setToken(session.token);
		saveAuthSession(session);
	}, []);

	const refreshProfile = useCallback(async () => {
		if (!token) {
			return null;
		}

		const freshUser = await fetchProfile({ token });
		setUser(freshUser);
		saveAuthSession({ token, user: freshUser });
		return freshUser;
	}, [token]);

	useEffect(() => {
		if (!token) {
			return;
		}

		// Pull latest user details (age/gender/role) from DB.
		refreshProfile().catch(() => {
			// If token is invalid/expired, leave session as-is; route guards (if any) can handle logout.
		});
	}, [token, refreshProfile]);

	const login = useCallback(async ({ email, password }) => {
		setAuthLoading(true);
		try {
			const session = await loginWithEmail({ email, password });
			setSession(session);
			// Ensure we have full profile details after login (age/gender/role).
			try {
				const freshUser = await fetchProfile({ token: session.token });
				setUser(freshUser);
				saveAuthSession({ token: session.token, user: freshUser });
				return freshUser;
			} catch {
				return session.user;
			}
		} finally {
			setAuthLoading(false);
		}
	}, [setSession]);

	const signup = useCallback(async ({ fullName, age, gender, email, password, confirmPassword }) => {
		setAuthLoading(true);
		try {
			const result = await signupWithEmail({ fullName, age, gender, email, password, confirmPassword });
			return result.user;
		} finally {
			setAuthLoading(false);
		}
	}, []);

	const logout = useCallback(() => {
		setUser(null);
		setToken('');
		clearAuthSession();
	}, []);

	const value = useMemo(() => ({
		user,
		token,
		isAuthenticated: Boolean(user && token),
		authLoading,
		isInitializing,
		login,
		signup,
		logout,
		refreshProfile,
	}), [user, token, authLoading, isInitializing, login, signup, logout, refreshProfile]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

