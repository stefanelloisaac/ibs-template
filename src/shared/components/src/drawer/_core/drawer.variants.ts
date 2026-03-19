import { tv } from 'tailwind-variants';

export const drawerVariants = tv({
  slots: {
    root: [
      'bg-popover text-popover-foreground',
      'hidden open:flex open:flex-col gap-4',
      'border shadow-lg',
      'p-4 fixed m-0',
      'max-h-dvh max-w-none',
      'backdrop:bg-black/70 backdrop:animate-dialog-overlay-in data-closing:backdrop:animate-dialog-overlay-out',
    ],
  },
  variants: {
    placement: {
      right: {
        root: [
          'inset-y-0 right-0 left-auto h-dvh rounded-l-lg border-r-0',
          'open:animate-drawer-right-in data-closing:animate-drawer-right-out',
        ],
      },
      left: {
        root: [
          'inset-y-0 left-0 right-auto h-dvh rounded-r-lg border-l-0',
          'open:animate-drawer-left-in data-closing:animate-drawer-left-out',
        ],
      },
      top: {
        root: [
          'inset-x-0 top-0 bottom-auto w-full rounded-b-lg border-t-0',
          'open:animate-drawer-top-in data-closing:animate-drawer-top-out',
        ],
      },
      bottom: {
        root: [
          'inset-x-0 bottom-0 top-auto w-full rounded-t-lg border-b-0',
          'open:animate-drawer-bottom-in data-closing:animate-drawer-bottom-out',
        ],
      },
    },
    size: {
      sm: { root: '' },
      md: { root: '' },
      lg: { root: '' },
      xl: { root: '' },
      full: { root: '' },
    },
  },
  compoundVariants: [
    { placement: 'right', size: 'sm', class: { root: 'w-80' } },
    { placement: 'right', size: 'md', class: { root: 'w-96' } },
    { placement: 'right', size: 'lg', class: { root: 'w-md' } },
    { placement: 'right', size: 'xl', class: { root: 'w-lg' } },
    { placement: 'right', size: 'full', class: { root: 'w-dvw' } },
    { placement: 'left', size: 'sm', class: { root: 'w-80' } },
    { placement: 'left', size: 'md', class: { root: 'w-96' } },
    { placement: 'left', size: 'lg', class: { root: 'w-md' } },
    { placement: 'left', size: 'xl', class: { root: 'w-lg' } },
    { placement: 'left', size: 'full', class: { root: 'w-dvw' } },
    { placement: 'top', size: 'sm', class: { root: 'h-60' } },
    { placement: 'top', size: 'md', class: { root: 'h-80' } },
    { placement: 'top', size: 'lg', class: { root: 'h-96' } },
    { placement: 'top', size: 'xl', class: { root: 'h-lg' } },
    { placement: 'top', size: 'full', class: { root: 'h-dvh' } },
    { placement: 'bottom', size: 'sm', class: { root: 'h-60' } },
    { placement: 'bottom', size: 'md', class: { root: 'h-80' } },
    { placement: 'bottom', size: 'lg', class: { root: 'h-96' } },
    { placement: 'bottom', size: 'xl', class: { root: 'h-lg' } },
    { placement: 'bottom', size: 'full', class: { root: 'h-dvh' } },
  ],
  defaultVariants: {
    placement: 'right',
    size: 'md',
  },
});
