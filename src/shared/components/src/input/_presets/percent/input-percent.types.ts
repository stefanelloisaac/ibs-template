import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputPercentVariants } from './input-percent.variants';

export type InputPercentProps = Omit<InputBaseProps, 'type' | 'inputMode' | 'value' | 'defaultValue'> &
  VariantProps<typeof inputPercentVariants> & {
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    locale?: string;
    decimalPlaces?: number;
  };

export interface InputPercentFormatOptions {
  locale?: string;
  decimalPlaces?: number;
}
