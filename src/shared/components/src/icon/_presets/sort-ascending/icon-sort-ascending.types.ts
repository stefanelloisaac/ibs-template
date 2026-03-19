import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconSortAscendingVariants } from './icon-sort-ascending.variants';

export type IconSortAscendingProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconSortAscendingVariants>;
