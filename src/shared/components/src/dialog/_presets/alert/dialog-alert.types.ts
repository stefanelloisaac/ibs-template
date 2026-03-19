import type { VariantProps } from 'tailwind-variants';
import type { dialogVariants } from '../../_core/dialog.variants';

export type DialogAlertProps = VariantProps<typeof dialogVariants> & {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  intent?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
  id?: string;
  children?: React.ReactNode;
};
