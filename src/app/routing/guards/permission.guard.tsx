import { useMemo } from 'react';
import { Navigate, Outlet, useMatches } from 'react-router';
import type { AppRouteHandle } from '../route.types';
import { usePermission } from '@/core/permission';

export function PermissionGuard() {
  const { cannot } = usePermission();
  const matches = useMatches();

  const denied = useMemo(() => {
    return matches.some((match) => {
      const handle = match.handle as AppRouteHandle | undefined;
      const permission = handle?.permission;

      if (!permission) {
        return false;
      }

      return cannot(permission.action, permission.subject);
    });
  }, [matches, cannot]);

  if (denied) {
    return <Navigate to='/403' replace />;
  }

  return <Outlet />;
}
