import { createContext } from 'react';
import type { SocketProviderState } from '../support/socket.types';

export const SocketContext = createContext<SocketProviderState | null>(null);
