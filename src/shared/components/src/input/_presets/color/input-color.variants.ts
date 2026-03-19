import { tv } from 'tailwind-variants';

export const inputColorVariants = tv({
  slots: {
    root: 'p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none',
  },
  variants: {},
  defaultVariants: {},
});
