import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useCorrelation } from "@/hooks/useMarketHooks";
import { type MarketIndicator, type PeriodKey, filterSeriesByPeriod } from "@/data/marketData";

const PERIODS: PeriodKey[] = ['1M', '6M', '1Y', '5Y'];

const tooltipStyle = {
  backgroundColor: 'hsl(240, 4%, 14%)',
  border: '1px solid hsl(240, 3%, 20%)',
  borderRadius: '4px',
  fontSize: 11,
  color: 'hsl(37, 45%, 93%)',
};

const axisTick = { fontSize: 10, fill: 'hsl(156, 4%, 60%)' };

interface CorrelationPanelProps {
  indicatorA: MarketIndicator;
  indicatorB: MarketIndicator;
  labelA: string;
  labelB: string;
  colorA?: string;
  colorB?: string;
}

const CorrelationPanel = ({
  indicatorA,
  indicatorB,
  labelA,
  labelB,
  colorA = 'hsl(191, 67%, 40%)',
  colorB = 'hsl(30, 55%, 46%)',
}: CorrelationPanelProps) => {
  const [period, setPeriod] = useState<PeriodKey>('1Y');
  const { coefficient, label, alignedData } = useCorrelation(indicatorA, indicatorB, period);

  const tickInterval = Math.max(1, Math.floor(alignedData.length / 6));

  const correlationColorClass =
    label.color === 'positive' ? 'text-positive' :
    label.color === 'negative' ? 'text-negative' :
    label.color === 'info' ? 'text-info' : 'text-muted-foreground';

  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {labelA} × {labelB}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-data text-lg font-bold text-foreground">
              r = {coefficient.toFixed(3)}
            </span>
            <span className={`font-data text-[10px] font-semibold uppercase ${correlationColorClass}`}>
              {label.text}
            </span>
          </div>
        </div>
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

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={alignedData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3%, 20%)" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => d.slice(2, 7)}
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: 'hsl(240, 3%, 20%)' }}
            interval={tickInterval}
          />
          <YAxis yAxisId="left" tick={axisTick} tickLine={false} axisLine={false} domain={['auto', 'auto']} width={60} />
          <YAxis yAxisId="right" orientation="right" tick={axisTick} tickLine={false} axisLine={false} domain={['auto', 'auto']} width={50} />
          <Tooltip contentStyle={tooltipStyle} labelFormatter={(l) => `Data: ${l}`} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Line yAxisId="left" type="monotone" dataKey="a" stroke={colorA} strokeWidth={1.5} dot={false} name={labelA} />
          <Line yAxisId="right" type="monotone" dataKey="b" stroke={colorB} strokeWidth={1.5} dot={false} name={labelB} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CorrelationPanel;
