import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputWeekVariants } from './input-week.variants';

export type InputWeekProps = Omit<InputBaseProps, 'type' | 'value' | 'defaultValue'> &
  VariantProps<typeof inputWeekVariants> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  };
