import { tv } from 'tailwind-variants';

export const inputVariants = tv({
  slots: {
    root: 'relative flex flex-col gap-1.5 pb-5 has-disabled:opacity-50 has-disabled:pointer-events-none',
    field: 'relative',
    control: [
      'h-9 w-full min-w-0 rounded-md border px-3 py-1',
      'bg-input text-foreground border-border shadow-xs',
      'text-base md:text-sm',
      'transition-[color,box-shadow] outline-none',
      'placeholder:text-muted-foreground',
      'selection:bg-primary selection:text-primary-foreground',
      'read-only:text-foreground/70',
    ],
  },

  variants: {
    intent: {
      default: {
        control: 'focus-visible:border-ring focus-visible:ring-ring/70 focus-visible:ring-[3px]',
      },
      error: {
        control: 'border-error focus-visible:border-error focus-visible:ring-error/70 focus-visible:ring-[3px]',
      },
      success: {
        control: 'border-success focus-visible:border-success focus-visible:ring-success/70 focus-visible:ring-[3px]',
      },
    },
    fullWidth: {
      true: {
        root: 'w-full',
        control: 'w-full',
      },
      false: {
        root: 'inline-flex',
        control: 'w-auto',
      },
    },
  },

  defaultVariants: {
    intent: 'default',
    fullWidth: true,
  },
});
