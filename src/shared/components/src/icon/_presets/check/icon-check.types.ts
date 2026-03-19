import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconCheckVariants } from './icon-check.variants';

export type IconCheckProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconCheckVariants>;
