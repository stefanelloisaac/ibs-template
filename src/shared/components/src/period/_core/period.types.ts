import type { VariantProps } from 'tailwind-variants';
import type { periodVariants } from './period.variants';

export type PeriodBaseProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof periodVariants> & {
    label?: string;
    required?: boolean;
    disabled?: boolean;
    errorMessage?: string;
    children: React.ReactNode;
  };
