import { tv } from 'tailwind-variants';

export const dataTablePaginationVariants = tv({
  slots: {
    root: 'flex items-center justify-between px-4 py-3 border-t border-table-border shrink-0',
    info: 'text-xs text-muted-foreground',
    controls: 'flex items-center gap-1',
    button: [
      'text-foreground inline-flex items-center justify-center rounded-md',
      'h-8 w-8 text-xs',
      'border border-border bg-background',
      'hover:bg-accent hover:text-accent-foreground',
      'disabled:pointer-events-none disabled:opacity-50',
      'transition-colors',
    ],
    selectButton: [
      'inline-flex items-center gap-1 rounded-md px-4 h-8 min-w-28 text-xs text-foreground',
      'border border-border bg-background',
      'hover:bg-accent hover:text-accent-foreground',
      'transition-colors cursor-pointer select-none',
    ],
    selectItem: ['flex items-center rounded px-2 py-1.5 text-xs cursor-pointer', 'hover:bg-accent select-none'],
    pageInfo:
      'border rounded-md flex items-center justify-center h-8 text-xs text-muted-foreground px-2 min-w-24 text-center tabular-nums',
  },
  variants: {},
  defaultVariants: {},
});
