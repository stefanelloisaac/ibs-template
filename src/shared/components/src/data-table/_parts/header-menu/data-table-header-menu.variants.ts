import { tv } from 'tailwind-variants';

export const dataTableHeaderMenuVariants = tv({
  slots: {
    trigger: [
      'inline-flex items-center justify-center size-6 rounded cursor-pointer',
      'text-muted-foreground hover:text-foreground hover:bg-accent',
      'transition-colors',
    ],
  },
  variants: {},
  defaultVariants: {},
});
