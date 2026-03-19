import type { VariantProps } from 'tailwind-variants';
import type { InputBaseProps } from '../../_core/input.types';
import { inputTimeVariants } from './input-time.variants';

export type InputTimeProps = Omit<InputBaseProps, 'type'> & VariantProps<typeof inputTimeVariants>;
