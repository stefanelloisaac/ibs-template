import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconSearchVariants } from './icon-search.variants';

export type IconSearchProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconSearchVariants>;
