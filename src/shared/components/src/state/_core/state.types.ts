import type { VariantProps } from 'tailwind-variants';
import type { stateVariants } from './state.variants';

export type StateBaseProps = React.ComponentProps<'div'> &
  VariantProps<typeof stateVariants> & {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    action?: React.ReactNode;
  };
