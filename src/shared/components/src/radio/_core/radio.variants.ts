import { tv } from 'tailwind-variants';

export const radioVariants = tv({
  slots: {
    wrapper: 'relative pb-5 self-start',
    root: 'flex flex-col gap-2',
    legend: ['flex items-center gap-1', 'text-sm leading-none font-medium', 'select-none text-foreground', 'mb-2'],
    options: 'flex gap-4',
    option: 'flex items-center gap-2',
    control: 'relative flex items-center justify-center',
    input: [
      'peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-border bg-input shadow-xs',
      'transition-colors outline-none',
      'checked:border-primary checked:bg-primary',
      'focus-visible:ring-ring/70 focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ],
    indicator:
      'pointer-events-none absolute h-2 w-2 rounded-full bg-primary-foreground opacity-0 peer-checked:opacity-100',
    label: 'cursor-pointer text-sm text-foreground select-none',
  },
  variants: {
    intent: {
      default: {},
      error: {
        legend: 'text-error',
      },
    },
    orientation: {
      vertical: { options: 'flex-col gap-2' },
      horizontal: { options: 'flex-row flex-wrap gap-4' },
    },
    disabled: {
      true: {
        legend: 'opacity-50',
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
    orientation: 'vertical',
    disabled: false,
    fullWidth: true,
  },
});
