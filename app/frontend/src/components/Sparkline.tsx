interface SparklineProps {
  values: number[];
  /** Shared top of the scale, so lines in one list are comparable. Defaults to this line's own maximum. */
  max?: number;
  label: string;
}

/** A tiny trend line, one point per collection round, with the latest point marked. */
export function Sparkline({ values, max, label }: SparklineProps) {
  const top = max ?? Math.max(...values, 1);
  const w = 64;
  const step = values.length > 1 ? (w - 4) / (values.length - 1) : 0;
  const pts = values.map((v, i) => [2 + i * step, 22 - (v / top) * 18] as const);
  const last = pts[pts.length - 1];
  return (
    <svg width="72" height="26" viewBox="0 0 64 26" role="img" aria-label={label} style={{ flex: "none" }}>
      <polyline
        points={pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}
        fill="none"
        stroke="var(--sage)"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {last && <circle cx={last[0]} cy={last[1]} r={2.6} fill="var(--forest)" />}
    </svg>
  );
}
