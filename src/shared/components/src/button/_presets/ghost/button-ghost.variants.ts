import { tv } from 'tailwind-variants';

export const buttonGhostVariants = tv({
  slots: {
    root: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 dark:text-foreground',
  },
  variants: {},
  defaultVariants: {},
});
