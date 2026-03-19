import { tv } from 'tailwind-variants';

export const lookupMultipleVariants = tv({
  slots: {
    dialog: 'w-[calc(100vw-20rem)] h-[calc(100vh-5rem)] max-w-none',
    actionsWrapper: 'absolute right-2 top-0 flex h-full items-center gap-1',
    clearButton:
      'cursor-pointer rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    searchButton: 'cursor-pointer rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground',
    tag: 'text-foreground bg-popover border-x-3 border-y border-primary rounded-md inline-flex items-center gap-1 px-1.5 py-0.5 text-sm shrink-0',
    tagButton: 'cursor-pointer rounded-md p-0.5 text-muted-foreground hover:bg-background hover:text-foreground',
  },
  variants: {},
  defaultVariants: {},
});
