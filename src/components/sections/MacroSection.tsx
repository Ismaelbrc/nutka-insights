import { macroIndicators } from "@/data/mockData";

const MacroSection = () => {
  return (
    <section id="macro" className="py-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
          Macro Brasil & Regional
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Brasil */}
        <div className="rounded-md border border-border bg-card p-4">
          <h3 className="mb-3 font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Indicadores Brasil
          </h3>
          <div className="space-y-2">
            {macroIndicators.map((m) => (
              <div key={m.indicator} className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="font-data text-xs text-foreground">{m.indicator}</span>
                <div className="flex items-center gap-3">
                  <span className="font-data text-sm font-bold text-foreground">
                    {m.value.toLocaleString('pt-BR')} <span className="text-[10px] text-muted-foreground">{m.unit}</span>
                  </span>
                  <span className={`font-data text-[10px] font-semibold ${m.change >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {m.change >= 0 ? '+' : ''}{m.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goiás Subpanel */}
        <div className="rounded-md border border-primary/30 bg-card p-4 glow-teal">
          <h3 className="mb-1 font-data text-xs font-semibold uppercase tracking-wider text-primary">
            Subpainel Goiás
          </h3>
          <p className="mb-3 font-data text-[10px] text-muted-foreground">Comparativo regional</p>
          <div className="space-y-2">
            {macroIndicators.filter((m) => m.goias !== undefined).map((m) => (
              <div key={m.indicator} className="rounded border border-border/50 bg-secondary/50 p-2">
                <span className="font-data text-[10px] uppercase text-muted-foreground">{m.indicator}</span>
                <div className="mt-1 flex justify-between">
                  <div>
                    <span className="font-data text-[10px] text-muted-foreground">Brasil: </span>
                    <span className="font-data text-xs font-bold text-foreground">{m.value.toLocaleString('pt-BR')}</span>
                  </div>
                  <div>
                    <span className="font-data text-[10px] text-muted-foreground">Goiás: </span>
                    <span className="font-data text-xs font-bold text-primary">{m.goias!.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MacroSection;
