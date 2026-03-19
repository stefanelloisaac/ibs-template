import { tv } from 'tailwind-variants';

export const stateVariants = tv({
  slots: {
    root: 'flex flex-col items-center justify-center gap-4 text-center h-full',
    iconWrapper: 'flex items-center justify-center rounded-full',
    title: 'font-heading font-semibold text-foreground',
    description: 'text-muted-foreground max-w-sm',
    action: 'mt-2',
  },
  variants: {
    size: {
      sm: {
        root: 'py-8 px-4',
        iconWrapper: 'size-10',
        title: 'text-sm',
        description: 'text-xs',
      },
      md: {
        root: 'py-12 px-6',
        iconWrapper: 'size-12',
        title: 'text-base',
        description: 'text-sm',
      },
      lg: {
        root: 'py-20 px-8',
        iconWrapper: 'size-16',
        title: 'text-lg',
        description: 'text-base',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
