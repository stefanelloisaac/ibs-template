import type { VariantProps } from 'tailwind-variants';
import type { popoverVariants } from './popover.variants';

export interface PopoverProps extends VariantProps<typeof popoverVariants> {
  trigger: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  portal?: boolean;
  portalContainer?: HTMLElement | (() => HTMLElement);
  className?: string;
  contentClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
}
