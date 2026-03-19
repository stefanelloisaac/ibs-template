import { tv } from 'tailwind-variants';

export const logViewerVariants = tv({
  slots: {
    root: 'flex flex-col h-full w-full border rounded-lg overflow-hidden bg-popover text-popover-foreground',
    scrollArea: 'flex-1 min-h-0 overflow-y-auto',
    emptyState: 'flex items-center justify-center p-8 text-muted-foreground text-sm',
  },
});
