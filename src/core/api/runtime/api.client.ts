import axios from 'axios';
import { apiResolveBaseUrl } from '../support/api.config';
import { ApiError } from '../support/api.error';
import type { ApiRequestInit } from '../support/api.types';

export const apiClient = axios.create({
  baseURL: apiResolveBaseUrl(),
  timeout: 30_000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const retryAfter =
          error.response.status === 429 ? Number(error.response.headers['retry-after']) || undefined : undefined;

        throw new ApiError({
          status: error.response.status,
          statusText: error.response.statusText,
          url: error.config?.url ?? '',
          body: error.response.data ?? null,
          retryAfter,
        });
      }

      if (error.code === 'ECONNABORTED') {
        throw new ApiError({
          status: 408,
          statusText: 'Request Timeout',
          url: error.config?.url ?? '',
          body: { message: 'A requisição expirou.' },
        });
      }

      throw new ApiError({
        status: 0,
        statusText: 'Network Error',
        url: error.config?.url ?? '',
        body: { message: 'Erro de conexão. Verifique sua internet.' },
      });
    }

    throw error;
  },
);

export async function apiRequest<TResponse>(input: string, init?: ApiRequestInit): Promise<TResponse> {
  const response = await apiClient.request<TResponse>({
    url: input,
    method: init?.method ?? 'GET',
    data: init?.body,
    headers: init?.headers,
    signal: init?.signal,
    timeout: init?.timeout,
  });

  return response.data;
}
