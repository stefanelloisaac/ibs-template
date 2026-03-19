import { useState } from 'react';
import { useNavigate } from 'react-router';
import { authGetErrorMessage } from '../utils/auth-error.utils';
import { useSession } from '@/core/session';
import { useAuthLogout } from '@/generated/auth';

export default function AuthDebugPage() {
  const navigate = useNavigate();
  const { status, isAuthenticated, isHydrated, user, session, refreshSession, clearSession } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const logoutMutation = useAuthLogout({
    meta: { skipGlobalError: true },
  });

  async function handleRefresh() {
    setIsRefreshing(true);

    try {
      await refreshSession();
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
      clearSession();
      navigate('/login', { replace: true });
    } catch {
      // The mutation state already exposes the API error for the UI.
    }
  }

  const logoutError = authGetErrorMessage(logoutMutation.error);
  const providerValue = {
    status,
    isHydrated,
    user,
    session,
    isAuthenticated,
  };

  return (
    <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
      <div className='rounded-lg border p-6 shadow-sm'>
        <h1 className='text-2xl font-semibold'>Auth Debug</h1>
        <p className='mt-2 text-sm text-muted-foreground'>Tela minima para validar o estado atual da sessao.</p>
      </div>

      <div className='rounded-lg border p-6 shadow-sm'>
        <div className='flex flex-wrap gap-3'>
          <button
            type='button'
            onClick={handleRefresh}
            disabled={isRefreshing}
            className='rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70'
          >
            {isRefreshing ? 'Atualizando...' : 'Refetch'}
          </button>

          <button
            type='button'
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70'
          >
            {logoutMutation.isPending ? 'Saindo...' : 'Logout'}
          </button>
        </div>

        {logoutError && <p className='mt-4 text-sm text-red-600'>{logoutError}</p>}
      </div>

      <section className='rounded-lg border p-6 shadow-sm'>
        <h2 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>Session Provider Value</h2>
        <pre className='mt-4 overflow-auto rounded-md bg-muted p-4 text-xs'>
          {JSON.stringify(providerValue, null, 2) ?? 'null'}
        </pre>
      </section>
    </div>
  );
}
