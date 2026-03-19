import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import { iconArrowLeftVariants } from './icon-arrow-left.variants';

export type IconArrowLeftProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconArrowLeftVariants>;
