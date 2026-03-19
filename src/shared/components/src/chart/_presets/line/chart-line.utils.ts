export const chartLineUtils = {
  STROKE_COLORS: ['stroke-chart-1', 'stroke-chart-2', 'stroke-chart-3', 'stroke-chart-4', 'stroke-chart-5'],

  pointsToLinearPath(points: { x: number; y: number }[]): string {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  },

  pointsToMonotonePath(points: { x: number; y: number }[]): string {
    if (points.length < 2) return '';
    if (points.length === 2) return chartLineUtils.pointsToLinearPath(points);

    const n = points.length;
    const dx: number[] = [];
    const dy: number[] = [];
    const m: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      dx.push(points[i + 1].x - points[i].x);
      dy.push(points[i + 1].y - points[i].y);
      m.push(dy[i] / dx[i]);
    }

    const tangents: number[] = [m[0]];
    for (let i = 1; i < n - 1; i++) {
      if (m[i - 1] * m[i] <= 0) {
        tangents.push(0);
      } else {
        tangents.push((m[i - 1] + m[i]) / 2);
      }
    }
    tangents.push(m[n - 2]);

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < n - 1; i++) {
      const seg = dx[i] / 3;
      const cp1x = points[i].x + seg;
      const cp1y = points[i].y + tangents[i] * seg;
      const cp2x = points[i + 1].x - seg;
      const cp2y = points[i + 1].y - tangents[i + 1] * seg;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i + 1].x} ${points[i + 1].y}`;
    }
    return path;
  },
};
