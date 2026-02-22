import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { correlationData } from "@/data/mockData";

interface CorrelationChartProps {
  type: 'dollar' | 'ore';
}

const CorrelationChart = ({ type }: CorrelationChartProps) => {
  const title = type === 'dollar' ? 'HRC Brasil × USD/BRL' : 'HRC Brasil × Minério 62%';
  const secondKey = type === 'dollar' ? 'usdBrl' : 'minerio';
  const secondLabel = type === 'dollar' ? 'USD/BRL' : 'Minério 62% (USD/t)';
  const secondColor = type === 'dollar' ? '#B87333' : '#8B4513';

  return (
    <div className="rounded-md border border-border bg-card p-4">
      <h3 className="mb-3 font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={correlationData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3%, 20%)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: 'hsl(156, 4%, 60%)' }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(240, 3%, 20%)' }}
            interval={3}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 10, fill: 'hsl(156, 4%, 60%)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 10, fill: 'hsl(156, 4%, 60%)' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(240, 4%, 14%)',
              border: '1px solid hsl(240, 3%, 20%)',
              borderRadius: '4px',
              fontSize: 11,
              color: 'hsl(37, 45%, 93%)',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 10, color: 'hsl(156, 4%, 60%)' }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="hrcBrasil"
            stroke="hsl(191, 67%, 40%)"
            strokeWidth={2}
            dot={false}
            name="HRC Brasil (BRL/t)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={secondKey}
            stroke={secondColor}
            strokeWidth={2}
            dot={false}
            name={secondLabel}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CorrelationChart;
