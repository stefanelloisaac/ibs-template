import type { ReactNode } from 'react';

// --- domain ---

export interface ThemeConfig {
  primary: string;
  primaryForeground: string;
  fontFamily?: string;
  fontUrl?: string;
  radius?: string;
}

// --- context ---

export type ThemeMode = 'dark' | 'light';

export interface ThemeContextState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

// --- provider ---

export type ThemeProviderProps = {
  children: ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
};
