import { tv } from 'tailwind-variants';

export const notificationItemVariants = tv({
  slots: {
    root: [
      'flex flex-col gap-1 px-2 py-2 border-b border-border/50 last:border-b-0 cursor-pointer',
      'animate-notification-in data-closing:animate-notification-out',
    ],
    titleRow: 'flex items-center gap-2',
    icon: 'shrink-0 size-4',
    title: 'text-sm font-medium truncate',
    timestamp: 'shrink-0 text-xs text-muted-foreground ml-auto',
    dismissButton: [
      'shrink-0 text-muted-foreground hover:text-foreground cursor-pointer rounded-md p-1',
      'focus-visible:ring-2 focus-visible:ring-ring outline-none',
    ],
    description: 'text-xs text-muted-foreground line-clamp-2 pl-6',
  },
  variants: {
    intent: {
      success: { icon: 'text-success' },
      error: { icon: 'text-error' },
      warning: { icon: 'text-warning' },
      info: { icon: 'text-info' },
    },
    read: {
      true: { root: 'opacity-70 border-l-2 border-l-transparent', title: 'font-normal' },
      false: { root: 'bg-accent/30 border-l-2 border-l-primary' },
    },
  },
  defaultVariants: {
    intent: 'info',
    read: false,
  },
});
