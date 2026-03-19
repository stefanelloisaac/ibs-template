import type { AppNavigationItem, AppNavigationState } from './navigation.types';

export const appNavigationItems: AppNavigationItem[] = [
  {
    to: '/',
    label: 'Home',
    visibility: 'authenticated',
  },
  {
    to: '/login',
    label: 'Login',
    visibility: 'anonymous',
  },
];

export function resolveAppNavigationItems(items: AppNavigationItem[], state: AppNavigationState): AppNavigationItem[] {
  if (!state.isHydrated || state.status === 'loading') {
    return items.filter((item) => item.visibility === 'always');
  }

  return items.filter((item) => {
    switch (item.visibility) {
      case 'always':
        return true;
      case 'authenticated':
        return state.status === 'authenticated';
      case 'anonymous':
        return state.status === 'anonymous';
    }
  });
}
