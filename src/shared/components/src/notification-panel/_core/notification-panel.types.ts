import type { VariantProps } from 'tailwind-variants';
import type { NotificationInternalItem } from '../../../store/notification/notification.types';
import type { notificationPanelVariants } from './notification-panel.variants';

export type NotificationPanelBaseProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof notificationPanelVariants>;

export type NotificationGroup = {
  label: string;
  items: NotificationInternalItem[];
};
