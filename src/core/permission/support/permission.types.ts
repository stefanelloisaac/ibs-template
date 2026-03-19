import type { ReactNode } from 'react';

// --- domain ---

export type Permission = `${string}:${string}`;

export type PermissionRule = {
  action: string;
  subject: string;
};

// --- runtime ---

export type PermissionResourceState = {
  ownerKey: string | null;
  permissions: string[] | null;
  error: Error | null;
};

// --- context ---

export type PermissionContextState = {
  can: (action: string, subject: string) => boolean;
  cannot: (action: string, subject: string) => boolean;
};

// --- provider ---

export type PermissionProviderProps = {
  children: ReactNode;
};
