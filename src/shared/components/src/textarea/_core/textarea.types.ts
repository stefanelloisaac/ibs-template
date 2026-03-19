import React from 'react';
import type { VariantProps } from 'tailwind-variants';
import type { textareaVariants } from './textarea.variants';

export type TextareaBaseProps = Omit<React.ComponentProps<'textarea'>, 'children' | 'maxLength'> &
  VariantProps<typeof textareaVariants> & {
    label?: string;
    errorMessage?: string;
    required?: boolean;
    maxLength: number;
  };
