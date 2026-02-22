import { type MarketAlert } from "@/data/marketData";

interface AlertBannerProps {
  alerts: MarketAlert[];
}

const AlertBanner = ({ alerts }: AlertBannerProps) => {
  if (alerts.length === 0) return null;

  return (
    <div className="mb-4 space-y-1.5">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-center justify-between rounded border border-warning/30 bg-warning/8 px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            <span className="font-data text-xs text-foreground">{alert.message}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-data text-xs font-semibold ${alert.variation > 0 ? 'text-positive' : 'text-negative'}`}>
              {alert.variation > 0 ? '+' : ''}{alert.variation.toFixed(2)}%
            </span>
            <span className="font-data text-[10px] text-muted-foreground">{alert.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertBanner;
