import { Navigate, Outlet } from 'react-router-dom';
import { api } from '../lib/api';

export default function ProtectedRoute() {
  const isAuth = api.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
