import type { SessionBootstrapResult } from '../support/session.types';
import { getMe, getSession } from '@/generated/auth';

export async function sessionFetchBootstrapData(): Promise<SessionBootstrapResult> {
  const [userResult, sessionResult] = await Promise.allSettled([getMe(), getSession()]);

  return {
    user: userResult.status === 'fulfilled' ? (userResult.value ?? null) : null,
    session: sessionResult.status === 'fulfilled' ? (sessionResult.value ?? null) : null,
    userError: userResult.status === 'rejected' ? userResult.reason : null,
    sessionError: sessionResult.status === 'rejected' ? sessionResult.reason : null,
  };
}
