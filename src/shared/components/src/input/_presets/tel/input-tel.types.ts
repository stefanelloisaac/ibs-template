import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputTelVariants } from './input-tel.variants';

export type TelLocale = 'pt-BR' | 'en-US';

export interface TelMaskConfig {
  mobile: string;
  landline: string;
  maxDigits: number;
  isMobile: (digits: string) => boolean;
}

export type InputTelProps = Omit<InputBaseProps, 'type' | 'inputMode' | 'maxLength' | 'value' | 'defaultValue'> &
  VariantProps<typeof inputTelVariants> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    locale?: TelLocale;
    onClear?: () => void;
  };
