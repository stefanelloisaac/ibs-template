import { tv } from 'tailwind-variants';

export const buttonOutlineVariants = tv({
  slots: {
    root: ['border bg-background shadow-xs', 'hover:bg-accent hover:text-accent-foreground'],
  },
  variants: {},
  defaultVariants: {},
});
