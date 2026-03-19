import { tv } from 'tailwind-variants';

export const dataTableHeaderVariants = tv({
  slots: {
    root: 'sticky top-0 z-10',
    row: '',
    cell: 'h-10 text-left align-middle font-medium text-muted-foreground select-none whitespace-nowrap bg-table-header border-y border-table-border',
    cellWrapper: 'flex px-4 bg-inherit',
    cellContent: 'flex items-center gap-1 flex-1 min-w-0',
    cellLabel: 'flex-1 min-w-0 truncate',
    cellActions: 'flex items-center gap-0.5 shrink-0',
    sortButton: 'inline-flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors',
    sortIcon: 'size-4',
    resizeHandle: [
      '-mr-4 w-1 cursor-col-resize select-none touch-none shrink-0 flex items-center justify-end',
      'bg-transparent hover:bg-primary/50 active:bg-primary',
      'after:content-[""] after:h-4 after:w-0.5 after:rounded-full after:bg-muted-foreground/30',
    ],
    checkboxCell: 'w-10 p-0 bg-table-header',
    checkboxButton: 'inline-flex items-center justify-center size-full min-h-10 cursor-pointer',
  },
  variants: {
    active: {
      true: { cell: 'text-primary' },
    },
    alignRight: {
      true: { cellContent: 'flex-row-reverse' },
    },
  },
  defaultVariants: {},
});
