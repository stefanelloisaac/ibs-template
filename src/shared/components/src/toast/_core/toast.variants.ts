import { tv } from 'tailwind-variants';

export const toastVariants = tv({
  slots: {
    root: [
      'pointer-events-auto relative flex items-start gap-4 rounded-lg border p-4 shadow-lg',
      'bg-popover text-popover-foreground',
      'w-80',
      'animate-toast-in data-closing:animate-toast-out',
    ],
    icon: 'mt-0.5 shrink-0 size-4',
    content: 'flex flex-1 flex-col gap-1',
    title: 'text-sm font-semibold',
    description: 'text-sm text-muted-foreground',
    closeButton: [
      'absolute right-2 top-2 cursor-pointer rounded-md p-1',
      'text-muted-foreground hover:text-foreground',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none',
    ],
  },
  variants: {
    intent: {
      success: { root: 'border-success/30', icon: 'text-success' },
      error: { root: 'border-error/30', icon: 'text-error' },
      warning: { root: 'border-warning/30', icon: 'text-warning' },
      info: { root: 'border-info/30', icon: 'text-info' },
    },
  },
  defaultVariants: {
    intent: 'info',
  },
});
