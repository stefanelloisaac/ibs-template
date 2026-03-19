import { tv } from 'tailwind-variants';

export const notificationTriggerVariants = tv({
  slots: {
    root: [
      'relative inline-flex items-center justify-center rounded-md p-2 cursor-pointer',
      'text-muted-foreground hover:text-foreground hover:bg-accent',
      'focus-visible:ring-2 focus-visible:ring-ring outline-none',
    ],
    badge: [
      'absolute -top-1 -right-1 flex items-center justify-center',
      'min-w-4 h-4 px-1 rounded-full',
      'bg-error text-primary-foreground text-[10px] font-semibold leading-none',
    ],
  },
});
