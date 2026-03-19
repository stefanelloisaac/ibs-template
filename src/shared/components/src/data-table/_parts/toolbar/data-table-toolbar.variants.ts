import { tv } from 'tailwind-variants';

export const dataTableToolbarVariants = tv({
  slots: {
    root: 'flex items-center justify-between gap-4',
    left: 'flex items-center gap-2',
    right: 'flex items-center gap-2',
    toolbarButton: [
      'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-foreground',
      'border bg-background shadow-xs',
      'hover:bg-accent hover:text-accent-foreground',
      'transition-colors cursor-pointer select-none',
    ],
    selectedCount: 'text-xs font-medium text-muted-foreground',
    dropdownItem: [
      'text-foreground flex items-center gap-2 rounded px-2 py-1.5 text-sm cursor-pointer',
      'hover:bg-muted select-none',
    ],
  },
  variants: {
    active: {
      true: { toolbarButton: 'bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:border-primary/40' },
    },
  },
  defaultVariants: {},
});
