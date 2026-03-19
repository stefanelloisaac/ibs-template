import { createStore } from 'zustand';
import type { NotificationInternalItem, NotificationStoreInit, NotificationStoreState } from './notification.types';

export type { NotificationStoreInit, NotificationStoreState } from './notification.types';

/**
 * @store createNotificationStore
 * @description Fabrica do store Zustand de notificacoes. Gerencia uma lista de notificacoes
 * com contagem de nao-lidas, animacao de saida (150ms de delay antes de remover),
 * e limite maximo configuravel. Notificacoes novas sao inseridas no topo da lista.
 *
 * @param init - { config: { maxNotifications?, onNotify? } }
 * @returns Store Zustand com lista de notificacoes e actions (notify, dismiss, markAsRead, etc.)
 */

// MARK: StoreApi
export type NotificationStoreApi = ReturnType<typeof createNotificationStore>;

// MARK: Factory
const EXIT_ANIMATION_MS = 150;

export function createNotificationStore(init: NotificationStoreInit) {
  const store = createStore<NotificationStoreState>()((set, get) => {
    const computeUnreadCount = (notifications: NotificationInternalItem[]) =>
      notifications.filter((n) => !n.read && !n._closing).length;

    return {
      _counter: 0,
      _config: init.config,

      notifications: [],
      unreadCount: 0,

      notify: (options) => {
        const s = get();
        const id = `notification-${s._counter + 1}`;
        const maxNotifications = s._config.maxNotifications ?? 100;
        const newItem: NotificationInternalItem = {
          ...options,
          id,
          read: false,
          timestamp: new Date(),
        };

        set((prev) => {
          const next = [newItem, ...prev.notifications].slice(0, maxNotifications);
          return {
            _counter: prev._counter + 1,
            notifications: next,
            unreadCount: computeUnreadCount(next),
          };
        });

        s._config.onNotify?.(newItem);
        return id;
      },

      markAsRead: (id) => {
        set((prev) => {
          const next = prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
          return { notifications: next, unreadCount: computeUnreadCount(next) };
        });
      },

      markAllAsRead: () => {
        set((prev) => ({
          notifications: prev.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      dismiss: (id) => {
        set((prev) => {
          const next = prev.notifications.map((n) => (n.id === id ? { ...n, _closing: true } : n));
          return { notifications: next, unreadCount: computeUnreadCount(next) };
        });

        setTimeout(() => {
          set((prev) => {
            const next = prev.notifications.filter((n) => n.id !== id);
            return { notifications: next, unreadCount: computeUnreadCount(next) };
          });
        }, EXIT_ANIMATION_MS);
      },

      dismissAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      _sync: (config) => {
        set({ _config: config });
      },
    };
  });

  return store;
}
