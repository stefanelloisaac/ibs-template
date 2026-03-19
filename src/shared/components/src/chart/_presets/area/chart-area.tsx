import { ErrorBoundary } from '../../../../lib/error-boundary';
import { Chart } from '../../_core/chart';
import type { ChartLayout } from '../../_core/chart.types';
import { chartLineUtils } from '../line/chart-line.utils';
import type { ChartAreaBaseProps } from './chart-area.types';
import { chartAreaVariants } from './chart-area.variants';

const FILL_COLORS = ['fill-chart-1', 'fill-chart-2', 'fill-chart-3', 'fill-chart-4', 'fill-chart-5'];

export function ChartArea(props: ChartAreaBaseProps) {
  const { showDots = true, curveType = 'linear', className, ...rest } = props;

  const styles = chartAreaVariants();
  const pathFn = curveType === 'monotone' ? chartLineUtils.pointsToMonotonePath : chartLineUtils.pointsToLinearPath;

  return (
    <ErrorBoundary>
      <Chart {...rest} className={className}>
        {(layout: ChartLayout) => {
          const { hoveredSeries, activeLabelIndex, yScale } = layout;
          const baseline = yScale(0);

          return (
            <>
              {layout.seriesPoints.map((points, seriesIndex) => {
                if (points.length === 0) return null;
                const linePath = pathFn(points);
                const firstX = points[0].x;
                const lastX = points[points.length - 1].x;
                const areaPath = `${linePath} L ${lastX} ${baseline} L ${firstX} ${baseline} Z`;

                return (
                  <g
                    key={seriesIndex}
                    style={{
                      opacity: hoveredSeries !== null && hoveredSeries !== seriesIndex ? 0.2 : 1,
                      transition: 'opacity 150ms',
                    }}
                  >
                    <path d={areaPath} className={`${styles.area()} ${FILL_COLORS[seriesIndex]}`} />
                    <path
                      d={linePath}
                      className={`${styles.line()} ${chartLineUtils.STROKE_COLORS[seriesIndex]}`}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </g>
                );
              })}

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
