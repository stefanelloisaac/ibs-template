import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconChevronDownVariants } from './icon-chevron-down.variants';

export type IconChevronDownProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconChevronDownVariants>;
