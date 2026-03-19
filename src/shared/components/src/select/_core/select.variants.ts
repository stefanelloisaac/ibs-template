import { tv } from 'tailwind-variants';

export const selectVariants = tv({
  slots: {
    root: 'relative flex flex-col gap-1.5 pb-5 has-disabled:opacity-50 has-disabled:pointer-events-none',
    trigger: [
      'h-9 w-full min-w-0 rounded-md border px-2 py-1',
      'bg-input text-foreground border-border shadow-xs',
      'text-base md:text-sm',
      'transition-[color,box-shadow] outline-none',
      'cursor-pointer text-left',
      'flex items-center gap-2',
    ],
    displayText: 'truncate flex-1 min-w-0',
    placeholder: 'truncate flex-1 min-w-0 text-muted-foreground',
    chevron: 'shrink-0 transition-transform',
    content: 'w-full max-h-60 overflow-auto p-1',
    option: [
      'flex items-center rounded px-2 py-1.5 text-sm cursor-pointer',
      'text-foreground hover:bg-muted select-none',
    ],
  },
  variants: {
    intent: {
      default: {
        trigger: 'focus-visible:border-ring focus-visible:ring-ring/70 focus-visible:ring-[3px]',
      },
      error: {
        trigger: 'border-error focus-visible:border-error focus-visible:ring-error/70 focus-visible:ring-[3px]',
      },
    },
    fullWidth: {
      true: { root: 'w-full' },
      false: { root: 'inline-flex' },
    },
    selected: {
      true: { option: 'text-primary' },
    },
    highlighted: {
      true: { option: 'bg-accent' },
    },
    open: {
      true: { chevron: 'rotate-180' },
    },
  },
  defaultVariants: {
    intent: 'default',
    fullWidth: true,
  },
});
