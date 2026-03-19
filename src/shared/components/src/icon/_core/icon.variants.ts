import { tv } from 'tailwind-variants';

export const iconVariants = tv({
  slots: {
    root: 'shrink-0 text-foreground',
  },
  variants: {
    variant: {
      default: { root: '' },
      outline: { root: 'inline-flex items-center justify-center rounded-md border border-current p-1.5' },
    },
    size: {
      none: { root: '' },
      xs: { root: 'size-3' },
      sm: { root: 'size-4' },
      md: { root: 'size-5' },
      lg: { root: 'size-6' },
      xl: { root: 'size-8' },
    },
    color: {
      default: { root: 'text-foreground' },
      inherit: { root: 'text-inherit' },
      primary: { root: 'text-primary' },
      secondary: { root: 'text-secondary' },
      muted: { root: 'text-muted-foreground' },
      destructive: { root: 'text-destructive' },
      error: { root: 'text-error' },
      info: { root: 'text-info' },
      success: { root: 'text-success' },
      warning: { root: 'text-warning' },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    color: 'default',
  },
});
