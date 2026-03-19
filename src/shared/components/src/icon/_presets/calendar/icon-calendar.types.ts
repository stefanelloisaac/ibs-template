import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconCalendarVariants } from './icon-calendar.variants';

export type IconCalendarProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconCalendarVariants>;
