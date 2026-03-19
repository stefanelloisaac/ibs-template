import type { SessionData, SessionState } from './session.types';
import { isApiError } from '@/core/api';
import type { UserResponseDto } from '@/generated/auth';

export function sessionCreateState(user: UserResponseDto | null, session: SessionData): SessionState {
  const status = user ? 'authenticated' : 'anonymous';

  return {
    status,
    isHydrated: true,
    user,
    session,
    isAuthenticated: status === 'authenticated',
  };
}

export function sessionIsUnauthorizedError(error: unknown): boolean {
  return isApiError(error) && error.status === 401;
}
