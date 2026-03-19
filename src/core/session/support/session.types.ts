import type { ReactNode } from 'react';
import type { AuthGetSessionData, UserResponseDto } from '@/generated/auth';

// --- domain ---

export type SessionStatus = 'loading' | 'authenticated' | 'anonymous';

export type SessionPayload = AuthGetSessionData;
export type SessionData = SessionPayload | null;

// --- runtime ---

export type SessionState = {
  status: SessionStatus;
  isHydrated: boolean;
  user: UserResponseDto | null;
  session: SessionData;
  isAuthenticated: boolean;
};

export type SessionBootstrapResult = {
  user: UserResponseDto | null;
  session: SessionData;
  userError: unknown | null;
  sessionError: unknown | null;
};

// --- context ---

export type SessionContextState = SessionState & {
  refreshSession: () => Promise<void>;
  clearSession: () => void;
};

// --- provider ---

export type SessionProviderProps = {
  children: ReactNode;
};
