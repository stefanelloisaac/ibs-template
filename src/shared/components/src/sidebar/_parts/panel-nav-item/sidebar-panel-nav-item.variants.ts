import { tv } from 'tailwind-variants';

export const sidebarPanelNavItemVariants = tv({
  slots: {
    navItem: [
      'flex items-center gap-4 px-4 py-2.5 cursor-pointer transition-colors rounded-md',
      'hover:bg-primary/10',
      'focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none',
    ],
    navNumber:
      'flex items-center justify-center w-7 h-7 rounded-lg text-xs font-semibold shrink-0 text-primary bg-primary/15',
    navLabel: 'text-sm font-medium text-sidebar-foreground',
    navDescription: 'text-xs text-sidebar-rail-foreground',
    navChevron: ['w-4 h-4 shrink-0 transition-transform duration-150', 'text-sidebar-rail-foreground'],
    navChildren: 'flex flex-col gap-0.5 pl-10 mt-1',
    navChildItem: [
      'flex items-center px-4 py-1.5 cursor-pointer transition-colors rounded-md',
      'text-sm text-sidebar-rail-foreground',
      'hover:text-sidebar-foreground hover:bg-primary/10',
      'focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none',
    ],
  },
});
