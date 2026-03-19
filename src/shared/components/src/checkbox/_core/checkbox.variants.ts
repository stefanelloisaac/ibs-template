import { tv } from 'tailwind-variants';

export const checkboxVariants = tv({
  slots: {
    wrapper: 'relative pb-5',
    root: 'flex flex-col gap-2 border rounded-md p-4',
    row: 'flex items-center gap-2',
    control: 'relative flex items-center justify-center',
    input: [
      'peer h-4 w-4 cursor-pointer appearance-none rounded border border-border bg-input shadow-xs',
      'transition-colors outline-none',
      'checked:border-primary checked:bg-primary',
      'focus-visible:ring-ring/70 focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ],
    icon: 'pointer-events-none absolute text-primary-foreground opacity-0 peer-checked:opacity-100',
    label: 'cursor-pointer text-sm text-foreground font-medium select-none',
  },
  variants: {
    intent: {
      default: {},
      error: {
        root: 'border-error',
      },
    },
    labelPosition: {
      left: { row: 'flex-row-reverse justify-end' },
      right: { row: 'flex-row' },
    },
    disabled: {
      true: {
        label: 'cursor-not-allowed opacity-50',
      },
    },
    fullWidth: {
      true: { wrapper: 'w-full' },
      false: { wrapper: 'inline-flex flex-col' },
    },
  },
  defaultVariants: {
    intent: 'default',
    labelPosition: 'right',
    disabled: false,
    fullWidth: true,
  },
});
