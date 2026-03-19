import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconSortDescendingVariants } from './icon-sort-descending.variants';

export type IconSortDescendingProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconSortDescendingVariants>;
