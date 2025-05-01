import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    // No token = not logged in
    return <Navigate to="/" replace />;
  }


  // Otherwise allow access
  return children;
}

export default ProtectedRoute;
