import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import AuthLayout from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/useAuth';

const Login = () => {
  const { login, authLoading, isAuthenticated, isInitializing, user } = useAuth();
  const location = useLocation();
  const [error, setError] = useState('');
  const prefill = location.state?.prefill ?? {};
  const redirectTo = location.state?.from?.pathname;

  const handleLogin = async ({ email, password }) => {
    setError('');
    try {
      await login({ email, password });
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  if (isInitializing) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo || (user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user')} replace />;
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Enter your credentials to continue your wellness journey.">
      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        loading={authLoading}
        serverError={error}
        initialValues={prefill}
      />

      <div className="text-center">
        <p className="text-[var(--text-muted)]">
          Don&apos;t have an account?{' '}
          <Link to="/auth/signup" replace className="font-bold text-emerald-600 hover:text-emerald-800 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;