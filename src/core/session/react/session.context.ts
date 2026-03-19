import { createContext } from 'react';
import type { SessionContextState } from '../support/session.types';

export const SessionContext = createContext<SessionContextState | null>(null);
