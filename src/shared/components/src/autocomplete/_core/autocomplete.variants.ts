import { tv } from 'tailwind-variants';

export const autocompleteVariants = tv({
  slots: {
    container: 'relative has-disabled:opacity-50 has-disabled:pointer-events-none',
    root: 'relative flex flex-col gap-1.5 pb-5',
    field: 'relative',
    control: [
      'w-full min-w-0',
      'bg-input text-foreground',
      'text-base md:text-sm',
      'transition-[color,box-shadow] outline-none',
      'placeholder:text-muted-foreground',
      'selection:bg-primary selection:text-primary-foreground',
    ],
    actionsWrapper: 'absolute right-2 top-0 flex h-full items-center gap-1',
    clearButton:
      'cursor-pointer rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    toggleButton: 'cursor-pointer rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground',
    chevronIcon: 'transition-transform',
    option: 'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted',
    optionHighlighted: 'bg-accent text-accent-foreground',
    emptyMessage: 'px-2 py-1.5 text-center text-sm text-muted-foreground',
  },

  variants: {
    intent: {
      default: {},
      error: {},
    },
    fullWidth: {
      true: {
        container: 'w-full',
        root: 'w-full',
        control: 'w-full',
      },
      false: {
        container: 'inline-block',
        root: 'inline-flex',
        control: 'w-auto',
      },
    },
    open: {
      true: { chevronIcon: 'rotate-180' },
    },
    compound: {
      true: {
        field: [
          'flex min-h-9 flex-wrap items-center gap-1 rounded-md border px-2 py-1 pr-8',
          'bg-input border-border shadow-xs',
          'transition-[color,box-shadow]',
        ],
        control: 'h-auto min-w-16 flex-1 border-0 p-0 shadow-none w-auto bg-transparent',
      },
      false: {
        control: ['h-9 rounded-md border px-3 py-1 pr-8', 'border-border shadow-xs'],
      },
    },
  },

  compoundVariants: [
    {
      compound: false,
      intent: 'default',
      class: { control: 'focus-visible:border-ring focus-visible:ring-ring/70 focus-visible:ring-[3px]' },
    },
    {
      compound: false,
      intent: 'error',
      class: {
        control: 'border-error focus-visible:border-error focus-visible:ring-error/70 focus-visible:ring-[3px]',
      },
    },
    {
      compound: true,
      intent: 'default',
      class: { field: 'focus-within:border-ring focus-within:ring-ring/70 focus-within:ring-[3px]' },
    },
    {
      compound: true,
      intent: 'error',
      class: {
        field: 'border-error focus-within:border-error focus-within:ring-error/70 focus-within:ring-[3px]',
      },
    },
    { compound: true, fullWidth: true, class: { field: 'w-full' } },
  ],

  defaultVariants: {
    intent: 'default',
    fullWidth: true,
    compound: false,
  },
});
