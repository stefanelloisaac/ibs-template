import type { VariantProps } from 'tailwind-variants';
import type { buttonVariants } from './button.variants';

export type ButtonBaseProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    icon?: React.ReactNode;
  };
