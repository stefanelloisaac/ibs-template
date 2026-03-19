import { tv } from 'tailwind-variants';

export const labelVariants = tv({
  slots: {
    root: ['flex items-center gap-1', 'text-sm leading-none font-medium', 'select-none'],
  },
  variants: {
    size: {
      sm: { root: 'text-xs' },
      md: { root: 'text-sm' },
      lg: { root: 'text-base' },
    },
    intent: {
      default: { root: 'text-foreground' },
      error: { root: 'text-error' },
      success: { root: 'text-success' },
    },
  },
  defaultVariants: {
    size: 'md',
    intent: 'default',
  },
});
