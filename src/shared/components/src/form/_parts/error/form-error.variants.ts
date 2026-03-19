import { tv } from 'tailwind-variants';

export const formErrorVariants = tv({
  slots: {
    root: 'absolute -bottom-0.5 left-0 text-xs text-error animate-error-in',
  },
  variants: {},
  defaultVariants: {},
});
