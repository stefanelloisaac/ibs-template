import type { VariantProps } from 'tailwind-variants';
import type { switchVariants } from './switch.variants';

export type SwitchBaseProps = Omit<React.ComponentProps<'input'>, 'type' | 'size'> &
  VariantProps<typeof switchVariants> & {
    label?: string;
    errorMessage?: string;
  };
