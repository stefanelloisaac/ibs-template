import type { RouteObject } from 'react-router';
import type { AppRouteHandle } from '@/app/routing/route.types';

export const authRoutes: { public: RouteObject[]; protected: RouteObject[] } = {
  public: [
    {
      path: 'login',
      handle: { meta: { title: 'Login' } } satisfies AppRouteHandle,
      lazy: async () => {
        const { default: Component } = await import('./pages/login.page');
        return { Component };
      },
    },
    {
      path: 'register',
      handle: { meta: { title: 'Cadastro' } } satisfies AppRouteHandle,
      lazy: async () => {
        const { default: Component } = await import('./pages/register.page');
        return { Component };
      },
    },
  ],
  protected: [
    {
      index: true,
      handle: { meta: { title: 'Auth Debug' } } satisfies AppRouteHandle,
      lazy: async () => {
        const { default: Component } = await import('./pages/auth-debug.page');
        return { Component };
      },
    },
    {
      path: 'auth/debug',
      handle: { meta: { title: 'Auth Debug' } } satisfies AppRouteHandle,
      lazy: async () => {
        const { default: Component } = await import('./pages/auth-debug.page');
        return { Component };
      },
    },
  ],
};
