import { createBrowserRouter } from 'react-router';
import RootLayout from './root.layout';
import { AuthGuard, PublicOnlyGuard } from './routing/guards/auth.guard';
import { PermissionGuard } from './routing/guards/permission.guard';
import ErrorPage from './routing/pages/error.page';
import ForbiddenPage from './routing/pages/forbidden.page';
import NotFoundPage from './routing/pages/not-found.page';
import type { AppRouteHandle } from './routing/route.types';
import { authRoutes } from '@/modules/auth';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    HydrateFallback: () => null,
    children: [
      {
        Component: PublicOnlyGuard,
        children: authRoutes.public,
      },
      {
        Component: AuthGuard,
        children: [
          {
            Component: PermissionGuard,
            children: authRoutes.protected,
          },
        ],
      },
      {
        path: '403',
        Component: ForbiddenPage,
        handle: { meta: { title: 'Acesso negado' } } satisfies AppRouteHandle,
      },
      {
        path: '404',
        Component: NotFoundPage,
        handle: { meta: { title: 'Página não encontrada' } } satisfies AppRouteHandle,
      },
      {
        path: '*',
        Component: NotFoundPage,
        handle: { meta: { title: 'Página não encontrada' } } satisfies AppRouteHandle,
      },
    ],
  },
]);
