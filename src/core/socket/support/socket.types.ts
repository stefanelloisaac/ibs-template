import type { ReactNode } from 'react';
import type { Socket } from 'socket.io-client';

// --- domain ---

export interface ServerToClientEvents {
  [event: string]: (...args: never[]) => void;
}

export interface ClientToServerEvents {
  [event: string]: (...args: never[]) => void;
}

export type SocketInstance = Socket<ServerToClientEvents, ClientToServerEvents>;

export type SocketAuth = {
  token: string;
};

// --- runtime ---

export type SocketConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'reconnecting';

export type SocketRuntimeState = {
  status: SocketConnectionStatus;
};

export type SocketInfraEvent = {
  type: 'unauthorized';
  source: 'socket';
};

// --- context ---

export type SocketProviderState = {
  socket: SocketInstance | null;
  status: SocketConnectionStatus;
  connect: (auth?: () => SocketAuth | null) => void;
  disconnect: () => void;
};

// --- provider ---

export type SocketProviderProps = {
  children: ReactNode;
  auth?: () => SocketAuth | null;
};

// --- errors ---

export type SocketErrorInit = {
  type: string;
  message: string;
  description?: string;
  context?: Record<string, unknown>;
};
