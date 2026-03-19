import { useId, useMemo } from 'react';
import { ErrorBoundary } from '../../../lib/error-boundary';
import {
  useNotificationDismiss,
  useNotificationDismissAll,
  useNotificationItems,
  useNotificationMarkAllAsRead,
  useNotificationMarkAsRead,
  useNotificationUnreadCount,
} from '../../../store/notification/use-notification';
import { NotificationGroup } from '../_parts/group/notification-group';
import { NotificationItem } from '../_parts/item/notification-item';
import type { NotificationPanelBaseProps } from './notification-panel.types';
import { notificationPanelUtils } from './notification-panel.utils';
import { notificationPanelVariants } from './notification-panel.variants';

export function NotificationPanel(props: NotificationPanelBaseProps) {
  const { className, id, ref, ...rest } = props;

  const generatedId = useId();
  const panelId = id || generatedId;
  const notifications = useNotificationItems();
  const unreadCount = useNotificationUnreadCount();
  const markAsRead = useNotificationMarkAsRead();
  const markAllAsRead = useNotificationMarkAllAsRead();
  const dismiss = useNotificationDismiss();
  const dismissAll = useNotificationDismissAll();
  const styles = notificationPanelVariants();

  const groups = useMemo(() => notificationPanelUtils.groupByDate(notifications), [notifications]);

  const hasActions = unreadCount > 0 || notifications.length > 0;

  return (
    <ErrorBoundary>
      <div ref={ref} id={panelId} data-slot='notification-panel' className={styles.root({ className })} {...rest}>
        <div className={styles.header()}>
          <span className={styles.headerTitle()}>Notificações</span>
          {hasActions && (
            <div className={styles.headerActions()}>
              {unreadCount > 0 && (
                <button
                  type='button'
                  className={styles.headerButton({ className: 'text-primary' })}
                  onClick={markAllAsRead}
                >
                  Marcar todas como lidas
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type='button'
                  className={styles.headerButton({ className: 'text-muted-foreground' })}
                  onClick={dismissAll}
                >
                  Limpar
                </button>
              )}
            </div>
          )}
        </div>
        <div className={styles.scrollArea()}>
          {notifications.length === 0 ? (
            <div className={styles.emptyState()}>Nenhuma notificação encontrada.</div>
          ) : (
            groups.map((group) => (
              <NotificationGroup key={group.label} label={group.label}>
                {group.items.map((n) => (
                  <NotificationItem key={n.id} notification={n} onMarkAsRead={markAsRead} onDismiss={dismiss} />
                ))}
              </NotificationGroup>
            ))
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
