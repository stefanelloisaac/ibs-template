import { tv } from 'tailwind-variants';

export const breadcrumbVariants = tv({
  slots: {
    root: '',
    list: 'flex items-center gap-2 flex-wrap',
    separator: 'text-muted-foreground select-none [&>svg]:size-3.5',
  },
  variants: {},
  defaultVariants: {},
});
