import type { VariantProps } from 'tailwind-variants';
import type { NotificationInternalItem } from '../../../../store/notification/notification.types';
import type { notificationItemVariants } from './notification-item.variants';

export type NotificationItemBaseProps = React.ComponentProps<'div'> &
  VariantProps<typeof notificationItemVariants> & {
    notification: NotificationInternalItem;
    onMarkAsRead: (id: string) => void;
    onDismiss: (id: string) => void;
  };
