import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const isAdminRole = (role) => String(role || '').toLowerCase() === 'admin';

/**
 * Route guard for auth + role protection.
 *
 * - role="admin": only admins can access
 * - role="user": any authenticated non-admin user can access
 */
const ProtectedRoute = ({ children, role = 'user' }) => {
	const location = useLocation();
	const { isInitializing, isAuthenticated, user } = useAuth();

	if (isInitializing) {
		return null;
	}

	if (!isAuthenticated) {
		return <Navigate to="/auth/login" replace state={{ from: location }} />;
	}

	const admin = isAdminRole(user?.role);

	if (role === 'admin' && !admin) {
		return <Navigate to="/dashboard/user" replace />;
	}

	if (role === 'user' && admin) {
		return <Navigate to="/dashboard/admin" replace />;
	}

	return children;
};

export default ProtectedRoute;
