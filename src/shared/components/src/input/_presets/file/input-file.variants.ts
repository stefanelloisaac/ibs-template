import { tv } from 'tailwind-variants';

export const inputFileVariants = tv({
  slots: {
    root: 'h-9 w-full cursor-pointer text-transparent file:sr-only pr-10 leading-6.5',
    actionsWrapper: 'absolute right-3 top-0 flex h-9 items-center gap-1',
    clearButton: 'cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground',
    icon: 'pointer-events-none',
  },
  variants: {},
  defaultVariants: {},
});
