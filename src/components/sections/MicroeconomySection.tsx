import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  microBrazilIndicators,
  goiasIndicators,
  calculateINPA,
  type MicroIndicator,
  type GoiasIndicator,
} from "@/data/microeconomyData";
import { useMarketData, useCorrelation } from "@/hooks/useMarketHooks";
import CorrelationPanel from "@/components/charts/CorrelationPanel";
import INPAGauge from "@/components/charts/INPAGauge";
import Sparkline from "@/components/charts/Sparkline";
import TimeSeriesChart from "@/components/charts/TimeSeriesChart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

const tooltipStyle = {
  backgroundColor: 'hsl(240, 4%, 14%)',
  border: '1px solid hsl(240, 3%, 20%)',
  borderRadius: '4px',
  fontSize: 11,
  color: 'hsl(37, 45%, 93%)',
};

const axisTick = { fontSize: 10, fill: 'hsl(156, 4%, 60%)' };

const CATEGORY_LABELS: Record<string, string> = {
  construction: 'Construção Civil',
  investment: 'Investimento',
  realestate: 'Mercado Imobiliário',
  industry: 'Indústria',
};

// --- Micro Card ---
const MicroCard = ({ indicator }: { indicator: MicroIndicator }) => {
  const [expanded, setExpanded] = useState(false);
  const last12 = indicator.historical.slice(-12).map(p => p.value);
  const isMomPositive = indicator.momVariation >= 0;
  const isYoyPositive = indicator.yoyVariation >= 0;

  // Convert historical to TimeSeriesPoint format
  const series = indicator.historical.map(p => ({ date: p.date + '-01', value: p.value }));

  return (
    <div className="rounded-md border border-border bg-card p-3 transition-all">
      <div className="flex items-center justify-between">
        <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
          {indicator.name}
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-2.5 w-2.5 text-muted-foreground/50" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{indicator.source}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mt-1 flex items-end justify-between gap-2">
        <div>
          <span className="font-data text-lg font-bold text-foreground">
            {indicator.currentValue.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
          </span>
          <span className="ml-1 font-data text-[10px] text-muted-foreground">{indicator.unit}</span>
        </div>
        <Sparkline data={last12} positive={isMomPositive} />
      </div>

      <div className="mt-1.5 flex items-center gap-3">
        <span className={`font-data text-[10px] font-semibold ${isMomPositive ? 'text-positive' : 'text-negative'}`}>
          MoM {isMomPositive ? '+' : ''}{indicator.momVariation.toFixed(2)}%
        </span>
        <span className={`font-data text-[10px] font-semibold ${isYoyPositive ? 'text-positive' : 'text-negative'}`}>
          YoY {isYoyPositive ? '+' : ''}{indicator.yoyVariation.toFixed(2)}%
        </span>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex w-full items-center justify-center gap-1 rounded border border-border py-0.5 font-data text-[9px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {expanded ? 'Fechar' : 'Expandir'}
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {expanded && (
        <div className="mt-2">
          <TimeSeriesChart title={indicator.name} series={series} unit={indicator.unit} height={180} />
        </div>
      )}
    </div>
  );
};

// --- Goiás Card ---
const GoiasCard = ({ indicator }: { indicator: GoiasIndicator }) => {
  const [expanded, setExpanded] = useState(false);
  const isYoyPositive = indicator.yoyVariation >= 0;
  const isDeltaPositive = indicator.deltaBrazil >= 0;

  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
          {indicator.name}
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-2.5 w-2.5 text-muted-foreground/50" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[180px] text-xs">
                {indicator.source}. Dados regionais são estimados via proxy econômica.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mt-1">
        <span className="font-data text-lg font-bold text-foreground">
          {indicator.currentValue.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
        </span>
        <span className="ml-1 font-data text-[10px] text-muted-foreground">{indicator.unit}</span>
      </div>

      <div className="mt-1.5 flex items-center gap-3">
        <span className={`font-data text-[10px] font-semibold ${isYoyPositive ? 'text-positive' : 'text-negative'}`}>
          YoY {isYoyPositive ? '+' : ''}{indicator.yoyVariation.toFixed(2)}%
        </span>
        <span className={`font-data text-[10px] font-semibold ${isDeltaPositive ? 'text-positive' : 'text-negative'}`}>
          Δ BR {isDeltaPositive ? '+' : ''}{indicator.deltaBrazil.toFixed(2)}pp
        </span>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex w-full items-center justify-center gap-1 rounded border border-border py-0.5 font-data text-[9px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {expanded ? 'Fechar' : 'Brasil vs Goiás'}
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {expanded && (
        <div className="mt-2">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={indicator.historical.slice(-24)} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3%, 20%)" />
              <XAxis dataKey="date" tickFormatter={d => d.slice(2, 7)} tick={axisTick} tickLine={false} axisLine={{ stroke: 'hsl(240, 3%, 20%)' }} interval={3} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} domain={['auto', 'auto']} width={50} />
              <RTooltip contentStyle={tooltipStyle} labelFormatter={l => `Período: ${l}`} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="brazil" stroke="hsl(191, 67%, 40%)" strokeWidth={1.5} dot={false} name="Brasil" />
              <Line type="monotone" dataKey="goias" stroke="hsl(30, 55%, 46%)" strokeWidth={1.5} dot={false} name="Goiás" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

// --- Main Section ---
const MicroeconomySection = () => {
  const { getIndicator } = useMarketData();

  const rebar = getIndicator('rebar');
  const ironOre = getIndicator('iron-ore');
  const usdBrl = getIndicator('usd-brl');

  // Build pseudo-indicators for correlation from micro data
  const incc = microBrazilIndicators.find(i => i.id === 'incc');
  const fbcf = microBrazilIndicators.find(i => i.id === 'fbcf');
  const credit = microBrazilIndicators.find(i => i.id === 'credito-imob');
  const prodConst = microBrazilIndicators.find(i => i.id === 'prod-construcao');

  // INPA calculation
  const inpaScore = useMemo(() => {
    if (!ironOre || !usdBrl) return 50;
    return calculateINPA({
      ironOreVariation: ironOre.monthlyVariation,
      usdBrlVariation: usdBrl.monthlyVariation,
      consumptionVariation: prodConst?.momVariation ?? 0,
      creditVariation: credit?.momVariation ?? 0,
      constructionVariation: prodConst?.yoyVariation ?? 0,
    });
  }, [ironOre, usdBrl, prodConst, credit]);

  // Group Brazil indicators by category
  const grouped = useMemo(() => {
    const map: Record<string, MicroIndicator[]> = {};
    microBrazilIndicators.forEach(ind => {
      if (!map[ind.category]) map[ind.category] = [];
      map[ind.category].push(ind);
    });
    return map;
  }, []);

  // Build MarketIndicator-compatible objects for correlation panels
  const toMarketIndicator = (mi: MicroIndicator | undefined) => {
    if (!mi) return undefined;
    return {
      id: mi.id,
      name: mi.name,
      unit: mi.unit,
      currentValue: mi.currentValue,
      variation: mi.momVariation,
      weeklyVariation: 0,
      monthlyVariation: mi.momVariation,
      series: mi.historical.map(p => ({ date: p.date + '-01', value: p.value })),
      category: 'construction' as const,
    };
  };

  const inccMarket = toMarketIndicator(incc);
  const fbcfMarket = toMarketIndicator(fbcf);
  const creditMarket = toMarketIndicator(credit);
  const prodConstMarket = toMarketIndicator(prodConst);

  return (
    <section id="microeconomia" className="py-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
          Microeconomia — Brasil & Goiás
        </h2>
      </div>

      {/* BLOCO 1: Micro Brasil */}
      <div className="mb-6">
        <h3 className="mb-3 font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Indicadores Microeconômicos — Brasil
        </h3>
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-4">
            <span className="mb-2 block font-data text-[10px] font-semibold uppercase tracking-widest text-primary">
              {CATEGORY_LABELS[category] || category}
            </span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {items.map(ind => (
                <MicroCard key={ind.id} indicator={ind} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* BLOCO 2: Micro Goiás */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <h3 className="font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Painel Regional — Goiás
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px] text-xs">
                  Dados regionais são estimados via proxy econômica. Futuramente integrado a APIs reais.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {goiasIndicators.map(ind => (
            <GoiasCard key={ind.id} indicator={ind} />
          ))}
        </div>
      </div>

      {/* BLOCO 3: Correlação com Vergalhão + INPA */}
      <div className="mb-6">
        <h3 className="mb-3 font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Correlação Microeconômica com Vergalhão
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {rebar && inccMarket && (
            <CorrelationPanel
              indicatorA={rebar}
              indicatorB={inccMarket}
              labelA="Vergalhão"
              labelB="INCC"
              colorB="hsl(142, 71%, 45%)"
            />
          )}
          {rebar && fbcfMarket && (
            <CorrelationPanel
              indicatorA={rebar}
              indicatorB={fbcfMarket}
              labelA="Vergalhão"
              labelB="FBCF"
              colorB="hsl(25, 76%, 40%)"
            />
          )}
          {rebar && creditMarket && (
            <CorrelationPanel
              indicatorA={rebar}
              indicatorB={creditMarket}
              labelA="Vergalhão"
              labelB="Crédito Imob."
              colorB="hsl(30, 55%, 46%)"
            />
          )}
          {rebar && prodConstMarket && (
            <CorrelationPanel
              indicatorA={rebar}
              indicatorB={prodConstMarket}
              labelA="Vergalhão"
              labelB="Prod. Construção"
              colorB="hsl(191, 67%, 55%)"
            />
          )}
        </div>
      </div>

      {/* INPA Gauge */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <INPAGauge score={inpaScore} />
        </div>
      </div>
    </section>
  );
};

export default MicroeconomySection;
