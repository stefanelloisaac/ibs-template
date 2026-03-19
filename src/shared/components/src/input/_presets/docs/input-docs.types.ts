import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputDocsVariants } from './input-docs.variants';

export type InputDocsProps = Omit<InputBaseProps, 'type' | 'inputMode' | 'maxLength' | 'value' | 'defaultValue'> &
  VariantProps<typeof inputDocsVariants> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    mask: string;
    docType: string;
  };
