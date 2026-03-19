import { tv } from 'tailwind-variants';

export const periodVariants = tv({
  slots: {
    root: 'relative flex flex-col gap-1.5 pb-5 has-disabled:opacity-50 has-disabled:pointer-events-none',
    fields: 'flex gap-4 *:pb-0',
  },
  variants: {
    fullWidth: {
      true: { root: 'w-full' },
      false: { root: 'inline-flex' },
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
