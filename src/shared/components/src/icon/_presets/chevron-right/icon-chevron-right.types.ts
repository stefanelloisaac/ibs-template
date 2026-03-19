import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconChevronRightVariants } from './icon-chevron-right.variants';

export type IconChevronRightProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconChevronRightVariants>;
