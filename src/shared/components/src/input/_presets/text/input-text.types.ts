import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputTextVariants } from './input-text.variants';

export type InputTextProps = Omit<InputBaseProps, 'type' | 'maxLength' | 'value' | 'defaultValue'> &
  VariantProps<typeof inputTextVariants> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    onClear?: () => void;
  };
