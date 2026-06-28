import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-center" style={{ height: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Check if user has required role
  const roles = allowedRoles || (requiredRole ? [requiredRole] : []);
  if (roles.length > 0 && !roles.includes(user.role)) {
    const roleMap = { admin: '/dashboard/admin', teacher: '/dashboard/teacher', student: '/dashboard/student' };
    return <Navigate to={roleMap[user.role] || '/login'} replace />;
  }

  return children; 
}
