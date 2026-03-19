import type { VariantProps } from 'tailwind-variants';
import type { dialogVariants } from './dialog.variants';

export type DialogBaseProps = Omit<React.ComponentProps<'dialog'>, 'open'> &
  VariantProps<typeof dialogVariants> & {
    open: boolean;
    onClose: () => void;
  };
