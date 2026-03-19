import { io } from 'socket.io-client';
import { socketResolveBaseUrl } from '../support/socket.config';
import { SOCKET_AUTH_ERROR_TYPE } from '../support/socket.constants';
import { SocketError } from '../support/socket.error';
import type { SocketAuth, SocketInstance } from '../support/socket.types';
import { socketHandleGlobalError } from './socket.events';
import { socketSetState } from './socket.store';

let socketInstance: SocketInstance | null = null;
let authProvider: (() => SocketAuth | null) | null = null;

export function socketSetAuthProvider(provider: () => SocketAuth | null): void {
  authProvider = provider;
}

export function socketGetClient(): SocketInstance {
  if (!socketInstance) {
    socketInstance = io(socketResolveBaseUrl(), {
      autoConnect: false,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 30_000,
      timeout: 20_000,
      auth: (cb) => {
        const credentials = authProvider?.();
        cb(credentials ?? {});
      },
    });

    socketInstance.on('connect_error', (error) => {
      socketSetState({ status: 'disconnected' });

      const isAuthError = error.message === SOCKET_AUTH_ERROR_TYPE;

      const socketError = new SocketError({
        type: isAuthError ? SOCKET_AUTH_ERROR_TYPE : 'connection_error',
        message: `Connection failed: ${error.message}`,
        description: error.message,
      });

      void socketHandleGlobalError(socketError);
    });
    socketInstance.on('connect', () => {
      socketSetState({ status: 'connected' });
    });
    socketInstance.on('disconnect', () => {
      socketSetState({ status: 'disconnected' });
    });
    socketInstance.io.on('reconnect_attempt', () => {
      socketSetState({ status: 'reconnecting' });
    });
    socketInstance.io.on('reconnect', () => {
      socketSetState({ status: 'connected' });
    });
  }

  return socketInstance;
}

export function socketConnect(): void {
  const socket = socketGetClient();

  if (!socket.connected) {
    socket.connect();
  }
}

export function socketDisconnect(): void {
  if (socketInstance?.connected) {
    socketInstance.disconnect();
  }
}

export function socketDestroyClient(): void {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.io.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }
}
