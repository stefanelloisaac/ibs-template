import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconArrowUpDownVariants } from './icon-arrow-up-down.variants';

export type IconArrowUpDownProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconArrowUpDownVariants>;
