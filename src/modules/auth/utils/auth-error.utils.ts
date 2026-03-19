import { isApiError } from '@/core/api';

export function authGetErrorMessage(error: unknown): string | null {
  if (isApiError(error)) {
    return error.body?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return null;
}
