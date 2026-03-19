import type { SessionStatus } from '@/core/session';

export type AppNavigationVisibility = 'always' | 'authenticated' | 'anonymous';

export type AppNavigationItem = {
  to: string;
  label: string;
  visibility: AppNavigationVisibility;
};

export type AppNavigationState = {
  isHydrated: boolean;
  status: SessionStatus;
};
