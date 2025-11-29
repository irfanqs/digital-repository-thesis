import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { User } from '../lib/context/AuthContext';

interface RoleGuardProps {
  user: User | null;
  allowedRoles: Array<'STUDENT' | 'LECTURER' | 'ADMIN'>;
  children: ReactNode;
  redirectTo?: string;
}

export function RoleGuard({ 
  user, 
  allowedRoles, 
  children, 
  redirectTo = '/' 
}: RoleGuardProps) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard if they don't have access
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
