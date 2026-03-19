import type { SessionBootstrapResult } from '../support/session.types';
import { sessionCreateState, sessionIsUnauthorizedError } from '../support/session.utils';
import {
  SESSION_INITIAL_STATE,
  sessionGetState as sessionGetStoreState,
  sessionSetState,
  sessionSubscribe as sessionSubscribeStore,
} from './session.store';
import { apiQueryClient } from '@/core/api';

let sessionRequestId = 0;
let sessionBootstrapPromise: Promise<void> | null = null;
let sessionUnauthorizedPromise: Promise<void> | null = null;
let sessionBootstrapController: { fetchBootstrapData: () => Promise<SessionBootstrapResult> } | null = null;

export function sessionGetSnapshot() {
  return sessionGetStoreState();
}

export function sessionSubscribe(listener: () => void): () => void {
  return sessionSubscribeStore(listener);
}

export async function sessionEnsureHydrated(): Promise<void> {
  if (sessionGetStoreState().isHydrated) {
    return;
  }

  await sessionRunBootstrap(false);
}

export async function sessionRefresh(): Promise<void> {
  await sessionRunBootstrap(true);
}

export function sessionClear(): void {
  sessionRequestId += 1;
  sessionBootstrapPromise = null;
  apiQueryClient.clear();
  sessionSetState({
    status: 'anonymous',
    isHydrated: true,
    user: null,
    session: null,
    isAuthenticated: false,
  });
}

export async function sessionHandleUnauthorized(): Promise<void> {
  if (sessionUnauthorizedPromise) {
    await sessionUnauthorizedPromise;
    return;
  }

  sessionUnauthorizedPromise = Promise.resolve()
    .then(() => {
      sessionClear();
    })
    .finally(() => {
      sessionUnauthorizedPromise = null;
    });

  await sessionUnauthorizedPromise;
}

async function sessionRunBootstrap(force: boolean): Promise<void> {
  if (sessionBootstrapPromise && !force) {
    await sessionBootstrapPromise;
    return;
  }

  const controller = sessionBootstrapController;

  if (!controller) {
    return;
  }

  const requestId = ++sessionRequestId;
  sessionSetState(SESSION_INITIAL_STATE);

  sessionBootstrapPromise = (async () => {
    const result = await controller.fetchBootstrapData();

    if (requestId !== sessionRequestId) {
      return;
    }

    if (result.userError && !sessionIsUnauthorizedError(result.userError)) {
      console.error('[Session] Failed to load authenticated user.', result.userError);
    }

    if (result.sessionError && !sessionIsUnauthorizedError(result.sessionError)) {
      console.error('[Session] Failed to load session details.', result.sessionError);
    }

    if (sessionIsUnauthorizedError(result.userError) || sessionIsUnauthorizedError(result.sessionError)) {
      sessionSetState({
        status: 'anonymous',
        isHydrated: true,
        user: null,
        session: null,
        isAuthenticated: false,
      });
      return;
    }

    sessionSetState(sessionCreateState(result.user, result.session));
  })().finally(() => {
    if (requestId === sessionRequestId) {
      sessionBootstrapPromise = null;
    }
  });

  await sessionBootstrapPromise;
}

export function sessionSetBootstrapController(
  controller: { fetchBootstrapData: () => Promise<SessionBootstrapResult> } | null,
): void {
  sessionBootstrapController = controller;
}
