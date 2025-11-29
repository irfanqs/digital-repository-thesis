import { Routes, Route, Navigate } from 'react-router-dom';
import { User } from '../lib/context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';

// Pages
import LoginPage from '../auth/LoginPage';
import AdminDashboard from '../admin/AdminDashboard';
import StudentDashboard from '../student/StudentDashboard';
import LecturerDashboard from '../lecturer/LecturerDashboard';

interface AppRoutesProps {
  user: User | null;
  loading: boolean;
}

export function AppRoutes({ user, loading }: AppRoutesProps) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Root - redirect based on role */}
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute user={user} loading={loading}>
            <RoleGuard user={user} allowedRoles={['ADMIN']}>
              <AdminDashboard me={user!} />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/account"
        element={
          <ProtectedRoute user={user} loading={loading}>
            <RoleGuard user={user} allowedRoles={['ADMIN']}>
              <div style={{ padding: '2rem' }}>
                <h1>Admin Account Settings</h1>
                <p>Account management page - Coming soon</p>
              </div>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute user={user} loading={loading}>
            <RoleGuard user={user} allowedRoles={['STUDENT']}>
              <StudentDashboard me={user!} />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/account"
        element={
          <ProtectedRoute user={user} loading={loading}>
            <RoleGuard user={user} allowedRoles={['STUDENT']}>
              <div style={{ padding: '2rem' }}>
                <h1>Student Account Settings</h1>
                <p>Account management page - Coming soon</p>
              </div>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Lecturer Routes */}
      <Route
        path="/lecturer/dashboard"
        element={
          <ProtectedRoute user={user} loading={loading}>
            <RoleGuard user={user} allowedRoles={['LECTURER']}>
              <LecturerDashboard me={user!} />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lecturer/account"
        element={
          <ProtectedRoute user={user} loading={loading}>
            <RoleGuard user={user} allowedRoles={['LECTURER']}>
              <div style={{ padding: '2rem' }}>
                <h1>Lecturer Account Settings</h1>
                <p>Account management page - Coming soon</p>
              </div>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Public Pages (accessible to all) */}
      <Route 
        path="/home" 
        element={
          <div style={{ padding: '2rem' }}>
            <h1>Welcome to Digital Repository System</h1>
            <p>Home page - Coming soon</p>
          </div>
        } 
      />
      <Route 
        path="/browse" 
        element={
          <div style={{ padding: '2rem' }}>
            <h1>Browse Theses</h1>
            <p>Public thesis repository - Coming soon</p>
          </div>
        } 
      />
      <Route 
        path="/help" 
        element={
          <div style={{ padding: '2rem' }}>
            <h1>Help & Documentation</h1>
            <p>Help page - Coming soon</p>
          </div>
        } 
      />

      {/* 404 - Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
