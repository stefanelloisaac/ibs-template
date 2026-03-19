import { tv } from 'tailwind-variants';

export const dataTableRowVariants = tv({
  slots: {
    root: 'transition-colors bg-table-odd hover:bg-table-hover',
    checkboxCell: 'w-10 p-0 align-middle text-center border-b border-table-border',
    checkboxButton: 'inline-flex items-center justify-center size-full min-h-10 cursor-pointer',
    expandCell: 'w-10 p-0 align-middle text-center border-b border-table-border',
    expandButton: 'inline-flex items-center justify-center size-full min-h-10 cursor-pointer',
  },
  variants: {
    clickable: {
      true: { root: 'cursor-pointer' },
    },
    selected: {
      true: { root: 'bg-table-selected hover:bg-table-selected-hover' },
    },
    striped: {
      true: { root: 'even:bg-table-even' },
    },
    sublevel: {
      true: {
        root: 'text-xs bg-table-even',
        checkboxButton: 'min-h-8',
        expandButton: 'min-h-8',
      },
    },
  },
  compoundVariants: [
    {
      selected: true,
      striped: true,
      class: { root: 'even:bg-table-selected even:hover:bg-table-selected-hover' },
    },
    {
      sublevel: true,
      striped: true,
      class: { root: 'even:bg-table-even' },
    },
    {
      sublevel: true,
      selected: true,
      class: { root: 'bg-table-selected hover:bg-table-selected-hover' },
    },
    {
      sublevel: true,
      selected: true,
      striped: true,
      class: { root: 'even:bg-table-selected even:hover:bg-table-selected-hover' },
    },
  ],
  defaultVariants: {},
});
