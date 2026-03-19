import type { ReactNode } from 'react';

// --- domain ---

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

// --- provider ---

export interface ErrorProviderProps {
  children: ReactNode;
}
