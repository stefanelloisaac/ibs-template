import { tv } from 'tailwind-variants';

export const inputFloatVariants = tv({
  slots: {
    root: '',
  },
  variants: {
    align: {
      left: { root: 'text-left' },
      right: { root: 'text-right' },
    },
  },
  defaultVariants: {
    align: 'left',
  },
});
