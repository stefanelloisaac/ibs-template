import { tv } from 'tailwind-variants';

export const popoverListboxVariants = tv({
  slots: {
    root: 'absolute z-50 top-full left-0 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover p-1 shadow-md animate-dropdown-in data-closing:animate-dropdown-out',
  },
  variants: {},
  defaultVariants: {},
});
