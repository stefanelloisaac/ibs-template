import { tv } from 'tailwind-variants';

export const tooltipVariants = tv({
  slots: {
    root: 'relative inline-flex',
    tooltip: [
      'absolute border border-primary z-50 px-3 py-1 rounded-md',
      'bg-background text-foreground',
      'text-xs font-medium whitespace-nowrap',
      'pointer-events-none',
      'animate-tooltip-in data-closing:animate-tooltip-out',
    ],
  },
  variants: {
    placement: {
      top: {
        tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-0.5',
      },
      bottom: {
        tooltip: 'top-full left-1/2 -translate-x-1/2 mt-0.5',
      },
      left: {
        tooltip: 'right-full top-1/2 -translate-y-1/2 mr-0.5',
      },
      right: {
        tooltip: 'left-full top-1/2 -translate-y-1/2 ml-0.5',
      },
    },
  },
  defaultVariants: {
    placement: 'top',
  },
});
