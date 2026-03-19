import { tv } from 'tailwind-variants';

export const dataTableVariants = tv({
  slots: {
    root: 'flex flex-col w-full h-full',
    scrollArea: ['relative overflow-auto bg-background flex-1 min-h-0', '-webkit-overflow-scrolling-touch'],
    table: 'w-full caption-bottom text-sm border-separate border-spacing-0 text-foreground',
    empty: 'flex items-center justify-center p-8 text-muted-foreground',
    loading: 'absolute inset-0 z-20 flex items-center justify-center bg-background/80',
  },
  variants: {
    size: {
      sm: { table: 'text-xs' },
      md: { table: 'text-sm' },
      lg: { table: 'text-base' },
    },
    striped: {
      true: {},
      false: {},
    },
    responsive: {
      true: { table: 'min-w-150' },
    },
    bordered: {
      true: { root: 'border border-border rounded-lg overflow-hidden' },
    },
  },
  defaultVariants: {
    size: 'md',
    striped: false,
  },
});
