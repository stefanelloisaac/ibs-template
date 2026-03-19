import type { VariantProps } from 'tailwind-variants';
import type { tooltipVariants } from './tooltip.variants';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export type TooltipBaseProps = Omit<React.ComponentProps<'div'>, 'content'> &
  VariantProps<typeof tooltipVariants> & {
    content: React.ReactNode;
    placement?: TooltipPlacement;
    delay?: number;
    children: React.ReactNode;
  };
