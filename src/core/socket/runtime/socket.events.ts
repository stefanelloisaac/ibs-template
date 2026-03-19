import { SOCKET_AUTH_ERROR_TYPE } from '../support/socket.constants';
import { isSocketError } from '../support/socket.error';
import type { SocketInfraEvent } from '../support/socket.types';
import { sessionHandleUnauthorized } from '@/core/session';

const socketInfraListeners = new Set<(event: SocketInfraEvent) => void>();

export function socketSubscribeToInfraEvents(listener: (event: SocketInfraEvent) => void): () => void {
  socketInfraListeners.add(listener);

  return () => {
    socketInfraListeners.delete(listener);
  };
}

function socketEmitInfraEvent(event: SocketInfraEvent): void {
  for (const listener of socketInfraListeners) {
    listener(event);
  }
}

export async function socketHandleGlobalError(error: Error) {
  if (isSocketError(error) && error.type === SOCKET_AUTH_ERROR_TYPE) {
    await sessionHandleUnauthorized();
    socketEmitInfraEvent({ type: 'unauthorized', source: 'socket' });
    return;
  }

  console.error(`[Socket] ${isSocketError(error) ? error.message : 'Unexpected error'}`);
}
