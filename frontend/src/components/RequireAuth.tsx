import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RequireAuthProps {
  role?: 'Teacher' | 'Student';
}

export default function RequireAuth({ role }: RequireAuthProps) {
  const { token, role: userRole } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (role && role !== userRole) return <Navigate to="/login" replace />;

  return <Outlet />;
}
