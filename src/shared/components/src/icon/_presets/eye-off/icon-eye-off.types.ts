import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconEyeOffVariants } from './icon-eye-off.variants';

export type IconEyeOffProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconEyeOffVariants>;
