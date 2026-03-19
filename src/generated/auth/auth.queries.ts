// Este arquivo foi gerado por scripts/generate-api.ts. Nao edite manualmente.
import { queryOptions, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getMe, getSession } from './auth.api';
import type { AuthApiContract } from './auth.contract';
import { authKeys } from './auth.keys';
import type { ApiError } from '@/core/api';

/**
 * Obter usuário autenticado
 *
 * Retorna os dados do usuário atualmente autenticado
 */
type AuthGetMeQueryOptions = Omit<
  UseQueryOptions<
    AuthApiContract['getMe']['response'],
    ApiError,
    AuthApiContract['getMe']['response'],
    ReturnType<typeof authKeys.getMe>
  >,
  'queryKey' | 'queryFn' | 'select'
>;

function getMeQuery(): UseQueryOptions<
  AuthApiContract['getMe']['response'],
  ApiError,
  AuthApiContract['getMe']['response'],
  ReturnType<typeof authKeys.getMe>
> {
  return queryOptions<
    AuthApiContract['getMe']['response'],
    ApiError,
    AuthApiContract['getMe']['response'],
    ReturnType<typeof authKeys.getMe>
  >({
    queryKey: authKeys.getMe(),
    queryFn: () => getMe(),
  });
}

export function useAuthGetMe(options?: AuthGetMeQueryOptions) {
  return useQuery({
    ...getMeQuery(),
    ...options,
  });
}

/**
 * Verificar sessão
 *
 * Verifica se há uma sessão ativa e retorna a configuração recomendada para conexão WebSocket
 */
type AuthGetSessionQueryOptions = Omit<
  UseQueryOptions<
    AuthApiContract['getSession']['response'],
    ApiError,
    AuthApiContract['getSession']['response'],
    ReturnType<typeof authKeys.getSession>
  >,
  'queryKey' | 'queryFn' | 'select'
>;

function getSessionQuery(): UseQueryOptions<
  AuthApiContract['getSession']['response'],
  ApiError,
  AuthApiContract['getSession']['response'],
  ReturnType<typeof authKeys.getSession>
> {
  return queryOptions<
    AuthApiContract['getSession']['response'],
    ApiError,
    AuthApiContract['getSession']['response'],
    ReturnType<typeof authKeys.getSession>
  >({
    queryKey: authKeys.getSession(),
    queryFn: () => getSession(),
  });
}

export function useAuthGetSession(options?: AuthGetSessionQueryOptions) {
  return useQuery({
    ...getSessionQuery(),
    ...options,
  });
}
