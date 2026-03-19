import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputColorVariants } from './input-color.variants';

export type InputColorProps = Omit<InputBaseProps, 'type'> & VariantProps<typeof inputColorVariants>;
