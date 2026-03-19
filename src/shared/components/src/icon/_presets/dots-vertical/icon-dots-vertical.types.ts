import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconDotsVerticalVariants } from './icon-dots-vertical.variants';

export type IconDotsVerticalProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconDotsVerticalVariants>;
