import { tv } from 'tailwind-variants';

export const lookupVariants = tv({
  slots: {
    root: 'relative flex flex-col gap-1.5 pb-5 has-disabled:opacity-50 has-disabled:pointer-events-none',
    field: 'relative',
    control: [
      'w-full min-w-0',
      'bg-input text-foreground',
      'text-base md:text-sm',
      'transition-[color,box-shadow] outline-none',
      'cursor-pointer text-left',
      'flex items-center',
    ],
    displayText: 'truncate text-foreground',
    placeholder: 'truncate text-muted-foreground',
  },
  variants: {
    intent: {
      default: {},
      error: {},
    },
    fullWidth: {
      true: { root: 'w-full', control: 'w-full' },
      false: { root: 'inline-flex', control: 'w-auto' },
    },
    compound: {
      true: {
        field: [
          'flex min-h-9 flex-wrap items-center gap-1 rounded-md border px-2 py-1 pr-16',
          'bg-input border-border shadow-xs',
          'transition-[color,box-shadow]',
        ],
        control: 'h-auto flex-1 flex-wrap gap-1 w-auto bg-transparent',
      },
      false: {
        control: ['h-9 rounded-md border px-2 py-1 pr-16', 'border-border shadow-xs'],
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
