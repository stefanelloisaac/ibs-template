import { useContext, useEffect, useRef } from 'react';
import type { SocketConnectionStatus, SocketProviderState } from '../support/socket.types';
import { SocketContext } from './socket.context';

export function useSocket(): SocketProviderState {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return context;
}

export function useSocketStatus(): SocketConnectionStatus {
  const { status } = useSocket();
  return status;
}

export function useSocketEvent<TData = unknown>(event: string, handler: (data: TData) => void): void {
  const { socket } = useSocket();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!socket) return;

    const listener = (...args: never[]) => {
      handlerRef.current(args[0] as TData);
    };

    socket.on(event, listener);

    return () => {
      socket.off(event, listener);
    };
  }, [socket, event]);
}
