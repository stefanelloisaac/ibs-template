import type { SocketAuth } from './socket.types';
import type { SessionData } from '@/core/session';

export function socketCreateAuthProvider(
  session: SessionData,
  authOverride?: () => SocketAuth | null,
): () => SocketAuth | null {
  if (authOverride) {
    return authOverride;
  }

  return () => {
    const websocket =
      session && typeof session === 'object'
        ? (session as { websocket?: { token?: string | null } | null }).websocket
        : null;
    const token = websocket?.token ?? null;

    return token ? { token } : null;
  };
}
