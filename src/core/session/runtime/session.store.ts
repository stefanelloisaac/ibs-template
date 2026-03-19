import type { SessionState } from '../support/session.types';

export const SESSION_INITIAL_STATE: SessionState = {
  status: 'loading',
  isHydrated: false,
  user: null,
  session: null,
  isAuthenticated: false,
};

let sessionState: SessionState = SESSION_INITIAL_STATE;
const sessionListeners = new Set<() => void>();

export function sessionGetState(): SessionState {
  return sessionState;
}

export function sessionSetState(nextState: SessionState): void {
  sessionState = nextState;

  for (const listener of sessionListeners) {
    listener();
  }
}

export function sessionSubscribe(listener: () => void): () => void {
  sessionListeners.add(listener);

  return () => {
    sessionListeners.delete(listener);
  };
}
