// Este arquivo foi gerado por scripts/generate-api.ts. Nao edite manualmente.
import { mutationOptions, useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { login, logout, refresh, register, requestPasswordReset, resetPassword, verifyEmail } from './auth.api';
import type { AuthApiContract } from './auth.contract';
import type { ApiError } from '@/core/api';

type MutationInput<T> = [T] extends [never] ? void : T;

/**
 * Fazer login
 *
 * Autentica o usuário e retorna refresh token. A sessão é criada automaticamente.
 */
type AuthLoginMutationOptions = Omit<
  UseMutationOptions<
    AuthApiContract['login']['response'],
    ApiError,
    MutationInput<AuthApiContract['login']['request']>,
    unknown
  >,
  'mutationKey' | 'mutationFn'
>;

function loginMutation() {
  return mutationOptions<
    AuthApiContract['login']['response'],
    ApiError,
    MutationInput<AuthApiContract['login']['request']>,
    unknown
  >({
    mutationKey: ['auth', 'login'],
    mutationFn: async (input: AuthApiContract['login']['request']) => login(input),
  });
}

export function useAuthLogin(options?: AuthLoginMutationOptions) {
  return useMutation({
    ...loginMutation(),
    ...options,
  });
}

/**
 * Fazer logout
 *
 * Destrói a sessão e revoga o refresh token
 */
type AuthLogoutMutationOptions = Omit<
  UseMutationOptions<AuthApiContract['logout']['response'], ApiError, MutationInput<never>, unknown>,
  'mutationKey' | 'mutationFn'
>;

function logoutMutation() {
  return mutationOptions<AuthApiContract['logout']['response'], ApiError, MutationInput<never>, unknown>({
    mutationKey: ['auth', 'logout'],
    mutationFn: async () => logout(),
  });
}

export function useAuthLogout(options?: AuthLogoutMutationOptions) {
  return useMutation({
    ...logoutMutation(),
    ...options,
  });
}

/**
 * Renovar token de acesso
 *
 * Gera um novo refresh token usando o token atual
 */
type AuthRefreshMutationOptions = Omit<
  UseMutationOptions<
    AuthApiContract['refresh']['response'],
    ApiError,
    MutationInput<AuthApiContract['refresh']['request']>,
    unknown
  >,
  'mutationKey' | 'mutationFn'
>;

function refreshMutation() {
  return mutationOptions<
    AuthApiContract['refresh']['response'],
    ApiError,
    MutationInput<AuthApiContract['refresh']['request']>,
    unknown
  >({
    mutationKey: ['auth', 'refresh'],
    mutationFn: async (input: AuthApiContract['refresh']['request']) => refresh(input),
  });
}

export function useAuthRefresh(options?: AuthRefreshMutationOptions) {
  return useMutation({
    ...refreshMutation(),
    ...options,
  });
}

/**
 * Registrar novo usuário
 *
 * Cria uma nova conta de usuário no sistema
 */
type AuthRegisterMutationOptions = Omit<
  UseMutationOptions<
    AuthApiContract['register']['response'],
    ApiError,
    MutationInput<AuthApiContract['register']['request']>,
    unknown
  >,
  'mutationKey' | 'mutationFn'
>;

function registerMutation() {
  return mutationOptions<
    AuthApiContract['register']['response'],
    ApiError,
    MutationInput<AuthApiContract['register']['request']>,
    unknown
  >({
    mutationKey: ['auth', 'register'],
    mutationFn: async (input: AuthApiContract['register']['request']) => register(input),
  });
}

export function useAuthRegister(options?: AuthRegisterMutationOptions) {
  return useMutation({
    ...registerMutation(),
    ...options,
  });
}

/**
 * Solicitar reset de senha
 *
 * Envia um email com token para reset de senha
 */
type AuthRequestPasswordResetMutationOptions = Omit<
  UseMutationOptions<
    AuthApiContract['requestPasswordReset']['response'],
    ApiError,
    MutationInput<AuthApiContract['requestPasswordReset']['request']>,
    unknown
  >,
  'mutationKey' | 'mutationFn'
>;

function requestPasswordResetMutation() {
  return mutationOptions<
    AuthApiContract['requestPasswordReset']['response'],
    ApiError,
    MutationInput<AuthApiContract['requestPasswordReset']['request']>,
    unknown
  >({
    mutationKey: ['auth', 'requestPasswordReset'],
    mutationFn: async (input: AuthApiContract['requestPasswordReset']['request']) => requestPasswordReset(input),
  });
}

export function useAuthRequestPasswordReset(options?: AuthRequestPasswordResetMutationOptions) {
  return useMutation({
    ...requestPasswordResetMutation(),
    ...options,
  });
}

/**
 * Resetar senha
 *
 * Reseta a senha usando o token recebido por email
 */
type AuthResetPasswordMutationOptions = Omit<
  UseMutationOptions<
    AuthApiContract['resetPassword']['response'],
    ApiError,
    MutationInput<AuthApiContract['resetPassword']['request']>,
    unknown
  >,
  'mutationKey' | 'mutationFn'
>;

function resetPasswordMutation() {
  return mutationOptions<
    AuthApiContract['resetPassword']['response'],
    ApiError,
    MutationInput<AuthApiContract['resetPassword']['request']>,
    unknown
  >({
    mutationKey: ['auth', 'resetPassword'],
    mutationFn: async (input: AuthApiContract['resetPassword']['request']) => resetPassword(input),
  });
}

export function useAuthResetPassword(options?: AuthResetPasswordMutationOptions) {
  return useMutation({
    ...resetPasswordMutation(),
    ...options,
  });
}

/**
 * Verificar email
 *
 * Verifica o email usando o token recebido por email
 */
type AuthVerifyEmailMutationOptions = Omit<
  UseMutationOptions<
    AuthApiContract['verifyEmail']['response'],
    ApiError,
    MutationInput<AuthApiContract['verifyEmail']['request']>,
    unknown
  >,
  'mutationKey' | 'mutationFn'
>;

function verifyEmailMutation() {
  return mutationOptions<
    AuthApiContract['verifyEmail']['response'],
    ApiError,
    MutationInput<AuthApiContract['verifyEmail']['request']>,
    unknown
  >({
    mutationKey: ['auth', 'verifyEmail'],
    mutationFn: async (input: AuthApiContract['verifyEmail']['request']) => verifyEmail(input),
  });
}

export function useAuthVerifyEmail(options?: AuthVerifyEmailMutationOptions) {
  return useMutation({
    ...verifyEmailMutation(),
    ...options,
  });
}
