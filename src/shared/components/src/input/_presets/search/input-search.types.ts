import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputSearchVariants } from './input-search.variants';

export type InputSearchProps = Omit<InputBaseProps, 'type' | 'inputMode' | 'maxLength' | 'value' | 'defaultValue'> &
  VariantProps<typeof inputSearchVariants> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    onClear?: () => void;
  };
