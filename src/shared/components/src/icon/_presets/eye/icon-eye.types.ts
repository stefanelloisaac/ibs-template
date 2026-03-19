import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconEyeVariants } from './icon-eye.variants';

export type IconEyeProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconEyeVariants>;
