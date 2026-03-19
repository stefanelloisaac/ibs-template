import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconCheckCircleVariants } from './icon-check-circle.variants';

export type IconCheckCircleProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconCheckCircleVariants>;
