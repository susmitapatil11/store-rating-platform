import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAddUser from './pages/AdminAddUser';
import AdminUserDetail from './pages/AdminUserDetail';
import AdminStores from './pages/AdminStores';
import AdminAddStore from './pages/AdminAddStore';
import UserStores from './pages/UserStores';
import OwnerDashboard from './pages/OwnerDashboard';

import './styles/theme.css';
import './styles/app.css';

const ROLE_HOME = { ADMIN: '/admin', USER: '/stores', OWNER: '/owner' };

function RoleHome() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RoleHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/change-password" element={
            <ProtectedRoute><ChangePassword /></ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>
          } />
          <Route path="/admin/users/new" element={
            <ProtectedRoute roles={['ADMIN']}><AdminAddUser /></ProtectedRoute>
          } />
          <Route path="/admin/users/:id" element={
            <ProtectedRoute roles={['ADMIN']}><AdminUserDetail /></ProtectedRoute>
          } />
          <Route path="/admin/stores" element={
            <ProtectedRoute roles={['ADMIN']}><AdminStores /></ProtectedRoute>
          } />
          <Route path="/admin/stores/new" element={
            <ProtectedRoute roles={['ADMIN']}><AdminAddStore /></ProtectedRoute>
          } />

          <Route path="/stores" element={
            <ProtectedRoute roles={['USER']}><UserStores /></ProtectedRoute>
          } />

          <Route path="/owner" element={
            <ProtectedRoute roles={['OWNER']}><OwnerDashboard /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
