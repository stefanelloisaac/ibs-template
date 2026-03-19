import { tv } from 'tailwind-variants';

export const dialogHeaderVariants = tv({
  slots: {
    root: [
      'p-2',
      'grid auto-rows-min grid-rows-[auto_auto] items-start gap-0.5',
      'has-data-[slot=dialog-action]:grid-cols-[1fr_auto]',
    ],
  },
  variants: {},
  defaultVariants: {},
});
