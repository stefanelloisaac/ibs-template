/**
 * @hook useNotification*
 * @description Hooks pre-construidos para consumir slices do store de notificacoes.
 * O sistema consumidor usa `useNotificationNotify()` para criar notificacoes
 * e `useNotificationItems()` para listar. Cada hook seleciona exatamente um slice.
 *
 * @usage NotificationPanel, NotificationTrigger, sistema consumidor
 */

import { useNotification } from '../../providers/notification.provider';

export const useNotificationItems = () => useNotification((s) => s.notifications);
export const useNotificationUnreadCount = () => useNotification((s) => s.unreadCount);
export const useNotificationNotify = () => useNotification((s) => s.notify);
export const useNotificationMarkAsRead = () => useNotification((s) => s.markAsRead);
export const useNotificationMarkAllAsRead = () => useNotification((s) => s.markAllAsRead);
export const useNotificationDismiss = () => useNotification((s) => s.dismiss);
export const useNotificationDismissAll = () => useNotification((s) => s.dismissAll);
