import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconCheckboxVariants } from './icon-checkbox.variants';

export type IconCheckboxProps = Omit<IconBaseProps, 'children'> &
  VariantProps<typeof iconCheckboxVariants> & {
    checked?: boolean;
  };
