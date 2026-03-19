import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { API_NON_RETRYABLE_STATUSES } from '../support/api.constants';
import { isApiError } from '../support/api.error';
import { apiHandleGlobalError } from './api.events';

export const apiQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: (failureCount, error) => {
        if (isApiError(error)) {
          if (API_NON_RETRYABLE_STATUSES.includes(error.status)) return false;
          if (error.status === 408 || error.status === 429) return failureCount < 3;
        }
        return failureCount < 2;
      },
      retryDelay: (attempt, error) => {
        if (isApiError(error) && error.status === 429 && error.retryAfter) {
          return error.retryAfter * 1000;
        }
        return Math.min(1000 * 2 ** attempt, 30_000);
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.skipGlobalError) return;
      void apiHandleGlobalError(error, 'query');
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _v, _c, mutation) => {
      if (mutation.meta?.skipGlobalError) return;
      void apiHandleGlobalError(error, 'mutation');
    },
  }),
});
