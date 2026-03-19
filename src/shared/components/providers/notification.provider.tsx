import { createContext, useContext, useLayoutEffect, useState } from 'react';
import { useStore } from 'zustand';
import {
  createNotificationStore,
  type NotificationStoreApi,
  type NotificationStoreState,
} from '../store/notification/notification.store';

/**
 * @provider NotificationProvider
 * @description Cria e gerencia o store Zustand de notificacoes internamente.
 * Diferente dos providers de tabela/form (que recebem o store pronto), este provider
 * cria o store e sincroniza as props de configuracao via `useLayoutEffect`.
 *
 * O sistema consumidor envolve a aplicacao com este provider e usa os hooks
 * `useNotification` para ler notificacoes e `useNotificationStoreApi` para despachar acoes.
 *
 * @param maxNotifications - Limite maximo de notificacoes armazenadas (padrao: 100)
 * @param onNotify - Callback chamado quando uma nova notificacao e adicionada
 */

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  onNotify?: (notification: NotificationStoreState['notifications'][number]) => void;
}

const NotificationContext = createContext<NotificationStoreApi | null>(null);

export function NotificationProvider({ children, maxNotifications = 100, onNotify }: NotificationProviderProps) {
  const [store] = useState(() => createNotificationStore({ config: { maxNotifications, onNotify } }));

  useLayoutEffect(() => {
    store.getState()._sync({ maxNotifications, onNotify });
  });

  return <NotificationContext.Provider value={store}>{children}</NotificationContext.Provider>;
}

export function useNotificationStoreApi(): NotificationStoreApi {
  const store = useContext(NotificationContext);
  if (!store) throw new Error('Notification: must be used within <NotificationProvider>');
  return store;
}

export function useNotification<T>(selector: (state: NotificationStoreState) => T): T {
  const store = useNotificationStoreApi();
  return useStore(store, selector);
}
