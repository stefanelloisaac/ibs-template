import { tv } from 'tailwind-variants';

export const cardVariants = tv({
  slots: {
    root: ['bg-card text-card-foreground', 'flex flex-col gap-4', 'rounded-md border', 'shadow-sm'],
  },
  variants: {
    fullWidth: {
      true: { root: 'w-full' },
      false: { root: 'inline-flex' },
    },
    padding: {
      none: { root: 'p-0' },
      sm: { root: 'p-2' },
      md: { root: 'p-4' },
      lg: { root: 'p-6' },
    },
  },
  defaultVariants: {
    padding: 'md',
    fullWidth: true,
  },
});
