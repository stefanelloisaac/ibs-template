import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconGripVerticalVariants } from './icon-grip-vertical.variants';

export type IconGripVerticalProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconGripVerticalVariants>;
