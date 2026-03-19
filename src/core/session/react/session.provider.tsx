import { useEffect, useMemo, useSyncExternalStore } from 'react';
import {
  sessionClear,
  sessionEnsureHydrated,
  sessionGetSnapshot,
  sessionRefresh,
  sessionSetBootstrapController,
  sessionSubscribe,
} from '../runtime/session.runtime';
import type { SessionBootstrapResult, SessionProviderProps } from '../support/session.types';
import { SessionContext } from './session.context';
import { useAuthGetMe, useAuthGetSession } from '@/generated/auth';

export function SessionProvider({ children }: SessionProviderProps) {
  const userQuery = useAuthGetMe({
    enabled: false,
    retry: false,
    meta: { skipGlobalError: true },
  });

  const sessionQuery = useAuthGetSession({
    enabled: false,
    retry: false,
    meta: { skipGlobalError: true },
  });

  const state = useSyncExternalStore(sessionSubscribe, sessionGetSnapshot, sessionGetSnapshot);

  useEffect(() => {
    sessionSetBootstrapController({
      fetchBootstrapData: async (): Promise<SessionBootstrapResult> => {
        const [userResult, sessionResult] = await Promise.all([userQuery.refetch(), sessionQuery.refetch()]);

        return {
          user: userResult.data?.data ?? null,
          session: sessionResult.data?.data ?? null,
          userError: userResult.error ?? null,
          sessionError: sessionResult.error ?? null,
        };
      },
    });

    return () => {
      sessionSetBootstrapController(null);
    };
  }, [sessionQuery, userQuery]);

  useEffect(() => {
    void sessionEnsureHydrated();
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      refreshSession: sessionRefresh,
      clearSession: sessionClear,
    }),
    [state],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
