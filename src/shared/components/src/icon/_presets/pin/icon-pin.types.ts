import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconPinVariants } from './icon-pin.variants';

export type IconPinProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconPinVariants>;
