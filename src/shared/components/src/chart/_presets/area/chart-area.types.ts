import type { VariantProps } from 'tailwind-variants';
import type { ChartBaseProps } from '../../_core/chart.types';
import type { chartAreaVariants } from './chart-area.variants';

export type ChartAreaBaseProps = Omit<ChartBaseProps, 'children'> &
  VariantProps<typeof chartAreaVariants> & {
    showDots?: boolean;
    curveType?: 'linear' | 'monotone';
  };
