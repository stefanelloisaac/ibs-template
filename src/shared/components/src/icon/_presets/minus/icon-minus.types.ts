import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconMinusVariants } from './icon-minus.variants';

export type IconMinusProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconMinusVariants>;
