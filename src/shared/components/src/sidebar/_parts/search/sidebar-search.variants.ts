import { tv } from 'tailwind-variants';

export const sidebarSearchVariants = tv({
  slots: {
    root: [
      'hidden open:flex open:flex-col',
      'bg-sidebar-panel text-sidebar-foreground',
      'rounded-xl border border-sidebar-panel-border shadow-2xl',
      'w-full max-w-lg m-auto p-0',
      'open:animate-dialog-in data-closing:animate-dialog-out',
      'backdrop:bg-black/70 backdrop:animate-dialog-overlay-in data-closing:backdrop:animate-dialog-overlay-out',
    ],
    inputWrapper: 'flex items-center gap-2 px-4 py-4 border-b border-sidebar-panel-border',
    searchIcon: 'text-sidebar-rail-foreground shrink-0',
    input: [
      'flex-1 bg-transparent border-none outline-none',
      'text-sm text-sidebar-foreground placeholder:text-sidebar-rail-foreground',
    ],
    resultsList: 'flex flex-col max-h-80 overflow-y-auto py-2',
    resultItem: [
      'flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors',
      'text-sm hover:bg-sidebar-hover',
      'focus-visible:bg-sidebar-hover outline-none',
    ],
    resultIcon: 'flex items-center justify-center w-6 h-6 shrink-0 rounded bg-primary/10 text-primary',
    resultInfo: 'flex flex-col flex-1 min-w-0',
    resultLabel: 'text-sm text-sidebar-foreground truncate',
    resultModule: 'text-xs text-sidebar-rail-foreground',
    emptyState: 'text-sm text-sidebar-rail-foreground text-center py-8',
    footer: [
      'flex items-center gap-4 px-4 py-2',
      'border-t border-sidebar-panel-border',
      'text-xs text-sidebar-rail-foreground',
    ],
    footerHint: 'flex items-center gap-1',
    footerKbd: [
      'inline-flex items-center justify-center min-w-4 h-4 px-1',
      'rounded border border-sidebar-panel-border',
      'text-[10px] font-mono',
    ],
  },
});
