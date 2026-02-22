import { type Indicator } from "@/data/mockData";
import Sparkline from "@/components/charts/Sparkline";

interface IndicatorCardProps {
  indicator: Indicator;
}

const IndicatorCard = ({ indicator }: IndicatorCardProps) => {
  const isPositive = indicator.change >= 0;

  return (
    <div className="group rounded-md border border-border bg-card p-3 transition-all hover:border-glow hover:glow-teal">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
          {indicator.name}
        </span>
        <span className={`font-data text-[10px] font-semibold ${isPositive ? 'text-positive' : 'text-negative'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(indicator.change).toFixed(2)}%
        </span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <span className="font-data text-xl font-bold text-foreground">
            {indicator.value.toLocaleString('pt-BR', { minimumFractionDigits: indicator.value < 10 ? 2 : 0 })}
          </span>
          {indicator.unit && (
            <span className="ml-1 font-data text-[10px] text-muted-foreground">{indicator.unit}</span>
          )}
        </div>
        <Sparkline data={indicator.sparkline} positive={isPositive} />
      </div>
    </div>
  );
};

export default IndicatorCard;
