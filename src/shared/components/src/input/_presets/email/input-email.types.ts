import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputEmailVariants } from './input-email.variants';

export type InputEmailProps = Omit<InputBaseProps, 'type' | 'inputMode' | 'maxLength' | 'value' | 'defaultValue'> &
  VariantProps<typeof inputEmailVariants> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    onClear?: () => void;
  };
