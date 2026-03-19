import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconXCircleVariants } from './icon-x-circle.variants';

export type IconXCircleProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconXCircleVariants>;
