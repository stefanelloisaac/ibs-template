import { tv } from 'tailwind-variants';

export const breadcrumbItemVariants = tv({
  slots: {
    root: 'text-sm transition-colors',
  },
  variants: {
    current: {
      true: { root: 'text-foreground font-medium pointer-events-none' },
      false: { root: 'text-muted-foreground hover:text-foreground cursor-pointer' },
    },
  },
  defaultVariants: {
    current: false,
  },
});
