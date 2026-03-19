// Este arquivo foi gerado por scripts/generate-api.ts. Nao edite manualmente.
import type {
  AuthGetMeResponse,
  AuthGetSessionResponse,
  AuthLoginBody,
  AuthLoginResponse,
  AuthLogoutResponse,
  AuthRefreshBody,
  AuthRefreshResponse,
  AuthRegisterBody,
  AuthRegisterResponse,
  AuthRequestPasswordResetBody,
  AuthRequestPasswordResetResponse,
  AuthResetPasswordBody,
  AuthResetPasswordResponse,
  AuthVerifyEmailBody,
  AuthVerifyEmailResponse,
} from './auth.types';

export type AuthApiContract = {
  getMe: {
    method: 'GET';
    route: '/auth/me';
    request: never;
    response: AuthGetMeResponse;
  };
  getSession: {
    method: 'GET';
    route: '/auth/session';
    request: never;
    response: AuthGetSessionResponse;
  };
  login: {
    method: 'POST';
    route: '/auth/login';
    request: {
      body: AuthLoginBody;
    };
    response: AuthLoginResponse;
  };
  logout: {
    method: 'POST';
    route: '/auth/logout';
    request: never;
    response: AuthLogoutResponse;
  };
  refresh: {
    method: 'POST';
    route: '/auth/refresh';
    request: {
      body: AuthRefreshBody;
    };
    response: AuthRefreshResponse;
  };
  register: {
    method: 'POST';
    route: '/auth/register';
    request: {
      body: AuthRegisterBody;
    };
    response: AuthRegisterResponse;
  };
  requestPasswordReset: {
    method: 'POST';
    route: '/auth/password/request-reset';
    request: {
      body: AuthRequestPasswordResetBody;
    };
    response: AuthRequestPasswordResetResponse;
  };
  resetPassword: {
    method: 'POST';
    route: '/auth/password/reset';
    request: {
      body: AuthResetPasswordBody;
    };
    response: AuthResetPasswordResponse;
  };
  verifyEmail: {
    method: 'POST';
    route: '/auth/verify-email';
    request: {
      body: AuthVerifyEmailBody;
    };
    response: AuthVerifyEmailResponse;
  };
};
