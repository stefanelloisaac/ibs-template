import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconInfoCircleVariants } from './icon-info-circle.variants';

export type IconInfoCircleProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconInfoCircleVariants>;
