import type { VariantProps } from 'tailwind-variants';
import { checkboxVariants } from './checkbox.variants';

export type CheckboxBaseProps = Omit<React.ComponentProps<'input'>, 'type' | 'size'> &
  VariantProps<typeof checkboxVariants> & {
    label?: string;
    errorMessage?: string;
  };
