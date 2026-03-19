import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconLockVariants } from './icon-lock.variants';

export type IconLockProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconLockVariants>;
