import { tv } from 'tailwind-variants';

export const dataTableHeaderFilterVariants = tv({
  slots: {
    trigger: [
      'inline-flex items-center justify-center size-6 rounded cursor-pointer',
      'text-muted-foreground hover:text-foreground hover:bg-accent',
      'transition-colors',
    ],
    filterRange: 'flex flex-col gap-2',
    filterOption: [
      'flex items-center rounded px-2 py-1.5 text-sm cursor-pointer select-none',
      'text-foreground hover:bg-muted transition-colors',
    ],
  },
  variants: {
    active: {
      true: { trigger: 'text-primary' },
    },
    selected: {
      true: { filterOption: 'bg-accent text-accent-foreground' },
    },
  },
  defaultVariants: {},
});
