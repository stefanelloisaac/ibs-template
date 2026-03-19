import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconCloseVariants } from './icon-close.variants';

export type IconCloseProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconCloseVariants>;
