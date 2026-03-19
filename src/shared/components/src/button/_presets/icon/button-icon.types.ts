import type { VariantProps } from 'tailwind-variants';
import type { ButtonBaseProps } from '../../_core/button.types';
import { buttonIconVariants } from './button-icon.variants';

export type ButtonIconProps = Omit<ButtonBaseProps, 'size' | 'children'> &
  VariantProps<typeof buttonIconVariants> & {
    icon: React.ReactNode;
  };
