import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputMoneyVariants } from './input-money.variants';

export type InputMoneyProps = Omit<InputBaseProps, 'type' | 'inputMode' | 'value' | 'defaultValue'> &
  VariantProps<typeof inputMoneyVariants> & {
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    locale?: string;
    currency?: string;
    decimalPlaces?: number;
    allowNegative?: boolean;
  };

export interface InputMoneyFormatOptions {
  locale?: string;
  currency?: string;
  decimalPlaces?: number;
}
