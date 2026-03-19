import { tv } from 'tailwind-variants';

export const logViewerToolbarVariants = tv({
  slots: {
    root: 'flex items-center gap-2 p-2 border-b bg-muted/30',
    searchWrapper: 'flex-1 [&>div]:pb-0',
    filterGroup: 'flex items-center gap-1',
  },
});
