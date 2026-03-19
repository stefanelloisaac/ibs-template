import { tv } from 'tailwind-variants';

export const dialogAlertVariants = tv({
  slots: {
    dialog: '',
    footer: '',
    confirmButton: '',
  },
  variants: {
    intent: {
      info: {
        confirmButton: [
          'bg-info text-primary-foreground hover:bg-info/90',
          'focus-visible:border-info focus-visible:ring-info/70',
          'dark:bg-info/70 dark:focus-visible:ring-info/50',
        ],
      },
      success: {
        confirmButton: [
          'bg-success text-primary-foreground hover:bg-success/90',
          'focus-visible:border-success focus-visible:ring-success/70',
          'dark:bg-success/70 dark:focus-visible:ring-success/50',
        ],
      },
      warning: {
        confirmButton: [
          'bg-warning text-primary-foreground hover:bg-warning/90',
          'focus-visible:border-warning focus-visible:ring-warning/70',
          'dark:bg-warning/70 dark:focus-visible:ring-warning/50',
        ],
      },
      error: {
        confirmButton: [
          'bg-error text-primary-foreground hover:bg-error/90',
          'focus-visible:border-error focus-visible:ring-error/70',
          'dark:bg-error/70 dark:focus-visible:ring-error/50',
        ],
      },
    },
  },
  defaultVariants: {
    intent: 'info',
  },
});
