import type { VariantProps } from 'tailwind-variants';
import type { ButtonBaseProps } from '../../_core/button.types';
import { buttonOutlineVariants } from './button-outline.variants';

export type ButtonOutlineProps = ButtonBaseProps & VariantProps<typeof buttonOutlineVariants>;
