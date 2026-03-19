import { tv } from 'tailwind-variants';

export const notificationPanelVariants = tv({
  slots: {
    root: 'flex flex-col w-80 max-h-96 overflow-hidden bg-popover text-popover-foreground border rounded-lg shadow-lg',
    header: 'flex items-center justify-between p-2 border-b',
    headerTitle: 'text-sm font-semibold',
    headerActions: 'flex items-center gap-1',
    headerButton: 'text-xs px-2 py-1 rounded-md hover:bg-accent cursor-pointer transition-colors',
    scrollArea: 'flex-1 overflow-y-auto overflow-x-hidden',
    emptyState: 'flex flex-col items-center justify-center py-8 text-muted-foreground text-sm',
  },
});
