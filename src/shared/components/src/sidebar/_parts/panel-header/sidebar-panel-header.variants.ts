import { tv } from 'tailwind-variants';

export const sidebarPanelHeaderVariants = tv({
  slots: {
    brand: 'px-6 pt-4 pb-2',
    brandLogo: 'h-8 max-w-full w-auto object-contain',
    header: 'flex items-center gap-2 px-4 py-4 border-b border-sidebar-panel-border',
    headerIcon: 'flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15 text-primary',
    headerInfo: 'flex flex-col flex-1',
    headerLabel: 'text-sm font-semibold text-sidebar-foreground',
    headerCount: 'text-xs text-sidebar-rail-foreground',
    headerClose: [
      'flex items-center justify-center w-6 h-6 rounded-md cursor-pointer',
      'text-sidebar-rail-foreground hover:text-sidebar-foreground hover:bg-primary/10',
      'transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
    ],
  },
});
