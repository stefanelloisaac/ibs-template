import type { ApiErrorBody, ApiErrorInit } from './api.types';

export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly body: ApiErrorBody | null;
  readonly url: string;
  readonly retryAfter?: number;

  constructor(options: ApiErrorInit) {
    const message = options.body?.message ?? `Request failed with status ${options.status}`;
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.statusText = options.statusText;
    this.body = options.body;
    this.url = options.url;
    this.retryAfter = options.retryAfter;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
