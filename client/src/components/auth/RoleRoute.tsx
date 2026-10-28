import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getHomeRouteForRole, useAuth } from '../../hooks/use-auth';
import type { UserRole } from '../../types/api';

export interface RoleRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="font-mono text-xs text-[#9E9D97] animate-pulse">
          Đang xác thực phiên làm việc...
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (user.mustChangePassword && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getHomeRouteForRole(user.role)} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

