import React from 'react';
import type { VariantProps } from 'tailwind-variants';
import type { chartVariants } from './chart.variants';

export type ChartSeries = {
  name: string;
  data: number[];
};

export type ChartData = {
  labels: string[];
  series: ChartSeries[];
};

export type ChartLayout = {
  viewBoxWidth: number;
  viewBoxHeight: number;
  margin: { top: number; right: number; bottom: number; left: number };
  plotWidth: number;
  plotHeight: number;
  xPositions: number[];
  yTicks: number[];
  yScale: (value: number) => number;
  seriesPoints: { x: number; y: number; value: number; label: string }[][];
  activeLabelIndex: number | null;
  hoveredSeries: number | null;
};

export type ChartBaseProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof chartVariants> & {
    data: ChartData;
    title: string;
    description: string;
    xScaleType?: 'point' | 'band';
    children: (layout: ChartLayout) => React.ReactNode;
  };
