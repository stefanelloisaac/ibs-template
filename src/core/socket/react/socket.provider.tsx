import { useEffect, useMemo, useSyncExternalStore } from 'react';
import {
  socketConnect,
  socketDestroy,
  socketDisconnect,
  socketGetClient,
  socketGetSnapshot,
  socketSetAuthProvider,
  socketSubscribe,
} from '../runtime/socket.runtime';
import type { SocketProviderProps } from '../support/socket.types';
import { socketCreateAuthProvider } from '../support/socket.utils';
import { SocketContext } from './socket.context';
import { useSession } from '@/core/session';

export function SocketProvider({ children, auth }: SocketProviderProps) {
  const { isAuthenticated, isHydrated, session } = useSession();
  const runtimeState = useSyncExternalStore(socketSubscribe, socketGetSnapshot, socketGetSnapshot);
  const socket = useMemo(() => socketGetClient(), []);
  const authProvider = useMemo(() => socketCreateAuthProvider(session, auth), [auth, session]);

  useEffect(() => {
    socketSetAuthProvider(authProvider);
  }, [authProvider]);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) {
      socketDisconnect();
      return;
    }

    socketConnect();
  }, [isAuthenticated, isHydrated]);

  useEffect(() => {
    return () => {
      socketDestroy();
    };
  }, []);

  const status = !isHydrated || !isAuthenticated ? 'disconnected' : runtimeState.status;
  const value = useMemo(
    () => ({
      socket,
      status,
      connect: socketConnect,
      disconnect: socketDisconnect,
    }),
    [socket, status],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
