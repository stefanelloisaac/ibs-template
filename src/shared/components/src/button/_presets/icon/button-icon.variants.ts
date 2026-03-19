import { tv } from 'tailwind-variants';

export const buttonIconVariants = tv({
  slots: {
    root: 'min-w-0',
  },
  variants: {
    variant: {
      primary: { root: 'bg-primary text-primary-foreground hover:bg-primary/90' },
      secondary: { root: 'bg-secondary text-secondary-foreground hover:bg-secondary/80' },
      outline: {
        root: ['border bg-background shadow-xs', 'hover:bg-accent hover:text-accent-foreground'],
      },
      destructive: {
        root: [
          'bg-destructive text-primary-foreground hover:bg-destructive/90',
          'focus-visible:border-destructive focus-visible:ring-destructive/70',
          'dark:bg-destructive/70 dark:focus-visible:ring-destructive/50',
        ],
      },
      ghost: { root: 'hover:bg-accent hover:text-accent-foreground' },
      link: { root: 'border border-primary text-primary underline-offset-4 hover:underline' },
    },
    size: {
      xs: { root: "size-6 [&_svg:not([class*='size-'])]:size-3" },
      sm: { root: "size-8 [&_svg:not([class*='size-'])]:size-4" },
      md: { root: "size-9 [&_svg:not([class*='size-'])]:size-4" },
      lg: { root: "size-10 [&_svg:not([class*='size-'])]:size-5" },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
