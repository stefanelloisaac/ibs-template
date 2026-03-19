import type { VariantProps } from 'tailwind-variants';
import type { ButtonBaseProps } from '../../_core/button.types';
import { buttonSecondaryVariants } from './button-secondary.variants';

export type ButtonSecondaryProps = ButtonBaseProps & VariantProps<typeof buttonSecondaryVariants>;
