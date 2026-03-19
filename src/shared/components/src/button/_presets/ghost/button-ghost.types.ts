import type { VariantProps } from 'tailwind-variants';
import type { ButtonBaseProps } from '../../_core/button.types';
import { buttonGhostVariants } from './button-ghost.variants';

export type ButtonGhostProps = ButtonBaseProps & VariantProps<typeof buttonGhostVariants>;
