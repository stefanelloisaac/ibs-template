import { tv } from 'tailwind-variants';

export const loaderVariants = tv({
  slots: {
    root: 'flex flex-col items-center justify-center',
    spinner: '',
    message: 'text-muted-foreground font-semibold animate-pulse',
  },
  variants: {
    size: {
      sm: {
        root: 'gap-2',
        spinner: 'size-8',
        message: 'text-sm',
      },
      md: {
        root: 'gap-4',
        spinner: 'size-10',
        message: 'text-base',
      },
      lg: {
        root: 'gap-4',
        spinner: 'size-12',
        message: 'text-base',
      },
      xl: {
        root: 'gap-4',
        spinner: 'size-16',
        message: 'text-lg',
      },
    },
    overlay: {
      true: { root: 'absolute inset-0 z-20 rounded-[inherit] bg-background/80 backdrop-blur-[1px]' },
      false: {},
    },
    fullScreen: {
      true: { root: 'fixed inset-0 z-50 bg-background/80 backdrop-blur-[1px]' },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    overlay: false,
    fullScreen: false,
  },
});
