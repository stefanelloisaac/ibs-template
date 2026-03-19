import { tv } from 'tailwind-variants';

export const popoverMenuVariants = tv({
  slots: {
    root: 'w-fit',
    content: 'p-1',
    menuItem: [
      'flex items-center gap-2 rounded px-2 py-1.5 text-sm cursor-pointer select-none w-full',
      'text-foreground hover:bg-muted',
      'outline-none focus-visible:bg-muted',
      'transition-colors',
    ],
    separator: 'my-1 h-px bg-border',
    submenuTrigger: [
      'flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm cursor-pointer select-none w-full',
      'text-foreground hover:bg-muted',
      'outline-none focus-visible:bg-muted',
      'transition-colors',
    ],
    submenu: ['absolute left-full -top-1.5', 'min-w-32 rounded-md border border-border bg-popover p-1 shadow-md'],
  },
  variants: {
    active: {
      true: {},
    },
  },
  compoundSlots: [{ slots: ['menuItem'], active: true, className: 'text-primary' }],
  defaultVariants: {
    active: false,
  },
});
