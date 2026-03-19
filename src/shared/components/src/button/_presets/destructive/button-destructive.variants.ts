import { tv } from 'tailwind-variants';

export const buttonDestructiveVariants = tv({
  slots: {
    root: [
      'bg-destructive text-primary-foreground hover:bg-destructive/90',
      'focus-visible:border-destructive focus-visible:ring-destructive/70',
      'dark:bg-destructive/70 dark:focus-visible:ring-destructive/50',
    ],
  },
  variants: {},
  defaultVariants: {},
});
