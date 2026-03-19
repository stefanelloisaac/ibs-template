import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconFilterLinesVariants } from './icon-filter-lines.variants';

export type IconFilterLinesProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconFilterLinesVariants>;
