import { Navigate, Outlet, useLocation } from 'react-router';
import { useSession } from '@/core/session';

export function AuthGuard() {
  const location = useLocation();
  const { status, isHydrated } = useSession();

  if (!isHydrated || status === 'loading') {
    return null;
  }

  if (status === 'anonymous') {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;

    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  return <Outlet />;
}

export function PublicOnlyGuard() {
  const { status, isHydrated } = useSession();

  if (!isHydrated || status === 'loading') {
    return null;
  }

  if (status === 'authenticated') {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}
