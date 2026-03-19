import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputFloatVariants } from './input-float.variants';

export type InputFloatProps = Omit<InputBaseProps, 'type' | 'inputMode' | 'value' | 'defaultValue'> &
  VariantProps<typeof inputFloatVariants> & {
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    locale?: string;
    decimalPlaces?: number;
    thousandSeparator?: boolean;
    unit?: string;
  };

export interface InputFloatFormatOptions {
  locale?: string;
  decimalPlaces?: number;
  thousandSeparator?: boolean;
  unit?: string;
}
