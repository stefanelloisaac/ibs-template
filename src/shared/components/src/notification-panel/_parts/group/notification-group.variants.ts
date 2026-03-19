import { tv } from 'tailwind-variants';

export const notificationGroupVariants = tv({
  slots: {
    root: 'flex flex-col',
    label: 'sticky top-0 z-10 px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted/50 border-b',
  },
});
