import { tv } from 'tailwind-variants';

export const inputWeekVariants = tv({
  slots: {
    root: 'pr-10 [&::-webkit-calendar-picker-indicator]:hidden',
    actionsWrapper: 'absolute right-3 top-0 flex h-9 items-center',
    actionButton: 'cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground',
  },
  variants: {},
  defaultVariants: {},
});
