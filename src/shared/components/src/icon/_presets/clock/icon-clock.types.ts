import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconClockVariants } from './icon-clock.variants';

export type IconClockProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconClockVariants>;
