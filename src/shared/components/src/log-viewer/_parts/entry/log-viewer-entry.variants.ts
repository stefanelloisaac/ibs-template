import { tv } from 'tailwind-variants';

export const logViewerEntryVariants = tv({
  slots: {
    root: 'flex flex-col border-b border-border/50 last:border-b-0',
    row: 'flex items-center gap-4 px-4 py-2',
    timestamp: 'shrink-0 text-xs text-muted-foreground font-mono tabular-nums',
    icon: 'shrink-0 size-4',
    content: 'flex-1 min-w-0',
    message: 'text-sm wrap-break-word',
    source: 'text-xs text-muted-foreground',
    expandButton: [
      'ml-auto shrink-0 flex items-center justify-center size-6 rounded-md',
      'text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer',
      'transition-colors duration-150',
    ],
    detail: 'grid transition-[grid-template-rows] duration-200 ease-out',
    detailInner: 'overflow-hidden',
    detailContent: 'px-4 py-2 text-xs text-muted-foreground border-t border-border/50',
  },
  variants: {
    severity: {
      success: { icon: 'text-success' },
      error: { icon: 'text-error', root: 'bg-error/5' },
      warning: { icon: 'text-warning' },
      info: { icon: 'text-info' },
    },
  },
  defaultVariants: {
    severity: 'info',
  },
});
