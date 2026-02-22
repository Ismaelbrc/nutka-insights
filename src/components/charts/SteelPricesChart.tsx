import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { type MarketIndicator, type PeriodKey, filterSeriesByPeriod } from "@/data/marketData";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const PERIODS: PeriodKey[] = ['1M', '6M', '1Y', '5Y'];

const tooltipStyle = {
  backgroundColor: 'hsl(240, 4%, 14%)',
  border: '1px solid hsl(240, 3%, 20%)',
  borderRadius: '4px',
  fontSize: 11,
  color: 'hsl(37, 45%, 93%)',
};

const axisTick = { fontSize: 10, fill: 'hsl(156, 4%, 60%)' };

interface SteelPricesChartProps {
  rebar: MarketIndicator;
  wireRod: MarketIndicator;
  ironOre: MarketIndicator;
}

const SteelPricesChart = ({ rebar, wireRod, ironOre }: SteelPricesChartProps) => {
  const [period, setPeriod] = useState<PeriodKey>('1Y');

  const chartData = useMemo(() => {
    const rebarSeries = filterSeriesByPeriod(rebar.series, period);
    const wireMap = new Map(filterSeriesByPeriod(wireRod.series, period).map(p => [p.date, p.value]));
    const oreMap = new Map(filterSeriesByPeriod(ironOre.series, period).map(p => [p.date, p.value]));

    return rebarSeries
      .filter(p => wireMap.has(p.date) && oreMap.has(p.date))
      .map(p => ({
        date: p.date,
        rebar: p.value,
        wireRod: wireMap.get(p.date)!,
        ironOre: oreMap.get(p.date)!,
      }));
  }, [rebar, wireRod, ironOre, period]);

  const tickInterval = Math.max(1, Math.floor(chartData.length / 8));

  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Preços de Aço Longo × Minério
          </h3>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px] text-xs">
                  Dados são mockados para layout funcional. Futuramente integrado a APIs reais.
                  Fonte: Instituto Aço Brasil (simulado).
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
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

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3%, 20%)" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => d.slice(2, 7)}
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: 'hsl(240, 3%, 20%)' }}
            interval={tickInterval}
          />
          <YAxis
            yAxisId="brl"
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            width={65}
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            label={{ value: 'BRL/t', angle: -90, position: 'insideLeft', style: { fontSize: 9, fill: 'hsl(156, 4%, 60%)' } }}
          />
          <YAxis
            yAxisId="usd"
            orientation="right"
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            width={50}
            label={{ value: 'USD/t', angle: 90, position: 'insideRight', style: { fontSize: 9, fill: 'hsl(156, 4%, 60%)' } }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelFormatter={(l) => `Data: ${l}`}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                rebar: 'Vergalhão (BRL/t)',
                wireRod: 'Fio-Máquina (BRL/t)',
                ironOre: 'Minério 62% (USD/t)',
              };
              return [`${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, labels[name] || name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Line
            yAxisId="brl"
            type="monotone"
            dataKey="rebar"
            stroke="hsl(191, 67%, 40%)"
            strokeWidth={1.5}
            strokeDasharray="8 4"
            dot={false}
            name="Vergalhão (BRL/t)"
          />
          <Line
            yAxisId="brl"
            type="monotone"
            dataKey="wireRod"
            stroke="hsl(142, 71%, 45%)"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            dot={false}
            name="Fio-Máquina (BRL/t)"
          />
          <Line
            yAxisId="usd"
            type="monotone"
            dataKey="ironOre"
            stroke="hsl(30, 55%, 46%)"
            strokeWidth={2}
            dot={false}
            name="Minério 62% (USD/t)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SteelPricesChart;
