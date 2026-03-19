import { tv } from 'tailwind-variants';

export const cardTitleVariants = tv({
  slots: {
    root: 'leading-none font-heading font-semibold',
  },
  variants: {
    size: {
      sm: { root: 'text-base' },
      md: { root: 'text-lg' },
      lg: { root: 'text-xl' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
