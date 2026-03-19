// Este arquivo foi gerado por scripts/generate-api.ts. Nao edite manualmente.
export const authKeys = {
  all: ['auth'] as const,
  getMe: () => [...authKeys.all, 'getMe'] as const,
  getSession: () => [...authKeys.all, 'getSession'] as const,
};
