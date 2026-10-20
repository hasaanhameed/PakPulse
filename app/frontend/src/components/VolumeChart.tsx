"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

import { formatCompact, formatNumber, formatShortDate, formatTime } from "@/lib/format";
import { STANCE_META } from "@/lib/labels";
import type { Snapshot, Stance, VolumeBin } from "@/lib/types";
import { useThemeTokens } from "./useThemeTokens";
import styles from "./VolumeChart.module.css";

const BIN_HOURS = 6;
/** Stack order from the baseline up: critical sits on the axis so its trend reads directly. */
const STACK: Stance[] = ["critical", "neutral", "supportive"];
const TOKENS = ["--indus", "--stone", "--kiln", "--rule", "--sage", "--card", "--highlight", "--forest"];

function binEnd(start: string) {
  return new Date(new Date(start).getTime() + BIN_HOURS * 3600_000).toISOString();
}

function ChartTooltip({ active, payload }: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  const bin = payload[0].payload as VolumeBin;
  const total = bin.supportive + bin.neutral + bin.critical;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipTitle}>
        {formatShortDate(bin.start)}, {formatTime(bin.start)} to {formatTime(binEnd(bin.start))}
      </p>
      <ul>
        {[...STACK].reverse().map((s) => (
          <li key={s} className={styles.tooltipRow}>
            <span className={styles.swatch} style={{ background: `var(${STANCE_META[s].token})` }} />
            <span>{STANCE_META[s].label}</span>
            <span className="tabular">{formatNumber(bin[s])}</span>
          </li>
        ))}
        <li className={`${styles.tooltipRow} ${styles.tooltipTotal}`}>
          <span />
          <span>Total</span>
          <span className="tabular">{formatNumber(total)}</span>
        </li>
      </ul>
    </div>
  );
}

interface VolumeChartProps {
  data: VolumeBin[];
  snapshots: Snapshot[];
}

/** Posts per 6-hour window, stacked by stance, with snapshot collection times marked. */
export function VolumeChart({ data, snapshots }: VolumeChartProps) {
  const colors = useThemeTokens(TOKENS);

  // Snapshot n was collected at the start of the first bin of snapshot n+1,
  // and the last snapshot at the end of the final bin.
  const markers = snapshots.map((s, i) => {
    const next = snapshots[i + 1];
    return next
      ? { x: new Date(next.windowStart).toISOString(), position: "start" as const, label: `S${i + 1}` }
      : { x: data[data.length - 1].start, position: "end" as const, label: `S${i + 1}` };
  });

  if (!colors) return <div className={styles.placeholder} aria-hidden="true" />;

  const fill: Record<Stance, string> = {
    supportive: colors["--indus"],
    neutral: colors["--stone"],
    critical: colors["--kiln"],
  };
  const tick = { fill: colors["--sage"], fontSize: 12 };

  return (
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 22, right: 12, bottom: 0, left: 0 }} barCategoryGap={4}>
          <CartesianGrid vertical={false} stroke={colors["--rule"]} strokeWidth={1} />
          <XAxis
            dataKey="start"
            interval={0}
            tickLine={false}
            axisLine={{ stroke: colors["--rule"] }}
            tick={tick}
            tickFormatter={(v: string) => (formatTime(v) === "00:00" ? formatShortDate(v) : "")}
            height={28}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={tick}
            tickFormatter={formatCompact}
            width={36}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...(props as TooltipContentProps<number, string>)} />}
            cursor={{ fill: colors["--highlight"] }}
            isAnimationActive={false}
          />
          {STACK.map((s, i) => (
            <Bar
              key={s}
              dataKey={s}
              name={STANCE_META[s].label}
              stackId="stance"
              fill={fill[s]}
              stroke={colors["--card"]}
              strokeWidth={1}
              maxBarSize={24}
              radius={i === STACK.length - 1 ? [4, 4, 0, 0] : 0}
              isAnimationActive={false}
            />
          ))}
          {markers.map((m) => (
            <ReferenceLine
              key={m.label}
              x={m.x}
              position={m.position}
              stroke={colors["--forest"]}
              strokeWidth={1}
              label={{
                value: m.label,
                position: "top",
                fill: colors["--sage"],
                fontSize: 11,
              }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <details className={styles.table}>
        <summary>Show as table</summary>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th scope="col">Window</th>
                {STACK.map((s) => (
                  <th key={s} scope="col">
                    {STANCE_META[s].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((b) => (
                <tr key={b.start}>
                  <th scope="row">
                    {formatShortDate(b.start)}, {formatTime(b.start)}
                  </th>
                  {STACK.map((s) => (
                    <td key={s} className="tabular">
                      {formatNumber(b[s])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
