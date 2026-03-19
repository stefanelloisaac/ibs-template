import type { NotificationGroupBaseProps } from './notification-group.types';
import { notificationGroupVariants } from './notification-group.variants';

export function NotificationGroup(props: NotificationGroupBaseProps) {
  const { label, children, className, ...rest } = props;

  const styles = notificationGroupVariants();

  return (
    <div data-slot='notification-group' className={styles.root({ className })} {...rest}>
      <div className={styles.label()}>{label}</div>
      {children}
    </div>
  );
}
