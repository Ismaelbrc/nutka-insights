import { type MarketIndicator } from "@/data/marketData";

interface HeatmapPanelProps {
  indicators: MarketIndicator[];
}

const HEATMAP_IDS = ['iron-ore', 'hrc-china', 'hrc-brasil', 'usd-brl'];

const getHeatColor = (value: number): string => {
  if (value > 0.5) return 'text-positive bg-positive';
  if (value < -0.5) return 'text-negative bg-negative';
  return 'text-muted-foreground bg-muted';
};

const HeatmapPanel = ({ indicators }: HeatmapPanelProps) => {
  const filtered = indicators.filter((i) => HEATMAP_IDS.includes(i.id));

  return (
    <div className="rounded-md border border-border bg-card p-4">
      <h3 className="mb-3 font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Variação por Período
      </h3>
      <div className="space-y-1.5">
        {/* Header */}
        <div className="grid grid-cols-3 gap-2">
          <span className="font-data text-[10px] text-muted-foreground" />
          <span className="text-center font-data text-[10px] uppercase text-muted-foreground">Semanal</span>
          <span className="text-center font-data text-[10px] uppercase text-muted-foreground">Mensal</span>
        </div>
        {filtered.map((ind) => (
          <div key={ind.id} className="grid grid-cols-3 items-center gap-2">
            <span className="truncate font-data text-[10px] text-foreground">{ind.name}</span>
            <div className={`rounded px-1.5 py-1 text-center font-data text-[10px] font-semibold ${getHeatColor(ind.weeklyVariation)}`}>
              {ind.weeklyVariation > 0 ? '+' : ''}{ind.weeklyVariation.toFixed(2)}%
            </div>
            <div className={`rounded px-1.5 py-1 text-center font-data text-[10px] font-semibold ${getHeatColor(ind.monthlyVariation)}`}>
              {ind.monthlyVariation > 0 ? '+' : ''}{ind.monthlyVariation.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeatmapPanel;
