import type { SocketRuntimeState } from '../support/socket.types';

const SOCKET_INITIAL_STATE: SocketRuntimeState = {
  status: 'disconnected',
};

let socketRuntimeState: SocketRuntimeState = SOCKET_INITIAL_STATE;
const socketRuntimeListeners = new Set<() => void>();

export function socketGetState(): SocketRuntimeState {
  return socketRuntimeState;
}

export function socketSetState(nextState: SocketRuntimeState): void {
  socketRuntimeState = nextState;

  for (const listener of socketRuntimeListeners) {
    listener();
  }
}

export function socketSubscribe(listener: () => void): () => void {
  socketRuntimeListeners.add(listener);

  return () => {
    socketRuntimeListeners.delete(listener);
  };
}
