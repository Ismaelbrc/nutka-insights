import { type MarketIndicator } from "@/data/marketData";
import Sparkline from "@/components/charts/Sparkline";

interface MarketIndicatorCardProps {
  indicator: MarketIndicator;
  onClick?: () => void;
  isSelected?: boolean;
}

const MarketIndicatorCard = ({ indicator, onClick, isSelected }: MarketIndicatorCardProps) => {
  const isPositive = indicator.variation >= 0;
  const last20 = indicator.series.slice(-20).map((p) => p.value);

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-md border p-3 transition-all ${
        isSelected
          ? 'border-primary/50 bg-primary/5 glow-teal'
          : 'border-border bg-card hover:border-glow hover:glow-teal'
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
          {indicator.name}
        </span>
        <span className={`font-data text-[10px] font-semibold ${isPositive ? 'text-positive' : 'text-negative'}`}>
          {isPositive ? '+' : ''}{indicator.variation.toFixed(2)}%
        </span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <span className="font-data text-xl font-bold text-foreground">
            {indicator.currentValue.toLocaleString('pt-BR', {
              minimumFractionDigits: indicator.currentValue < 10 ? 2 : 0,
              maximumFractionDigits: 2,
            })}
          </span>
          {indicator.unit && (
            <span className="ml-1 font-data text-[10px] text-muted-foreground">{indicator.unit}</span>
          )}
        </div>
        <Sparkline data={last20} positive={isPositive} />
      </div>
    </div>
  );
};

export default MarketIndicatorCard;
