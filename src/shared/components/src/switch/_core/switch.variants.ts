import { tv } from 'tailwind-variants';

export const switchVariants = tv({
  slots: {
    wrapper: 'relative pb-5',
    root: 'flex flex-col gap-2 border rounded-md p-4',
    row: 'inline-flex items-center gap-2',
    control: 'group relative inline-flex cursor-pointer',
    input: 'sr-only',
    track: [
      'flex h-5 w-9 items-center rounded-full p-0.5',
      'bg-muted transition-colors duration-200',
      'group-has-checked:bg-primary',
      'group-has-focus-visible:ring-2 group-has-focus-visible:ring-ring group-has-focus-visible:ring-offset-2',
      'group-has-disabled:cursor-not-allowed group-has-disabled:opacity-50',
    ],
    thumb: [
      'size-4 rounded-full shadow-sm',
      'bg-white dark:bg-foreground',
      'transition-transform duration-200',
      'group-has-checked:translate-x-4',
    ],
    label: 'text-foreground text-sm font-medium cursor-pointer select-none',
  },

  variants: {
    size: {
      sm: {
        track: 'h-4 w-7',
        thumb: 'size-3 group-has-checked:translate-x-3',
        label: 'text-xs',
      },
      md: {
        track: 'h-5 w-9',
        thumb: 'size-4 group-has-checked:translate-x-4',
        label: 'text-sm',
      },
      lg: {
        track: 'h-6 w-11',
        thumb: 'size-5 group-has-checked:translate-x-5',
        label: 'text-base',
      },
    },
    labelPosition: {
      left: { row: 'flex-row-reverse' },
      right: { row: 'flex-row' },
    },
    intent: {
      default: {},
      error: {
        root: 'border-error',
      },
    },
    disabled: {
      true: { label: 'opacity-50 cursor-not-allowed' },
    },
    fullWidth: {
      true: { wrapper: 'w-full' },
      false: { wrapper: 'inline-flex flex-col' },
    },
  },

  defaultVariants: {
    size: 'md',
    labelPosition: 'right',
    intent: 'default',
    fullWidth: true,
  },
});
