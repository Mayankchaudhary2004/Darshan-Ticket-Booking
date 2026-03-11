import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner-darshan"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return (
      <div className="container py-5 text-center fade-in">
        <div style={{ fontSize: '5rem' }}>🚫</div>
        <h2 className="mt-3" style={{ fontFamily: 'Poppins' }}>Access Denied</h2>
        <p className="text-muted">You don't have permission to view this page.</p>
        <a href="/" className="btn-darshan" style={{ textDecoration: 'none' }}>Go Home</a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
