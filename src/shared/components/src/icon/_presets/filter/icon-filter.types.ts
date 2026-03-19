import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconFilterVariants } from './icon-filter.variants';

export type IconFilterProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconFilterVariants>;
