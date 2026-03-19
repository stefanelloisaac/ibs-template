import type { VariantProps } from 'tailwind-variants';
import { inputFileVariants } from './input-file.variants';

export type InputFileProps = Omit<React.ComponentProps<'input'>, 'type' | 'value'> &
  VariantProps<typeof inputFileVariants> & {
    label?: string;
    errorMessage?: string;
    placeholder?: string;
    onClear?: () => void;
  };
