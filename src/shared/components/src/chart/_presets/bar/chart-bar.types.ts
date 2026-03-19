import type { VariantProps } from 'tailwind-variants';
import type { ChartBaseProps } from '../../_core/chart.types';
import type { chartBarVariants } from './chart-bar.variants';

export type ChartBarBaseProps = Omit<ChartBaseProps, 'children'> & VariantProps<typeof chartBarVariants>;
