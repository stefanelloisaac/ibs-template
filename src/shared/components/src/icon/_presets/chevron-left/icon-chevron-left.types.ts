import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconChevronLeftVariants } from './icon-chevron-left.variants';

export type IconChevronLeftProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconChevronLeftVariants>;
