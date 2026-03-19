import { tv } from 'tailwind-variants';

export const sidebarRailItemVariants = tv({
  slots: {
    root: [
      'relative flex items-center justify-center w-10 h-10',
      'rounded-lg cursor-pointer transition-colors',
      'text-sidebar-rail-foreground hover:bg-sidebar-hover',
      'focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none',
      'border-l-2 border-transparent',
    ],
  },
  variants: {
    active: {
      true: { root: 'text-primary bg-primary/10 border-l-primary' },
      false: {},
    },
  },
  defaultVariants: {
    active: false,
  },
});
