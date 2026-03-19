import { tv } from 'tailwind-variants';

export const chartVariants = tv({
  slots: {
    root: 'w-full',
    chartWrapper: 'relative',
    svg: 'block w-full',
    gridLine: 'stroke-border',
    axisLabel: 'fill-muted-foreground',
    indicator: 'stroke-muted-foreground/50',
    tooltip: [
      'absolute pointer-events-none z-50',
      'bg-popover text-popover-foreground',
      'border rounded-md shadow-md',
      'px-2 py-2 text-sm',
    ],
    tooltipLabel: 'font-medium text-xs text-muted-foreground',
    tooltipItem: 'flex items-center gap-2 text-sm',
    tooltipDot: 'size-2 rounded-full shrink-0',
    tooltipValue: 'font-medium tabular-nums',
    legend: 'flex flex-wrap items-center justify-center gap-4 px-2',
    legendItem: 'flex items-center gap-2 text-sm text-muted-foreground cursor-pointer transition-opacity duration-150',
    legendDot: 'size-2 rounded-full shrink-0',
  },

  variants: {
    size: {
      sm: { svg: 'h-48' },
      md: { svg: 'h-72' },
      lg: { svg: 'h-96' },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});
