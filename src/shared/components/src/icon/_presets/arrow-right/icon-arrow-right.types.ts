import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import { iconArrowRightVariants } from './icon-arrow-right.variants';

export type IconArrowRightProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconArrowRightVariants>;
