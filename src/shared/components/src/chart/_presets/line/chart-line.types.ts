import type { VariantProps } from 'tailwind-variants';
import type { ChartBaseProps } from '../../_core/chart.types';
import type { chartLineVariants } from './chart-line.variants';

export type ChartLineBaseProps = Omit<ChartBaseProps, 'children'> &
  VariantProps<typeof chartLineVariants> & {
    showDots?: boolean;
    curveType?: 'linear' | 'monotone';
  };
