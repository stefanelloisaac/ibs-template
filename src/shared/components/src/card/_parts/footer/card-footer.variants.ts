import { tv } from 'tailwind-variants';

export const cardFooterVariants = tv({
  slots: {
    root: 'p-2 flex items-center gap-2',
  },
  variants: {
    justify: {
      start: { root: 'justify-start' },
      center: { root: 'justify-center' },
      end: { root: 'justify-end' },
      between: { root: 'justify-between' },
    },
  },
  defaultVariants: {
    justify: 'end',
  },
});
