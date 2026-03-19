import { tv } from 'tailwind-variants';

export const toastContainerVariants = tv({
  slots: {
    root: 'fixed z-50 flex flex-col gap-2 pointer-events-none',
  },
  variants: {
    position: {
      'top-right': { root: 'top-4 right-4 items-end' },
      'top-left': { root: 'top-4 left-4 items-start' },
      'top-center': { root: 'top-4 left-1/2 -translate-x-1/2 items-center' },
      'bottom-right': { root: 'bottom-4 right-4 items-end' },
      'bottom-left': { root: 'bottom-4 left-4 items-start' },
      'bottom-center': { root: 'bottom-4 left-1/2 -translate-x-1/2 items-center' },
    },
  },
  defaultVariants: {
    position: 'top-right',
  },
});
