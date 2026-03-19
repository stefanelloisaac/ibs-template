import type { ErrorInfo, ReactNode } from 'react';

export type ErrorBoundaryProps = {
  children: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
};

export type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};
