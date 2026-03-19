/**
 * @store NotificationStoreState
 * @description Tipos do store de notificacoes. `NotificationItem` e a forma publica
 * de uma notificacao. `NotificationInternalItem` adiciona `_closing` para animacao de saida.
 * O estado contem a lista, contagem de nao-lidas, e actions para despachar/dispensar/ler.
 */

export type NotificationIntent = 'success' | 'error' | 'warning' | 'info';

export type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  intent: NotificationIntent;
  read: boolean;
  timestamp: Date;
  category?: string;
  action?: { label: string; onClick: () => void };
};

export type NotificationInternalItem = NotificationItem & {
  _closing?: boolean;
};

// MARK: Config
export type NotificationConfig = {
  maxNotifications?: number;
  onNotify?: (notification: NotificationItem) => void;
};

// MARK: Init
export type NotificationStoreInit = {
  config: NotificationConfig;
};

// MARK: Store State
export type NotificationStoreState = {
  _counter: number;
  _config: NotificationConfig;
  notifications: NotificationInternalItem[];
  unreadCount: number;
  notify: (options: Omit<NotificationItem, 'id' | 'read' | 'timestamp'>) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  _sync: (config: NotificationConfig) => void;
};
