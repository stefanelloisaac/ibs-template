import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../card';
import type { ChartBaseProps, ChartLayout } from './chart.types';
import { chartUtils } from './chart.utils';
import { chartVariants } from './chart.variants';

export function Chart(props: ChartBaseProps) {
  const { className, size, title, description, data, children, id, ref, xScaleType = 'point', ...rest } = props;

  const generatedId = useId();
  const chartId = id || generatedId;
  const styles = chartVariants({ size });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgSize, setSvgSize] = useState({ width: 600, height: 288 });
  const [activeLabelIndex, setActiveLabelIndex] = useState<number | null>(null);
  const [hoveredSeries, setHoveredSeries] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setSvgSize({ width: Math.round(width), height: Math.round(height) });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => {
    const viewBoxWidth = svgSize.width;
    const viewBoxHeight = svgSize.height;
    const margin = { top: 16, right: 16, bottom: 32, left: 48 };
    const plotWidth = viewBoxWidth - margin.left - margin.right;
    const plotHeight = viewBoxHeight - margin.top - margin.bottom;

    const allValues = data.series.flatMap((s) => s.data);
    const dataMin = Math.min(...allValues);
    const dataMax = Math.max(...allValues);

    const range = dataMax - dataMin;
    const yMin = range === 0 ? dataMin - 1 : dataMin >= 0 ? 0 : dataMin - range * 0.1;
    const yMax = range === 0 ? dataMax + 1 : dataMax + range * 0.1 || 1;

    const yTicks = chartUtils.niceTickValues(yMin, yMax, 5);

    const xStep =
      xScaleType === 'band' ? plotWidth / data.labels.length : plotWidth / Math.max(data.labels.length - 1, 1);
    const xPositions = data.labels.map((_, i) =>
      xScaleType === 'band' ? margin.left + xStep * (i + 0.5) : margin.left + i * xStep,
    );

    const yScale = (value: number) => {
      const ratio = (value - yMin) / (yMax - yMin);
      return margin.top + plotHeight - ratio * plotHeight;
    };

    const seriesPoints = data.series.map((series) =>
      series.data.map((value, i) => ({
        x: xPositions[i],
        y: yScale(value),
        value,
        label: data.labels[i],
      })),
    );

    return { viewBoxWidth, viewBoxHeight, margin, plotWidth, plotHeight, xPositions, yTicks, yScale, seriesPoints };
  }, [data, svgSize, xScaleType]);

  const findNearestLabelIndex = useCallback(
    (clientX: number) => {
      const svg = svgRef.current;
      if (!svg) return null;

      const rect = svg.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      const svgX = ratio * layout.viewBoxWidth;

      let closest = 0;
      let minDist = Infinity;
      for (let i = 0; i < layout.xPositions.length; i++) {
        const dist = Math.abs(svgX - layout.xPositions[i]);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }
      return closest;
    },
    [layout.viewBoxWidth, layout.xPositions],
  );

  const handleSvgMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const idx = findNearestLabelIndex(e.clientX);
      if (idx === null) return;
      setActiveLabelIndex(idx);

      if (!wrapperRef.current) return;
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const svg = svgRef.current!;
      const svgRect = svg.getBoundingClientRect();

      const xRatio = layout.xPositions[idx] / layout.viewBoxWidth;
      const x = svgRect.left + xRatio * svgRect.width - wrapperRect.left;
      const y = e.clientY - wrapperRect.top;

      setTooltipPos({ x, y });
    },
    [findNearestLabelIndex, layout.xPositions, layout.viewBoxWidth],
  );

  const handleSvgMouseLeave = useCallback(() => {
    setActiveLabelIndex(null);
    setTooltipPos(null);
  }, []);

  const fullLayout: ChartLayout = {
    ...layout,
    activeLabelIndex,
    hoveredSeries,
  };

  return (
    <ErrorBoundary>
      <Card ref={ref} id={chartId} data-slot='chart' className={styles.root({ className })} {...rest}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>

        <CardContent>
          <div ref={wrapperRef} className={styles.chartWrapper()}>
            <svg
              ref={svgRef}
              className={styles.svg()}
              viewBox={`0 0 ${layout.viewBoxWidth} ${layout.viewBoxHeight}`}
              preserveAspectRatio='none'
              role='img'
              aria-label={`Chart: ${title}`}
              onMouseMove={handleSvgMouseMove}
              onMouseLeave={handleSvgMouseLeave}
            >
              {layout.yTicks.map((tick) => (
                <line
                  key={tick}
                  x1={layout.margin.left}
                  y1={layout.yScale(tick)}
                  x2={layout.viewBoxWidth - layout.margin.right}
                  y2={layout.yScale(tick)}
                  className={styles.gridLine()}
                  strokeDasharray='4 4'
                />
              ))}

              {layout.yTicks.map((tick) => (
                <text
                  key={tick}
                  x={layout.margin.left - 8}
                  y={layout.yScale(tick)}
                  textAnchor='end'
                  dominantBaseline='middle'
                  className={styles.axisLabel()}
                  fontSize={11}
                >
                  {tick}
                </text>
              ))}

              {data.labels.map((label, i) => (
                <text
                  key={i}
                  x={layout.xPositions[i]}
                  y={layout.viewBoxHeight - 8}
                  textAnchor='middle'
                  className={styles.axisLabel()}
                  fontSize={11}
                >
                  {label}
                </text>
              ))}

              {children(fullLayout)}

              {activeLabelIndex !== null && (
                <line
                  x1={layout.xPositions[activeLabelIndex]}
                  y1={layout.margin.top}
                  x2={layout.xPositions[activeLabelIndex]}
                  y2={layout.viewBoxHeight - layout.margin.bottom}
                  className={styles.indicator()}
                  strokeDasharray='4 4'
                />
              )}
            </svg>

            {activeLabelIndex !== null && tooltipPos && (
              <div
                className={styles.tooltip()}
                style={{
                  left: tooltipPos.x,
                  top: tooltipPos.y,
                  transform: 'translate(-50%, -100%) translateY(-8px)',
                }}
              >
                <p className={styles.tooltipLabel()}>{data.labels[activeLabelIndex]}</p>
                {data.series.map((series, i) => (
                  <div
                    key={i}
                    className={styles.tooltipItem()}
                    style={{ opacity: hoveredSeries !== null && hoveredSeries !== i ? 0.4 : 1 }}
                  >
                    <span className={`${styles.tooltipDot()} ${chartUtils.CHART_BG_COLORS[i]}`} />
                    <span>{series.name}</span>
                    <span className={styles.tooltipValue()}>{series.data[activeLabelIndex]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter justify='center'>
          <div className={styles.legend()}>
            {data.series.map((series, i) => (
              <div
                key={i}
                className={styles.legendItem()}
                style={{ opacity: hoveredSeries !== null && hoveredSeries !== i ? 0.4 : 1 }}
                onMouseEnter={() => setHoveredSeries(i)}
                onMouseLeave={() => setHoveredSeries(null)}
              >
                <span className={`${styles.legendDot()} ${chartUtils.CHART_BG_COLORS[i]}`} />
                <span>{series.name}</span>
              </div>
            ))}
          </div>
        </CardFooter>
      </Card>
    </ErrorBoundary>
  );
}
