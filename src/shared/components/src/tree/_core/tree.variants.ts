import { tv } from 'tailwind-variants';

export const treeVariants = tv({
  slots: {
    root: 'flex flex-col text-sm border rounded-lg overflow-hidden',
  },
});

export const treeNodeVariants = tv({
  slots: {
    root: [
      'flex items-center gap-2 py-1 px-2',
      'transition-colors duration-100',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset outline-none',
    ],
    expandIcon: 'shrink-0 transition-transform duration-200',
    expandPlaceholder: 'shrink-0 size-4',
    nodeIcon: 'shrink-0 size-4',
    nodeLabel: 'flex-1 truncate select-none',
    checkbox: 'shrink-0',
    children: 'grid transition-[grid-template-rows] duration-200 ease-out',
    childrenInner: 'overflow-hidden',
    loadingIcon: 'shrink-0 animate-spin',
  },
  variants: {
    selected: {
      true: { root: 'bg-primary/10 hover:bg-primary/15' },
      false: { root: 'hover:bg-accent' },
    },
    disabled: {
      true: { root: 'opacity-50 pointer-events-none' },
      false: { root: 'cursor-pointer' },
    },
    expanded: {
      true: { expandIcon: 'rotate-90' },
    },
  },
  defaultVariants: {
    selected: false,
    disabled: false,
  },
});
