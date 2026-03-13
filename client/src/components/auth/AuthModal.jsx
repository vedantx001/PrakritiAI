import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import AuthForm from './AuthForm';
import { useAuth } from '../../context/useAuth';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', onAuthenticated }) => {
	const { login, signup, authLoading, isAuthenticated } = useAuth();
	const [mode, setMode] = useState(initialMode);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!isOpen) return;
		setMode(initialMode);
		setError('');
	}, [isOpen, initialMode]);

	useEffect(() => {
		if (!isOpen) return;
		if (!isAuthenticated) return;
		onAuthenticated?.();
	}, [isOpen, isAuthenticated, onAuthenticated]);

	const title = useMemo(() => {
		if (mode === 'signup') return 'Create an account to continue';
		return 'Log in to continue';
	}, [mode]);

	const subtitle = useMemo(() => {
		return 'You must be logged in to interact (like, save, comment, or vote).';
	}, []);

	const handleLogin = async ({ email, password }) => {
		setError('');
		try {
			await login({ email, password });
			onAuthenticated?.();
		} catch (loginError) {
			setError(loginError?.message || 'Login failed');
		}
	};

	const handleSignup = async ({ fullName, age, gender, email, password, confirmPassword }) => {
		setError('');
		try {
			await signup({ fullName, age, gender, email, password, confirmPassword });
			// Auto-login so the user can immediately like/save.
			await login({ email, password });
			onAuthenticated?.();
		} catch (signupError) {
			setError(signupError?.message || 'Signup failed');
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/35 backdrop-blur-sm">
			<div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

			<div className="relative w-full max-w-md min-h-[640px] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-xl flex flex-col">
				<button
					type="button"
					onClick={onClose}
					className="absolute top-3 right-3 rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-main)]"
					aria-label="Close"
				>
					<X size={18} />
				</button>

				<div className="space-y-1">
					<h2 className="text-xl font-bold text-[var(--text-main)]">{title}</h2>
					<p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
				</div>

				<div className="mt-5 flex-1">
					<AuthForm
						mode={mode}
						onSubmit={mode === 'signup' ? handleSignup : handleLogin}
						loading={authLoading}
						serverError={error}
					/>
				</div>

				<div className="pt-5 text-center">
					{mode === 'login' ? (
						<p className="text-[var(--text-muted)]">
							Don&apos;t have an account?{' '}
							<button
								type="button"
								onClick={() => setMode('signup')}
								className="font-bold text-[var(--text-brand)] hover:opacity-90 transition-opacity"
							>
								Sign up
							</button>
						</p>
					) : (
						<p className="text-[var(--text-muted)]">
							Already have an account?{' '}
							<button
								type="button"
								onClick={() => setMode('login')}
								className="font-bold text-[var(--text-brand)] hover:opacity-90 transition-opacity"
							>
								Log in
							</button>
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default AuthModal;
