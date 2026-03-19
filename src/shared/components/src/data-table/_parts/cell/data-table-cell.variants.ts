import { tv } from 'tailwind-variants';

export const dataTableCellVariants = tv({
  slots: {
    root: 'p-4 align-middle border-b border-table-border',
    content: 'flex items-center gap-1',
  },
  variants: {
    align: {
      left: { root: 'text-left', content: 'justify-start' },
      center: { root: 'text-center', content: 'justify-center' },
      right: { root: 'text-right', content: 'justify-end' },
    },
    sublevel: {
      true: { root: 'py-2 px-4' },
    },
  },
  defaultVariants: {
    align: 'left',
  },
});
