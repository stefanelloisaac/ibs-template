import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputIntVariants } from './input-int.variants';

export type InputIntProps = Omit<InputBaseProps, 'type' | 'inputMode' | 'value' | 'defaultValue'> &
  VariantProps<typeof inputIntVariants> & {
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    locale?: string;
    thousandSeparator?: boolean;
    unit?: string;
  };

export interface InputIntFormatOptions {
  locale?: string;
  thousandSeparator?: boolean;
  unit?: string;
}
