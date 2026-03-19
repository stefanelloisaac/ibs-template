import { ErrorBoundary } from '../../../../lib/error-boundary';
import { Chart } from '../../_core/chart';
import type { ChartLayout } from '../../_core/chart.types';
import type { ChartLineBaseProps } from './chart-line.types';
import { chartLineUtils } from './chart-line.utils';
import { chartLineVariants } from './chart-line.variants';

export function ChartLine(props: ChartLineBaseProps) {
  const { showDots = true, curveType = 'linear', className, ...rest } = props;

  const styles = chartLineVariants();
  const pathFn = curveType === 'monotone' ? chartLineUtils.pointsToMonotonePath : chartLineUtils.pointsToLinearPath;

  return (
    <ErrorBoundary>
      <Chart {...rest} className={className}>
        {(layout: ChartLayout) => {
          const { hoveredSeries, activeLabelIndex } = layout;

          return (
            <>
              {layout.seriesPoints.map((points, seriesIndex) => (
                <path
                  key={seriesIndex}
                  d={pathFn(points)}
                  className={`${styles.line()} ${chartLineUtils.STROKE_COLORS[seriesIndex]}`}
                  style={{
                    opacity: hoveredSeries !== null && hoveredSeries !== seriesIndex ? 0.2 : 1,
                    transition: 'opacity 150ms',
                  }}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              ))}

              {showDots &&
                layout.seriesPoints.map((points, seriesIndex) =>
                  points.map((point, pointIndex) => {
                    const isActive = activeLabelIndex === pointIndex;
                    const isDimmed = hoveredSeries !== null && hoveredSeries !== seriesIndex;

                    return (
                      <circle
                        key={`${seriesIndex}-${pointIndex}`}
                        cx={point.x}
                        cy={point.y}
                        r={isActive ? 6 : 4}
                        className={`${styles.dot()} ${chartLineUtils.STROKE_COLORS[seriesIndex]} fill-card`}
                        style={{
                          opacity: isDimmed ? 0.2 : 1,
                          transition: 'r 150ms, opacity 150ms',
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
