import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconSpinnerVariants } from './icon-spinner.variants';

export type IconSpinnerProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconSpinnerVariants>;
