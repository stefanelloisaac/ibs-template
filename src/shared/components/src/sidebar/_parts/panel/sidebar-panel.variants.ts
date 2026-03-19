import { tv } from 'tailwind-variants';

export const sidebarPanelVariants = tv({
  slots: {
    root: [
      'fixed top-4 bottom-4 left-16 w-75 rounded-xl',
      'bg-sidebar-panel/20 backdrop-blur-xl',
      'border border-sidebar-panel-border',
      'text-sidebar-foreground',
      'flex flex-col',
      'z-100 shadow-lg',
      'invisible',
      'data-open:visible data-open:animate-sidebar-panel-in',
      'data-closing:visible data-closing:animate-sidebar-panel-out',
    ],
    scrollArea: 'flex-1 flex flex-col overflow-hidden',
    footer: [
      'flex items-center justify-center gap-4 px-4 py-2',
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
