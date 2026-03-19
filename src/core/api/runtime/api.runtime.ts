import type { ApiRequestInit } from '../support/api.types';
import { apiRequest as apiRequestClient } from './api.client';
import {
  apiHandleGlobalError as apiHandleGlobalErrorRuntime,
  apiSubscribeToInfraEvents as apiSubscribeToInfraEventsRuntime,
} from './api.events';
import { apiQueryClient as apiQueryClientRuntime } from './api.query-client';

export const apiQueryClient = apiQueryClientRuntime;

export function apiRequest<TResponse>(input: string, init?: ApiRequestInit): Promise<TResponse> {
  return apiRequestClient<TResponse>(input, init);
}

export function apiSubscribeToInfraEvents(
  listener: Parameters<typeof apiSubscribeToInfraEventsRuntime>[0],
): () => void {
  return apiSubscribeToInfraEventsRuntime(listener);
}

export async function apiHandleGlobalError(
  error: Parameters<typeof apiHandleGlobalErrorRuntime>[0],
  context?: Parameters<typeof apiHandleGlobalErrorRuntime>[1],
): Promise<void> {
  await apiHandleGlobalErrorRuntime(error, context);
}
