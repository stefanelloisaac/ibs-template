import { useId } from 'react';
import { useNotificationUnreadCount } from '../../../../store/notification/use-notification';
import type { NotificationTriggerBaseProps } from './notification-trigger.types';
import { notificationTriggerVariants } from './notification-trigger.variants';

export function NotificationTrigger(props: NotificationTriggerBaseProps) {
  const { showBadge = true, maxCount = 99, className, children, id, ref, ...rest } = props;

  const generatedId = useId();
  const triggerId = id || generatedId;
  const unreadCount = useNotificationUnreadCount();
  const styles = notificationTriggerVariants();

  const displayCount = unreadCount > maxCount ? `${maxCount}+` : String(unreadCount);

  return (
    <button
      ref={ref}
      id={triggerId}
      type='button'
      data-slot='notification-trigger'
      className={styles.root({ className })}
      aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
      {...rest}
    >
      {children}
      {showBadge && unreadCount > 0 && <span className={styles.badge()}>{displayCount}</span>}
    </button>
  );
}
