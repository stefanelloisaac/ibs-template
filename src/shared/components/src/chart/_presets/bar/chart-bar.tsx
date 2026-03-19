import { ErrorBoundary } from '../../../../lib/error-boundary';
import { Chart } from '../../_core/chart';
import type { ChartLayout } from '../../_core/chart.types';
import type { ChartBarBaseProps } from './chart-bar.types';
import { chartBarVariants } from './chart-bar.variants';

const FILL_COLORS = ['fill-chart-1', 'fill-chart-2', 'fill-chart-3', 'fill-chart-4', 'fill-chart-5'];

export function ChartBar(props: ChartBarBaseProps) {
  const { className, ...rest } = props;

  const styles = chartBarVariants();

  return (
    <ErrorBoundary>
      <Chart {...rest} className={className} xScaleType='band'>
        {(layout: ChartLayout) => {
          const { hoveredSeries, yScale, xPositions, seriesPoints, plotWidth } = layout;
          const numSeries = seriesPoints.length;
          const baseline = yScale(0);

          if (xPositions.length === 0) return null;
          const step = plotWidth / xPositions.length;
          const groupWidth = step * 0.8;
          const barWidth = groupWidth / numSeries;

          return (
            <>
              {seriesPoints.map((points, seriesIndex) =>
                points.map((point, pointIndex) => {
                  const barHeight = Math.max(0, baseline - point.y);
                  const barX = point.x - groupWidth / 2 + seriesIndex * barWidth;
                  const isDimmed = hoveredSeries !== null && hoveredSeries !== seriesIndex;

                  return (
                    <rect
                      key={`${seriesIndex}-${pointIndex}`}
                      x={barX}
                      y={point.y}
                      width={barWidth}
                      height={barHeight}
                      rx={2}
                      className={`${styles.bar()} ${FILL_COLORS[seriesIndex]}`}
                      style={{
                        opacity: isDimmed ? 0.2 : 0.8,
                        transition: 'opacity 150ms',
                      }}
                    />
                  );
                }),
              )}
            </>
          );
        }}
      </Chart>
    </ErrorBoundary>
  );
}
