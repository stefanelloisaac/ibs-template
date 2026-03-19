// Este arquivo foi gerado por scripts/generate-api.ts. Nao edite manualmente.
import type { GeneratedApiResponse } from '../support/generated-response';
// Escopo: auth
export type LoginDto = {
  email: string;
  password: string;
};

export type PasswordResetDto = {
  token: string;
  newPassword: string;
};

export type PasswordResetRequestDto = {
  email: string;
};

export type RefreshTokenDto = {
  refreshToken: string;
};

export type RegisterDto = {
  name: string;
  email: string;
  password: string;
};

export type UserResponseDto = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type VerifyEmailDto = {
  token: string;
};
export type AuthGetMeResponse = GeneratedApiResponse<UserResponseDto, never>;
export type AuthGetMeData = AuthGetMeResponse['data'];

export type AuthGetSessionResponse = GeneratedApiResponse<Record<string, unknown> | null, never>;
export type AuthGetSessionData = AuthGetSessionResponse['data'];

export type AuthLoginBody = LoginDto;
export type AuthLoginResponse = GeneratedApiResponse<Record<string, unknown> | null, never>;
export type AuthLoginData = AuthLoginResponse['data'];

export type AuthLogoutResponse = GeneratedApiResponse<Record<string, unknown> | null, never>;
export type AuthLogoutData = AuthLogoutResponse['data'];

export type AuthRefreshBody = RefreshTokenDto;
export type AuthRefreshResponse = GeneratedApiResponse<Record<string, unknown> | null, never>;
export type AuthRefreshData = AuthRefreshResponse['data'];

export type AuthRegisterBody = RegisterDto;
export type AuthRegisterResponse = GeneratedApiResponse<UserResponseDto, never>;
export type AuthRegisterData = AuthRegisterResponse['data'];

export type AuthRequestPasswordResetBody = PasswordResetRequestDto;
export type AuthRequestPasswordResetResponse = GeneratedApiResponse<Record<string, unknown> | null, never>;
export type AuthRequestPasswordResetData = AuthRequestPasswordResetResponse['data'];

export type AuthResetPasswordBody = PasswordResetDto;
export type AuthResetPasswordResponse = GeneratedApiResponse<Record<string, unknown> | null, never>;
export type AuthResetPasswordData = AuthResetPasswordResponse['data'];

export type AuthVerifyEmailBody = VerifyEmailDto;
export type AuthVerifyEmailResponse = GeneratedApiResponse<UserResponseDto, never>;
export type AuthVerifyEmailData = AuthVerifyEmailResponse['data'];
