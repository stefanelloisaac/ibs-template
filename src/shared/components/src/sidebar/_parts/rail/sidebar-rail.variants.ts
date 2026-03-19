import { tv } from 'tailwind-variants';

export const sidebarRailVariants = tv({
  slots: {
    root: [
      'flex flex-col items-center w-15 h-dvh shrink-0',
      'bg-sidebar-rail text-sidebar-rail-foreground',
      'border-r border-sidebar-panel-border',
      'py-4 gap-2',
      'z-20',
    ],
    logo: 'flex items-center justify-center w-10 h-10 mb-4',
    moduleList: 'flex flex-col items-center gap-2 flex-1',
    footer: 'flex flex-col items-center gap-2 mt-auto',
  },
});
