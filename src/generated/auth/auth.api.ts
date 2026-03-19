// Este arquivo foi gerado por scripts/generate-api.ts. Nao edite manualmente.
import type { AuthApiContract } from './auth.contract';
import { apiBuildUrl, apiRequest } from '@/core/api';

/**
 * Obter usuário autenticado
 *
 * Retorna os dados do usuário atualmente autenticado
 */
export async function getMe(): Promise<AuthApiContract['getMe']['response']> {
  const response = await apiRequest<AuthApiContract['getMe']['response']>(apiBuildUrl('/auth/me'), {
    method: 'GET',
  });
  return response;
}

/**
 * Verificar sessão
 *
 * Verifica se há uma sessão ativa e retorna a configuração recomendada para conexão WebSocket
 */
export async function getSession(): Promise<AuthApiContract['getSession']['response']> {
  const response = await apiRequest<AuthApiContract['getSession']['response']>(apiBuildUrl('/auth/session'), {
    method: 'GET',
  });
  return response;
}

/**
 * Fazer login
 *
 * Autentica o usuário e retorna refresh token. A sessão é criada automaticamente.
 */
export async function login(input: AuthApiContract['login']['request']): Promise<AuthApiContract['login']['response']> {
  const response = await apiRequest<AuthApiContract['login']['response']>(apiBuildUrl('/auth/login'), {
    method: 'POST',
    body: input.body,
  });
  return response;
}

/**
 * Fazer logout
 *
 * Destrói a sessão e revoga o refresh token
 */
export async function logout(): Promise<AuthApiContract['logout']['response']> {
  const response = await apiRequest<AuthApiContract['logout']['response']>(apiBuildUrl('/auth/logout'), {
    method: 'POST',
  });
  return response;
}

/**
 * Renovar token de acesso
 *
 * Gera um novo refresh token usando o token atual
 */
export async function refresh(
  input: AuthApiContract['refresh']['request'],
): Promise<AuthApiContract['refresh']['response']> {
  const response = await apiRequest<AuthApiContract['refresh']['response']>(apiBuildUrl('/auth/refresh'), {
    method: 'POST',
    body: input.body,
  });
  return response;
}

/**
 * Registrar novo usuário
 *
 * Cria uma nova conta de usuário no sistema
 */
export async function register(
  input: AuthApiContract['register']['request'],
): Promise<AuthApiContract['register']['response']> {
  const response = await apiRequest<AuthApiContract['register']['response']>(apiBuildUrl('/auth/register'), {
    method: 'POST',
    body: input.body,
  });
  return response;
}

/**
 * Solicitar reset de senha
 *
 * Envia um email com token para reset de senha
 */
export async function requestPasswordReset(
  input: AuthApiContract['requestPasswordReset']['request'],
): Promise<AuthApiContract['requestPasswordReset']['response']> {
  const response = await apiRequest<AuthApiContract['requestPasswordReset']['response']>(
    apiBuildUrl('/auth/password/request-reset'),
    {
      method: 'POST',
      body: input.body,
    },
  );
  return response;
}

/**
 * Resetar senha
 *
 * Reseta a senha usando o token recebido por email
 */
export async function resetPassword(
  input: AuthApiContract['resetPassword']['request'],
): Promise<AuthApiContract['resetPassword']['response']> {
  const response = await apiRequest<AuthApiContract['resetPassword']['response']>(apiBuildUrl('/auth/password/reset'), {
    method: 'POST',
    body: input.body,
  });
  return response;
}

/**
 * Verificar email
 *
 * Verifica o email usando o token recebido por email
 */
export async function verifyEmail(
  input: AuthApiContract['verifyEmail']['request'],
): Promise<AuthApiContract['verifyEmail']['response']> {
  const response = await apiRequest<AuthApiContract['verifyEmail']['response']>(apiBuildUrl('/auth/verify-email'), {
    method: 'POST',
    body: input.body,
  });
  return response;
}
