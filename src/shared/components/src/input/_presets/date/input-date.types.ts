import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputDateVariants } from './input-date.variants';

export type InputDateProps = Omit<InputBaseProps, 'type' | 'value' | 'defaultValue'> &
  VariantProps<typeof inputDateVariants> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  };
