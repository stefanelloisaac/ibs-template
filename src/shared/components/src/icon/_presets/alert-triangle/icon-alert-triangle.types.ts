import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconAlertTriangleVariants } from './icon-alert-triangle.variants';

export type IconAlertTriangleProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconAlertTriangleVariants>;
