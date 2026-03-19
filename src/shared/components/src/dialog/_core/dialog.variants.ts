import { tv } from 'tailwind-variants';

export const dialogVariants = tv({
  slots: {
    root: [
      'bg-popover text-popover-foreground',
      'hidden open:flex open:flex-col gap-4',
      'rounded-lg border shadow-lg',
      'p-4 w-full m-auto',
      'max-h-100vh',
      'open:animate-dialog-in data-closing:animate-dialog-out',
      'backdrop:bg-black/70 backdrop:animate-dialog-overlay-in data-closing:backdrop:animate-dialog-overlay-out',
    ],
  },
  variants: {
    size: {
      sm: { root: 'max-w-sm' },
      md: { root: 'max-w-md' },
      lg: { root: 'max-w-lg' },
      xl: { root: 'max-w-xl' },
      '2xl': { root: 'max-w-2xl' },
      '3xl': { root: 'max-w-3xl' },
      '4xl': { root: 'max-w-4xl' },
      '5xl': { root: 'max-w-5xl' },
      full: { root: 'max-w-[calc(100vw-4rem)]' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
