import { tv } from 'tailwind-variants';

export const badgeVariants = tv({
  slots: {
    root: 'inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold min-w-14 justify-center',
  },
  variants: {
    intent: {
      default: { root: '' },
      success: { root: '' },
      error: { root: '' },
      warning: { root: '' },
      info: { root: '' },
    },
    toggle: {
      true: {
        root: 'cursor-pointer select-none transition-colors outline-none focus-visible:ring-ring/70 focus-visible:ring-[3px] disabled:opacity-50 disabled:pointer-events-none',
      },
      false: { root: '' },
    },
    selected: {
      true: { root: '' },
      false: { root: '' },
    },
  },
  compoundVariants: [
    {
      intent: 'default',
      selected: false,
      class: { root: 'border-border bg-muted/50 text-muted-foreground hover:bg-muted' },
    },
    {
      intent: 'default',
      selected: true,
      class: { root: 'border-foreground bg-foreground text-background hover:bg-foreground/90' },
    },
    {
      intent: 'success',
      selected: false,
      class: { root: 'border-success/30 bg-success/10 text-success hover:bg-success/20' },
    },
    {
      intent: 'success',
      selected: true,
      class: { root: 'border-success bg-success text-primary-foreground hover:bg-success/90' },
    },
    {
      intent: 'error',
      selected: false,
      class: { root: 'border-error/30 bg-error/10 text-error hover:bg-error/20' },
    },
    {
      intent: 'error',
      selected: true,
      class: { root: 'border-error bg-error text-primary-foreground hover:bg-error/90' },
    },
    {
      intent: 'warning',
      selected: false,
      class: { root: 'border-warning/30 bg-warning/10 text-warning hover:bg-warning/20' },
    },
    {
      intent: 'warning',
      selected: true,
      class: { root: 'border-warning bg-warning text-primary-foreground hover:bg-warning/90' },
    },
    {
      intent: 'info',
      selected: false,
      class: { root: 'border-info/30 bg-info/10 text-info hover:bg-info/20' },
    },
    {
      intent: 'info',
      selected: true,
      class: { root: 'border-info bg-info text-primary-foreground hover:bg-info/90' },
    },
  ],
  defaultVariants: {
    intent: 'default',
    toggle: false,
    selected: false,
  },
});
