import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { consumptionApparentData, getQuarterlyConsumption } from "@/data/marketData";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const tooltipStyle = {
  backgroundColor: 'hsl(240, 4%, 14%)',
  border: '1px solid hsl(240, 3%, 20%)',
  borderRadius: '4px',
  fontSize: 11,
  color: 'hsl(37, 45%, 93%)',
};

const axisTick = { fontSize: 10, fill: 'hsl(156, 4%, 60%)' };

const ConsumptionComparisonPanel = () => {
  const [view, setView] = useState<'annual' | 'quarterly'>('annual');

  const data = useMemo(() => {
    if (view === 'annual') return consumptionApparentData.map(d => ({ label: d.year, ...d }));
    return getQuarterlyConsumption().map(d => ({ label: `${d.year} ${d.quarter}`, ...d }));
  }, [view]);

  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Demanda Aparente de Vergalhão — Brasil vs Goiás
          </h3>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[220px] text-xs">
                  Consumo aparente = produção + importação – exportação.
                  Goiás é estimado via proxy industrial. Fonte: IBGE + Instituto Aço Brasil (simulado).
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-0.5">
          {(['annual', 'quarterly'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded px-2 py-0.5 font-data text-[10px] font-medium transition-colors ${
                view === v
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {v === 'annual' ? 'Anual' : 'Trimestral'}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 font-serif-body text-[10px] leading-relaxed text-muted-foreground">
        Consumo aparente de vergalhão (produção + importação – exportação). Goiás é estimado via proxy industrial.
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3%, 20%)" />
          <XAxis
            dataKey="label"
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: 'hsl(240, 3%, 20%)' }}
            interval={view === 'quarterly' ? 3 : 0}
          />
          <YAxis
            yAxisId="brazil"
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            width={55}
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            label={{ value: 'mil t', angle: -90, position: 'insideLeft', style: { fontSize: 9, fill: 'hsl(156, 4%, 60%)' } }}
          />
          <YAxis
            yAxisId="goias"
            orientation="right"
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            width={45}
            label={{ value: 'mil t (GO)', angle: 90, position: 'insideRight', style: { fontSize: 9, fill: 'hsl(156, 4%, 60%)' } }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                valueBrazil: 'Brasil (mil t)',
                valueGoias: 'Goiás (mil t)',
              };
              return [`${value.toLocaleString('pt-BR')}`, labels[name] || name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar yAxisId="brazil" dataKey="valueBrazil" fill="hsl(191, 67%, 35%)" name="Brasil (mil t)" radius={[2, 2, 0, 0]} />
          <Bar yAxisId="goias" dataKey="valueGoias" fill="hsl(30, 55%, 46%)" name="Goiás (mil t)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionComparisonPanel;
