import type { VariantProps } from 'tailwind-variants';
import type { ButtonBaseProps } from '../../_core/button.types';
import { buttonPrimaryVariants } from './button-primary.variants';

export type ButtonPrimaryProps = ButtonBaseProps & VariantProps<typeof buttonPrimaryVariants>;
