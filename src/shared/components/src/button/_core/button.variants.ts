import { tv } from 'tailwind-variants';

export const buttonVariants = tv({
  slots: {
    root: [
      'inline-flex items-center justify-center gap-2 min-w-24',
      'whitespace-nowrap rounded-md text-sm font-medium',
      'transition-all outline-none',
      'disabled:pointer-events-none disabled:opacity-50',
      "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:text-current",
      'shrink-0 [&_svg]:shrink-0',
      'focus-visible:border-ring focus-visible:ring-ring/70 focus-visible:ring-[3px]',
      'cursor-pointer',
    ],
  },
  variants: {
    size: {
      xs: { root: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3" },
      sm: { root: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5' },
      md: { root: 'h-9 px-4 py-2 has-[>svg]:px-3' },
      lg: { root: 'h-10 rounded-md px-6 has-[>svg]:px-4' },
      'icon-xs': { root: "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3" },
      'icon-sm': { root: 'size-8' },
      'icon-md': { root: 'size-9' },
      'icon-lg': { root: 'size-10' },
    },
    fullWidth: {
      true: { root: 'w-full' },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    fullWidth: false,
  },
});
