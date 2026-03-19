/**
 * @store ToastStoreState
 * @description Tipos do store de toasts. Config define posicao e maximo de toasts visiveis.
 * Estado contem a lista de toasts ativos, posicao, e actions para despachar/dispensar.
 * `_cleanup` limpa todos os timers ao desmontar o provider.
 */

import type { ToastInternalItem, ToastOptions, ToastPosition } from '../../src/toast/_core/toast.types';

// MARK: Config
export type ToastConfig = {
  position?: ToastPosition;
  maxToasts?: number;
};

// MARK: Init
export type ToastStoreInit = {
  config: ToastConfig;
};

// MARK: Store State
export type ToastStoreState = {
  _counter: number;
  _config: ToastConfig;
  toasts: ToastInternalItem[];
  position: ToastPosition;
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  _sync: (config: ToastConfig) => void;
  _cleanup: () => void;
};
