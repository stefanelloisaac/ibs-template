import type { VariantProps } from 'tailwind-variants';
import type { ToastInternalItem, ToastPosition } from '../../_core/toast.types';
import type { toastContainerVariants } from './toast-container.variants';

export type ToastContainerProps = VariantProps<typeof toastContainerVariants> & {
  toasts: ToastInternalItem[];
  onDismiss: (id: string) => void;
  position?: ToastPosition;
};
