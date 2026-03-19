import type { VariantProps } from 'tailwind-variants';
import type { ButtonBaseProps } from '../../_core/button.types';
import { buttonLinkVariants } from './button-link.variants';

export type ButtonLinkProps = ButtonBaseProps & VariantProps<typeof buttonLinkVariants>;
