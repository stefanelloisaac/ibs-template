import { createStore } from 'zustand';
import type { ToastInternalItem } from '../../src/toast/_core/toast.types';
import type { ToastStoreInit, ToastStoreState } from './toast.types';

export type { ToastStoreInit, ToastStoreState } from './toast.types';

/**
 * @store createToastStore
 * @description Fabrica do store Zustand de toasts. Gerencia uma lista de toasts com
 * auto-dismiss por timer (padrao 5s, configuravel por toast, `duration: 0` desabilita).
 * Timers sao mantidos em um Map local (fora do Zustand) e limpos via `_cleanup` ao desmontar.
 * `dismiss` marca como `_closing` para animacao de saida (150ms) antes de remover.
 *
 * @param init - { config: { position?, maxToasts? } }
 * @returns Store Zustand com lista de toasts e actions (toast, dismiss, dismissAll)
 */

// MARK: StoreApi
export type ToastStoreApi = ReturnType<typeof createToastStore>;

// MARK: Factory
const EXIT_ANIMATION_MS = 150;

export function createToastStore(init: ToastStoreInit) {
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  const store = createStore<ToastStoreState>()((set, get) => {
    const dismiss = (id: string) => {
      set((prev) => ({
        toasts: prev.toasts.map((t) => (t.id === id ? { ...t, _closing: true } : t)),
      }));

      setTimeout(() => {
        set((prev) => ({
          toasts: prev.toasts.filter((t) => t.id !== id),
        }));
        const timer = timers.get(id);
        if (timer) clearTimeout(timer);
        timers.delete(id);
      }, EXIT_ANIMATION_MS);
    };

    return {
      _counter: 0,
      _config: init.config,

      toasts: [],
      position: init.config.position ?? 'top-right',

      toast: (options) => {
        const s = get();
        const id = `toast-${s._counter + 1}`;
        const duration = options.duration ?? 5000;
        const maxToasts = s._config.maxToasts ?? 5;
        const newToast: ToastInternalItem = { ...options, id };

        set((prev) => ({
          _counter: prev._counter + 1,
          toasts: [...prev.toasts, newToast].slice(-maxToasts),
        }));

        if (duration > 0) {
          const timer = setTimeout(() => dismiss(id), duration);
          timers.set(id, timer);
        }

        return id;
      },

      dismiss,

      dismissAll: () => {
        timers.forEach((timer) => clearTimeout(timer));
        timers.clear();
        set({ toasts: [] });
      },

      _sync: (config) => {
        set({ _config: config, position: config.position ?? 'top-right' });
      },

      _cleanup: () => {
        timers.forEach((timer) => clearTimeout(timer));
        timers.clear();
      },
    };
  });

  return store;
}
