import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  marketIndicators as mockIndicators,
  MarketIndicator,
  PeriodKey,
  detectAlerts,
  filterSeriesByPeriod,
  pearsonCorrelation,
} from "@/data/marketData";
import { getIndicators, ApiIndicator } from "@/lib/api";

// Mescla valores reais do banco com séries históricas geradas
function mergeWithApi(apiData: ApiIndicator[]): MarketIndicator[] {
  return mockIndicators.map((mock) => {
    const api = apiData.find((a) => a.name === mock.name);
    if (!api) return mock;
    return {
      ...mock,
      currentValue: api.value,
      variation: api.change_pct ?? mock.variation,
    };
  });
}

// Label de correlação com cor para o CorrelationPanel
function getCorrelationLabel(r: number): { text: string; color: string } {
  const abs = Math.abs(r);
  if (abs >= 0.85) return { text: r > 0 ? "Muito forte positiva" : "Muito forte negativa", color: r > 0 ? "positive" : "negative" };
  if (abs >= 0.6)  return { text: r > 0 ? "Forte positiva"       : "Forte negativa",       color: r > 0 ? "positive" : "negative" };
  if (abs >= 0.3)  return { text: r > 0 ? "Moderada positiva"    : "Moderada negativa",    color: r > 0 ? "positive" : "negative" };
  return { text: "Correlação fraca", color: "info" };
}

// ─── useMarketData ───────────────────────────────────────────────
export function useMarketData() {
  const { data: apiData, isLoading } = useQuery({
    queryKey: ["indicators"],
    queryFn: () => getIndicators(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const indicators = useMemo(
    () =>
      apiData && apiData.length > 0 ? mergeWithApi(apiData) : mockIndicators,
    [apiData]
  );

  const alerts = useMemo(() => detectAlerts(indicators, 2.5), [indicators]);

  return {
    indicators,
    isLoading,
    getIndicator: (id: string) => indicators.find((i) => i.id === id),
    alerts,
  };
}

// ─── usePeriodFilter ─────────────────────────────────────────────
export function usePeriodFilter(defaultPeriod: PeriodKey = "1M") {
  const [period, setPeriod] = useState<PeriodKey>(defaultPeriod);
  const filterSeries = (series: { date: string; value: number }[]) =>
    filterSeriesByPeriod(series, period);
  return { period, setPeriod, filterSeries };
}

// ─── useCorrelation ──────────────────────────────────────────────
// Recebe objetos MarketIndicator completos (mesma assinatura original)
// Retorna { coefficient, label: {text,color}, alignedData, nameA, nameB }
export function useCorrelation(
  indicatorA: MarketIndicator,
  indicatorB: MarketIndicator,
  period: PeriodKey = "1Y"
) {
  return useMemo(() => {
    const filteredA = filterSeriesByPeriod(indicatorA.series, period);
    const filteredB = filterSeriesByPeriod(indicatorB.series, period);

    const mapB = new Map(filteredB.map((p) => [p.date, p.value]));
    const alignedData = filteredA
      .filter((p) => mapB.has(p.date))
      .map((p) => ({ date: p.date, a: p.value, b: mapB.get(p.date)! }));

    if (alignedData.length < 2) {
      return {
        coefficient: 0,
        label: { text: "Sem dados suficientes", color: "info" },
        alignedData: [] as { date: string; a: number; b: number }[],
        nameA: indicatorA.name,
        nameB: indicatorB.name,
      };
    }

    const r = pearsonCorrelation(
      alignedData.map((p) => p.a),
      alignedData.map((p) => p.b)
    );

    return {
      coefficient: Math.round(r * 1000) / 1000,
      label: getCorrelationLabel(r),
      alignedData,
      nameA: indicatorA.name,
      nameB: indicatorB.name,
    };
  }, [indicatorA.id, indicatorB.id, period]);
}
