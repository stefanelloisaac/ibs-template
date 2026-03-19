import type { VariantProps } from 'tailwind-variants';
import type { notificationTriggerVariants } from './notification-trigger.variants';

export type NotificationTriggerBaseProps = React.ComponentProps<'button'> &
  VariantProps<typeof notificationTriggerVariants> & {
    showBadge?: boolean;
    maxCount?: number;
  };
