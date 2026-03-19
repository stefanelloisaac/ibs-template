import { tv } from 'tailwind-variants';

export const inputSearchVariants = tv({
  slots: {
    root: 'pr-13',
    actionsWrapper: 'absolute right-3 top-0 flex h-9 items-center gap-1',
    clearButton: 'cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground',
    icon: 'pointer-events-none',
  },
  variants: {},
  defaultVariants: {},
});
