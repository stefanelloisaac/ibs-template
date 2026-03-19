import { tv } from 'tailwind-variants';

export const popoverVariants = tv({
  slots: {
    root: 'relative has-disabled:opacity-50 has-disabled:pointer-events-none',
    content:
      'absolute z-50 rounded-md border border-border bg-popover shadow-md animate-dropdown-in data-closing:animate-dropdown-out',
    portalContent:
      'fixed z-50 rounded-md border border-border bg-popover shadow-md animate-dropdown-in data-closing:animate-dropdown-out',
  },
  variants: {
    placement: {
      'bottom-start': { content: 'left-0 top-full mt-1' },
      'bottom-end': { content: 'right-0 top-full mt-1' },
      'top-start': { content: 'left-0 bottom-full mb-1' },
      'top-end': { content: 'right-0 bottom-full mb-1' },
    },
  },
  defaultVariants: {
    placement: 'bottom-end',
  },
});
