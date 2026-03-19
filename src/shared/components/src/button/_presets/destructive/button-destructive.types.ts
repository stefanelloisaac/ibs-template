import type { VariantProps } from 'tailwind-variants';
import type { ButtonBaseProps } from '../../_core/button.types';
import { buttonDestructiveVariants } from './button-destructive.variants';

export type ButtonDestructiveProps = ButtonBaseProps & VariantProps<typeof buttonDestructiveVariants>;
