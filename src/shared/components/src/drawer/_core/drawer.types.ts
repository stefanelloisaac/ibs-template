import type { VariantProps } from 'tailwind-variants';
import type { drawerVariants } from './drawer.variants';

export type DrawerBaseProps = Omit<React.ComponentProps<'dialog'>, 'open'> &
  VariantProps<typeof drawerVariants> & {
    open: boolean;
    onClose: () => void;
  };
