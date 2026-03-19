import type { VariantProps } from 'tailwind-variants';
import type { toastVariants } from './toast.variants';

export type ToastIntent = 'success' | 'error' | 'warning' | 'info';

export type ToastPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  intent: ToastIntent;
  duration?: number;
  dismissible?: boolean;
};

export type ToastInternalItem = ToastItem & {
  _closing?: boolean;
};

export type ToastOptions = Omit<ToastItem, 'id'>;

export type ToastBaseProps = React.ComponentProps<'div'> &
  VariantProps<typeof toastVariants> & {
    item: ToastInternalItem;
    onDismiss: (id: string) => void;
  };
