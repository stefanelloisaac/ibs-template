import { ErrorBoundary } from '../../../../lib/error-boundary';
import { Toast } from '../../_core/toast';
import type { ToastContainerProps } from './toast-container.types';
import { toastContainerVariants } from './toast-container.variants';

export function ToastContainer(props: ToastContainerProps) {
  const { toasts, onDismiss, position = 'top-right' } = props;

  const styles = toastContainerVariants({ position });

  if (toasts.length === 0) return null;

  return (
    <ErrorBoundary>
      <div data-slot='toast-container' className={styles.root()}>
        {toasts.map((item) => (
          <Toast key={item.id} item={item} onDismiss={onDismiss} />
        ))}
      </div>
    </ErrorBoundary>
  );
}
