import type { SocketErrorInit } from './socket.types';

export class SocketError extends Error {
  readonly type: string;
  readonly description: string | undefined;
  readonly context: Record<string, unknown>;

  constructor(options: SocketErrorInit) {
    super(options.message);
    this.name = 'SocketError';
    this.type = options.type;
    this.description = options.description;
    this.context = options.context ?? {};
  }
}

export function isSocketError(error: unknown): error is SocketError {
  return error instanceof SocketError;
}
