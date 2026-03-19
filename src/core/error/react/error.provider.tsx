import type { ErrorProviderProps } from '../support/error.types';
import { ErrorBoundary } from './error.boundary';
import { CriticalErrorPage } from './error.page';

export function ErrorProvider({ children }: ErrorProviderProps) {
  const fallback = <CriticalErrorPage />;

  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}
