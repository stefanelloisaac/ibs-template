import type { VariantProps } from 'tailwind-variants';
import type { inputDropzoneVariants } from './input-dropzone.variants';

export type InputDropzoneProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof inputDropzoneVariants> & {
    files: File[];
    onFilesChange: (files: File[]) => void;
    accept?: string;
    maxFiles?: number;
    maxSize?: number;
    label?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    errorMessage?: string;
  };
