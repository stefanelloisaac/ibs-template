import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputMonthVariants } from './input-month.variants';

export type InputMonthProps = Omit<InputBaseProps, 'type' | 'value' | 'defaultValue'> &
  VariantProps<typeof inputMonthVariants> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  };
