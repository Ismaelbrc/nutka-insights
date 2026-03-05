import { useState } from "react";
import { useMergedIndicators } from "@/hooks/useMarketHooks";
import MarketIndicatorCard from "@/components/MarketIndicatorCard";
import TimeSeriesChart from "@/components/charts/TimeSeriesChart";
import CorrelationPanel from "@/components/charts/CorrelationPanel";
import SteelPricesChart from "@/components/charts/SteelPricesChart";
import ConsumptionComparisonPanel from "@/components/charts/ConsumptionComparisonPanel";
import HeatmapPanel from "@/components/HeatmapPanel";
import AlertBanner from "@/components/AlertBanner";

const DashboardSection = () => {
  const { indicators, getIndicator, alerts } = useMergedIndicators();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedIndicator = selectedId ? getIndicator(selectedId) : null;

  const hrcBrasil = getIndicator('hrc-brasil');
  const usdBrl = getIndicator('usd-brl');
  const ironOre = getIndicator('iron-ore');
  const rebar = getIndicator('rebar');
  const wireRod = getIndicator('wire-rod');

  return (
    <section id="dashboard" className="py-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
          Dashboard Principal
        </h2>
      </div>

      {/* Alerts */}
      <AlertBanner alerts={alerts} />

      {/* Indicator Grid + Heatmap */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
            {indicators.map((ind) => (
              <MarketIndicatorCard
                key={ind.id}
                indicator={ind}
                isSelected={selectedId === ind.id}
                onClick={() => setSelectedId(selectedId === ind.id ? null : ind.id)}
              />
            ))}
          </div>
        </div>
        <div className="hidden w-56 shrink-0 lg:block">
          <HeatmapPanel indicators={indicators} />
        </div>
      </div>

      {/* Selected Indicator Chart */}
      {selectedIndicator && (
        <div className="mb-6">
          <TimeSeriesChart
            title={selectedIndicator.name}
            series={selectedIndicator.series}
            unit={selectedIndicator.unit}
          />
        </div>
      )}

      {/* Steel Prices Combined Chart */}
      {rebar && wireRod && ironOre && (
        <div className="mb-6">
          <SteelPricesChart rebar={rebar} wireRod={wireRod} ironOre={ironOre} />
        </div>
      )}

      {/* Consumption Comparison */}
      <div className="mb-6">
        <ConsumptionComparisonPanel />
      </div>

      {/* Correlation Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hrcBrasil && usdBrl && (
          <CorrelationPanel
            indicatorA={hrcBrasil}
            indicatorB={usdBrl}
            labelA="HRC Brasil"
            labelB="USD/BRL"
            colorB="hsl(30, 55%, 46%)"
          />
        )}
        {rebar && ironOre && (
          <CorrelationPanel
            indicatorA={rebar}
            indicatorB={ironOre}
            labelA="Vergalhão"
            labelB="Minério 62%"
            colorB="hsl(25, 76%, 40%)"
          />
        )}
        {wireRod && ironOre && (
          <CorrelationPanel
            indicatorA={wireRod}
            indicatorB={ironOre}
            labelA="Fio-Máquina"
            labelB="Minério 62%"
            colorB="hsl(25, 76%, 40%)"
          />
        )}
      </div>
    </section>
  );
};

export default DashboardSection;
