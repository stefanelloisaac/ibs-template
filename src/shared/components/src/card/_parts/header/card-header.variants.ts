import { tv } from 'tailwind-variants';

export const cardHeaderVariants = tv({
  slots: {
    root: [
      'p-2 @container/card-header',
      'grid auto-rows-min grid-rows-[auto_auto] items-start gap-0.5',
      'has-data-[slot=card-action]:grid-cols-[1fr_auto]',
    ],
  },
  variants: {},
  defaultVariants: {},
});
