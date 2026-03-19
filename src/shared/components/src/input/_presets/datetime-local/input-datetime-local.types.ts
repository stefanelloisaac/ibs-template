import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputDatetimeLocalVariants } from './input-datetime-local.variants';

export type InputDatetimeLocalProps = Omit<InputBaseProps, 'type' | 'value' | 'defaultValue'> &
  VariantProps<typeof inputDatetimeLocalVariants> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  };
