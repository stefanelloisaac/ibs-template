export const chartUtils = {
  CHART_BG_COLORS: ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5'],

  niceTickValues(min: number, max: number, count: number): number[] {
    const range = max - min;
    if (range === 0) return [min];

    const roughStep = range / count;
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const residual = roughStep / magnitude;
    const niceStep =
      residual <= 1.5 ? magnitude : residual <= 3.5 ? 2 * magnitude : residual <= 7.5 ? 5 * magnitude : 10 * magnitude;

    const start = Math.floor(min / niceStep) * niceStep;
    const end = Math.ceil(max / niceStep) * niceStep;
    const ticks: number[] = [];
    for (let v = start; v <= end + niceStep * 0.01; v += niceStep) {
      ticks.push(Math.round(v * 1e10) / 1e10);
    }
    return ticks;
  },
};
