import type { VariantProps } from 'tailwind-variants';
import type { radioVariants } from './radio.variants';

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export type RadioBaseProps = Omit<React.ComponentProps<'fieldset'>, 'onChange'> &
  VariantProps<typeof radioVariants> & {
    options: RadioOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    name?: string;
    label?: string;
    errorMessage?: string;
    required?: boolean;
  };
