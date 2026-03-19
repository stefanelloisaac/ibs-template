import { tv } from 'tailwind-variants';

export const inputTextVariants = tv({
  slots: {
    root: 'pr-10',
    actionsWrapper: 'absolute right-3 top-0 flex h-9 items-center',
    clearButton: 'cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground',
  },
  variants: {},
  defaultVariants: {},
});
