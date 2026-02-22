import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush,
} from "recharts";
import { type TimeSeriesPoint, type PeriodKey, filterSeriesByPeriod } from "@/data/marketData";

const PERIODS: PeriodKey[] = ['1D', '5D', '1M', '6M', '1Y', '5Y'];

const tooltipStyle = {
  backgroundColor: 'hsl(240, 4%, 14%)',
  border: '1px solid hsl(240, 3%, 20%)',
  borderRadius: '4px',
  fontSize: 11,
  color: 'hsl(37, 45%, 93%)',
};

const axisTick = { fontSize: 10, fill: 'hsl(156, 4%, 60%)' };

interface TimeSeriesChartProps {
  title: string;
  series: TimeSeriesPoint[];
  unit?: string;
  color?: string;
  height?: number;
}

const TimeSeriesChart = ({ title, series, unit = '', color = 'hsl(191, 67%, 40%)', height = 260 }: TimeSeriesChartProps) => {
  const [period, setPeriod] = useState<PeriodKey>('1Y');

  const filteredData = useMemo(() => filterSeriesByPeriod(series, period), [series, period]);

  const formatDate = (dateStr: string) => {
    if (period === '1D' || period === '5D') return dateStr.slice(5);
    if (period === '1M') return dateStr.slice(5);
    return dateStr.slice(2, 7);
  };

  // Calculate interval for x-axis ticks
  const tickInterval = Math.max(1, Math.floor(filteredData.length / 8));

  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        <div className="flex gap-0.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded px-2 py-0.5 font-data text-[10px] font-medium transition-colors ${
                period === p
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {filteredData.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={filteredData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3%, 20%)" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={axisTick}
              tickLine={false}
              axisLine={{ stroke: 'hsl(240, 3%, 20%)' }}
              interval={tickInterval}
            />
            <YAxis
              tick={axisTick}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `${v.toLocaleString('pt-BR')}${unit ? ` ${unit}` : ''}`}
              width={70}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={(label) => `Data: ${label}`}
              formatter={(value: number) => [
                `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ${unit}`,
                title,
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, fill: color, stroke: 'hsl(240, 4%, 14%)', strokeWidth: 2 }}
            />
            {filteredData.length > 60 && (
              <Brush
                dataKey="date"
                height={20}
                stroke="hsl(191, 67%, 29%)"
                fill="hsl(240, 3%, 14%)"
                tickFormatter={formatDate}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center" style={{ height }}>
          <span className="font-data text-xs text-muted-foreground">Sem dados para o período</span>
        </div>
      )}
    </div>
  );
};

export default TimeSeriesChart;
