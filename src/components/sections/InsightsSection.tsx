import { insights } from "@/data/mockData";

const typeStyles = {
  positive: { bg: 'bg-positive', border: 'border-success/30', icon: '▲' },
  negative: { bg: 'bg-negative', border: 'border-destructive/30', icon: '▼' },
  info: { bg: 'bg-info', border: 'border-primary/30', icon: '●' },
};

const InsightsSection = () => {
  return (
    <section id="insights" className="py-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
          Motor de Insights
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((alert) => {
          const style = typeStyles[alert.type];
          return (
            <div
              key={alert.id}
              className={`rounded-md border ${style.border} ${style.bg} p-4 transition-all hover:scale-[1.01]`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className={`font-data text-xs font-bold ${
                  alert.type === 'positive' ? 'text-positive' : alert.type === 'negative' ? 'text-negative' : 'text-info'
                }`}>
                  {style.icon} {alert.title}
                </span>
                <span className="font-data text-[10px] text-muted-foreground">{alert.timestamp}</span>
              </div>
              <p className="font-serif text-xs leading-relaxed text-foreground/80">
                {alert.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default InsightsSection;
