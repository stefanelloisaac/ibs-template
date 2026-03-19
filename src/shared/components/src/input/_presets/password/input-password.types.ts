import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputPasswordVariants } from './input-password.variants';

export type InputPasswordProps = Omit<InputBaseProps, 'type'> & VariantProps<typeof inputPasswordVariants>;
