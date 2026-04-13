import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '@/store/adminAuthStore';

export function RequireAdminAuth({ children }: { children: ReactNode }) {
  const ok = useAdminAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  if (!ok) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
