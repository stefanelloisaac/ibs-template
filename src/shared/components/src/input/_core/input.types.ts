import React from 'react';
import type { VariantProps } from 'tailwind-variants';
import type { inputVariants } from './input.variants';

export type InputBaseProps = React.ComponentProps<'input'> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    errorMessage?: string;
    required?: boolean;
  };
