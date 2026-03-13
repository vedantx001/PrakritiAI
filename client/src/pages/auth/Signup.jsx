import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import AuthLayout from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/useAuth';

const Signup = () => {
	const { signup, authLoading, isAuthenticated, isInitializing } = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState('');

	const handleSignup = async ({ fullName, age, gender, email, password, confirmPassword }) => {
		setError('');
		try {
			await signup({ fullName, age, gender, email, password, confirmPassword });
			navigate('/auth/login', {
				replace: true,
				state: {
					prefill: {
						email,
						password,
					},
				},
			});
		} catch (signupError) {
			setError(signupError.message);
		}
	};

	if (isInitializing) {
		return null;
	}

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return (
		<AuthLayout title="Create Your Account" subtitle="Start your holistic health journey with PrakritiAI.">
			<AuthForm mode="signup" onSubmit={handleSignup} loading={authLoading} serverError={error} />

			<div className="text-center">
				<p className="text-[var(--text-muted)]">
					Already have an account?{' '}
					<Link to="/auth/login" replace className="font-bold text-emerald-600 hover:text-emerald-800 transition-colors">
						Log in
					</Link>
				</p>
			</div>
		</AuthLayout>
	);
};

export default Signup;

