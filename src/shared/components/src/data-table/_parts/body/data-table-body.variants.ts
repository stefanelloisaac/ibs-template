import { tv } from 'tailwind-variants';

export const dataTableBodyVariants = tv({
  slots: {
    root: '[&_tr:last-child]:border-0',
    empty: 'p-8 text-center text-muted-foreground',
  },
  variants: {},
  defaultVariants: {},
});
