import type { SocketAuth, SocketRuntimeState } from '../support/socket.types';
import {
  socketConnect as socketConnectClient,
  socketDestroyClient,
  socketDisconnect as socketDisconnectClient,
  socketGetClient as socketGetClientInternal,
  socketSetAuthProvider as socketSetAuthProviderClient,
} from './socket.client';
import {
  socketGetState as socketGetStoreState,
  socketSetState,
  socketSubscribe as socketSubscribeStore,
} from './socket.store';

export function socketGetSnapshot(): SocketRuntimeState {
  return socketGetStoreState();
}

export function socketSubscribe(listener: () => void): () => void {
  return socketSubscribeStore(listener);
}

export function socketGetClient() {
  return socketGetClientInternal();
}

export function socketSetAuthProvider(provider: () => SocketAuth | null): void {
  socketSetAuthProviderClient(provider);
}

export function socketConnect(authOverride?: () => SocketAuth | null): void {
  if (authOverride) {
    socketSetAuthProviderClient(authOverride);
  }

  if (socketGetClientInternal().connected) {
    socketSetState({ status: 'connected' });
    return;
  }

  socketSetState({ status: 'connecting' });
  socketConnectClient();
}

export function socketDisconnect(): void {
  socketDisconnectClient();
  socketSetState({ status: 'disconnected' });
}

export function socketDestroy(): void {
  socketDestroyClient();
  socketSetState({ status: 'disconnected' });
}
