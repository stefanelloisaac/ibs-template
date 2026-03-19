import { tv } from 'tailwind-variants';

export const errorBoundaryVariants = tv({
  slots: {
    root: 'flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 p-4 text-sm text-error',
    icon: 'shrink-0 size-4',
  },
  variants: {},
  defaultVariants: {},
});
