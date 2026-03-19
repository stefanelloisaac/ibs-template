import { tv } from 'tailwind-variants';

export const sidebarPanelNavListVariants = tv({
  slots: {
    root: 'flex-1 overflow-y-auto overflow-x-hidden',
    navList: 'flex flex-col gap-1 py-2',
  },
});
