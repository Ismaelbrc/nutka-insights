import { useMacro } from "@/hooks/useMarketHooks";
import { macroIndicators as mockMacroIndicators } from "@/data/mockData";

const fmt = (v: number, dec = 2) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

const MacroSection = () => {
  const macro = useMacro();

  const liveRows = macro
    ? [
        { label: "SELIC (meta)",      value: macro.selic      ? `${fmt(macro.selic.valor)} %`             : "—", change: null,                                 ref: macro.selic?.data },
        { label: "IPCA 12 meses",     value: macro.ipca12m    ? `${fmt(macro.ipca12m.valor)} %`           : "—", change: null,                                 ref: macro.ipca12m?.data },
        { label: "IGP-M 12 meses",    value: macro.igpm12m    ? `${fmt(macro.igpm12m.valor)} %`           : "—", change: null,                                 ref: macro.igpm12m?.data },
        { label: "USD/BRL (PTAX)",    value: macro.dolar      ? `R$ ${fmt(macro.dolar.valor, 4)}`         : "—", change: macro.forex?.usdBrl?.variacao ?? null, ref: macro.dolar?.data },
        { label: "EUR/BRL (PTAX)",    value: macro.euro       ? `R$ ${fmt(macro.euro.valor, 4)}`          : "—", change: macro.forex?.eurBrl?.variacao ?? null, ref: macro.euro?.data },
        { label: "Desemprego (PNAD)", value: macro.desemprego ? `${fmt(macro.desemprego.valor)} %`        : "—", change: null,                                 ref: macro.desemprego?.data },
        { label: "Reservas Int.",     value: macro.reservas   ? `US$ ${fmt(macro.reservas.valor, 0)} bi`  : "—", change: null,                                 ref: macro.reservas?.data },
      ]
    : [];

  return (
    <section id="macro" className="py-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
          Macro Brasil & Regional
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Indicadores BCB — dados reais */}
        <div className="rounded-md border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Indicadores Brasil — BCB
            </h3>
            {macro && (
              <span className="font-data text-[10px] text-primary">● ao vivo</span>
            )}
          </div>
          <div className="space-y-2">
            {macro
              ? liveRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between border-b border-border/50 pb-2"
                  >
                    <span className="font-data text-xs text-foreground">{row.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-data text-sm font-bold text-foreground">{row.value}</span>
                      {row.change != null && (
                        <span
                          className={`font-data text-[10px] font-semibold ${
                            row.change >= 0 ? "text-positive" : "text-negative"
                          }`}
                        >
                          {row.change >= 0 ? "+" : ""}{fmt(row.change)}%
                        </span>
                      )}
                      {row.ref && (
                        <span className="font-data text-[10px] text-muted-foreground">{row.ref}</span>
                      )}
                    </div>
                  </div>
                ))
              : mockMacroIndicators.map((m) => (
                  <div
                    key={m.indicator}
                    className="flex items-center justify-between border-b border-border/50 pb-2 opacity-40"
                  >
                    <span className="font-data text-xs text-foreground">{m.indicator}</span>
                    <span className="font-data text-sm font-bold text-foreground">
                      {m.value.toLocaleString("pt-BR")}{" "}
                      <span className="text-[10px] text-muted-foreground">{m.unit}</span>
                    </span>
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
            {mockMacroIndicators
              .filter((m) => m.goias !== undefined)
              .map((m) => (
                <div key={m.indicator} className="rounded border border-border/50 bg-secondary/50 p-2">
                  <span className="font-data text-[10px] uppercase text-muted-foreground">
                    {m.indicator}
                  </span>
                  <div className="mt-1 flex justify-between">
                    <div>
                      <span className="font-data text-[10px] text-muted-foreground">Brasil: </span>
                      <span className="font-data text-xs font-bold text-foreground">
                        {m.value.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div>
                      <span className="font-data text-[10px] text-muted-foreground">Goiás: </span>
                      <span className="font-data text-xs font-bold text-primary">
                        {m.goias!.toLocaleString("pt-BR")}
                      </span>
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
