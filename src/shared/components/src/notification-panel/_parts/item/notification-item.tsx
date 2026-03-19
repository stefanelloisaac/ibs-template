import { IconClose } from '../../../icon';
import { getIntentIcon } from '../../_core/notification-panel.registry';
import { notificationPanelUtils } from '../../_core/notification-panel.utils';
import type { NotificationItemBaseProps } from './notification-item.types';
import { notificationItemVariants } from './notification-item.variants';

export function NotificationItem(props: NotificationItemBaseProps) {
  const { notification, onMarkAsRead, onDismiss, className, ...rest } = props;

  const styles = notificationItemVariants({ intent: notification.intent, read: notification.read });

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    notification.action?.onClick();
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss(notification.id);
  };

  return (
    <div
      data-slot='notification-item'
      data-closing={notification._closing ? '' : undefined}
      className={styles.root({ className })}
      onClick={handleClick}
      {...rest}
    >
      <div className={styles.titleRow()}>
        <span className={styles.icon()}>{getIntentIcon(notification.intent)}</span>
        <p className={styles.title()}>{notification.title}</p>
        <span className={styles.timestamp()}>{notificationPanelUtils.formatTime(notification.timestamp)}</span>
        <button
          type='button'
          className={styles.dismissButton()}
          onClick={handleDismiss}
          aria-label='Dispensar notificação'
        >
          <IconClose className='size-3' />
        </button>
      </div>
      {notification.description && <p className={styles.description()}>{notification.description}</p>}
      {notification.action && (
        <span
          className='text-xs text-primary hover:underline cursor-pointer pl-6 inline-block'
          onClick={handleActionClick}
        >
          {notification.action.label}
        </span>
      )}
    </div>
  );
}
