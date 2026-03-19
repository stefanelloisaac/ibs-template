import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useStore } from 'zustand';
import { ToastContainer } from '../src/toast/_parts/container/toast-container';
import { createToastStore, type ToastStoreApi } from '../store/toast/toast.store';
import type { ToastStoreState } from '../store/toast/toast.types';

/**
 * @provider ToastProvider
 * @description Cria o store Zustand de toasts e renderiza o `<ToastContainer />` automaticamente.
 * O sistema consumidor envolve a aplicacao com este provider e usa `useToast(s => s.toast)`
 * para disparar notificacoes temporarias. Timers de auto-dismiss sao limpos ao desmontar.
 *
 * @param position - Posicao dos toasts na tela (padrao: 'top-right')
 * @param maxToasts - Maximo de toasts visiveis simultaneamente (padrao: 5)
 */

interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastStoreState['position'];
  maxToasts?: number;
}

const ToastContext = createContext<ToastStoreApi | null>(null);

export function ToastProvider({ children, position = 'top-right', maxToasts = 5 }: ToastProviderProps) {
  const [store] = useState(() => createToastStore({ config: { position, maxToasts } }));

  useLayoutEffect(() => {
    store.getState()._sync({ position, maxToasts });
  });

  useEffect(() => {
    return () => store.getState()._cleanup();
  }, [store]);

  return (
    <ToastContext.Provider value={store}>
      {children}
      <ToastContainerBridge />
    </ToastContext.Provider>
  );
}

function ToastContainerBridge() {
  const toasts = useToast((s) => s.toasts);
  const pos = useToast((s) => s.position);
  const dismiss = useToast((s) => s.dismiss);
  return <ToastContainer position={pos} toasts={toasts} onDismiss={dismiss} />;
}

export function useToastStoreApi(): ToastStoreApi {
  const store = useContext(ToastContext);
  if (!store) throw new Error('Toast: must be used within <ToastProvider>');
  return store;
}

export function useToast<T>(selector: (state: ToastStoreState) => T): T {
  const store = useToastStoreApi();
  return useStore(store, selector);
}
