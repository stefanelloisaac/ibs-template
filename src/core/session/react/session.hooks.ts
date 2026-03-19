import { useContext } from 'react';
import type { SessionContextState } from '../support/session.types';
import { SessionContext } from './session.context';

export function useSession(): SessionContextState {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
}
