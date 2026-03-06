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
import {
  getIndicators,
  getAllData,
  getHistory,
  ApiIndicator,
  AllData,
  MacroData,
  B3Data,
  CommoditiesData,
  CryptoData,
  HistoryData,
} from "@/lib/api";

const POLL_INTERVAL = 30 * 60 * 1000; // 30 minutos

// ─── Merge MySQL → MockIndicators ────────────────────────────────
function mergeWithApi(apiData: ApiIndicator[]): MarketIndicator[] {
  return mockIndicators.map((mock) => {
    const api = apiData.find((a) => a.name === mock.name);
    if (!api) return mock;
    return {
      ...mock,
      currentValue: Number(api.value),
      variation: api.change_pct != null ? Number(api.change_pct) : mock.variation,
    };
  });
}

// ─── Label de correlação ──────────────────────────────────────────
function getCorrelationLabel(r: number): { text: string; color: string } {
  const abs = Math.abs(r);
  if (abs >= 0.85) return { text: r > 0 ? "Muito forte positiva" : "Muito forte negativa", color: r > 0 ? "positive" : "negative" };
  if (abs >= 0.6)  return { text: r > 0 ? "Forte positiva"       : "Forte negativa",       color: r > 0 ? "positive" : "negative" };
  if (abs >= 0.3)  return { text: r > 0 ? "Moderada positiva"    : "Moderada negativa",    color: r > 0 ? "positive" : "negative" };
  return { text: "Correlação fraca", color: "info" };
}

// ─── useMarketData — indicadores do MySQL (bloom_indicators) ──────
export function useMarketData() {
  const { data: apiData, isLoading } = useQuery({
    queryKey: ["indicators"],
    queryFn: () => getIndicators(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: POLL_INTERVAL,
    retry: 1,
  });

  const indicators = useMemo(
    () => apiData && apiData.length > 0 ? mergeWithApi(apiData) : mockIndicators,
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

// ─── useLiveData — todos os dados externos (polling 30min) ────────
export function useLiveData() {
  const { data, isLoading, dataUpdatedAt } = useQuery<AllData>({
    queryKey: ["liveData"],
    queryFn:  getAllData,
    staleTime: POLL_INTERVAL,
    refetchInterval: POLL_INTERVAL,
    retry: 2,
  });

  return {
    macro:       data?.macro       ?? null,
    b3:          data?.b3          ?? null,
    commodities: data?.commodities ?? null,
    crypto:      data?.crypto      ?? null,
    updatedAt:   data?.updatedAt   ?? null,
    isLoading,
    dataUpdatedAt,
  };
}

// ─── useMergedIndicators ─────────────────────────────────────────
// Combina MySQL + BCB/live (currentValue) + histórico real (series)
export function useMergedIndicators() {
  const { indicators, isLoading: loadingMysql } = useMarketData();
  const { macro, b3, commodities, isLoading: loadingLive } = useLiveData();

  // Histórico real: fetch único, cache 23h no cliente
  const { data: historyData } = useQuery<HistoryData>({
    queryKey:       ["history"],
    queryFn:        getHistory,
    staleTime:      23 * 60 * 60 * 1000,
    retry:          1,
  });

  const mergedIndicators = useMemo((): MarketIndicator[] => {
    const overrides: Record<string, { currentValue: number; variation: number }> = {};

    if (macro) {
      // Macro BCB
      if (macro.selic)    overrides["selic"]   = { currentValue: macro.selic.valor,    variation: 0 };
      if (macro.ipca12m)  overrides["ipca"]    = { currentValue: macro.ipca12m.valor,   variation: 0 };
      if (macro.dolar)    overrides["usd-brl"] = {
        currentValue: macro.dolar.valor,
        variation:    macro.forex?.usdBrl?.variacao ?? 0,
      };
      // Novos: INCC acumulado 12m, PIB YoY%, Confiança Construção (FGV ICC)
      if (macro.incc12m)  overrides["incc"]    = { currentValue: macro.incc12m.valor,  variation: 0 };
      if (macro.pibYoY)   overrides["pib"]     = { currentValue: macro.pibYoY.valor,   variation: 0 };
      if (macro.confianca) overrides["icc"]    = { currentValue: macro.confianca.valor, variation: 0 };
    }
    if (b3?.ibovespa) {
      overrides["ibov"] = { currentValue: b3.ibovespa.valor, variation: b3.ibovespa.variacao };
    }
    if (commodities) {
      if (commodities.ouro)         overrides["ouro"]      = { currentValue: commodities.ouro.valor,         variation: commodities.ouro.variacao         ?? 0 };
      if (commodities.minerioFerro) overrides["iron-ore"]  = { currentValue: commodities.minerioFerro.valor, variation: commodities.minerioFerro.variacao  ?? 0 };
      if (commodities.hrcUsd)       overrides["hrc-eua"]   = { currentValue: commodities.hrcUsd.valor,       variation: commodities.hrcUsd.variacao        ?? 0 };
      if (commodities.hrcBrl)       overrides["hrc-brasil"]= { currentValue: commodities.hrcBrl.valor,       variation: commodities.hrcBrl.variacao        ?? 0 };
      if (commodities.rebarBrl)     overrides["rebar"]     = { currentValue: commodities.rebarBrl.valor,     variation: commodities.rebarBrl.variacao      ?? 0 };
      if (commodities.wireRodBrl)   overrides["wire-rod"]  = { currentValue: commodities.wireRodBrl.valor,   variation: commodities.wireRodBrl.variacao    ?? 0 };
      if (commodities.scrapBrl)     overrides["scrap"]     = { currentValue: commodities.scrapBrl.valor,     variation: commodities.scrapBrl.variacao      ?? 0 };
    }

    return indicators.map((ind) => ({
      ...ind,
      // Sobrescreve series com histórico real (se disponível); mantém mock enquanto carrega
      series: historyData?.[ind.id] ?? ind.series,
      // Sobrescreve currentValue/variation com dados do dia
      ...(overrides[ind.id] ?? {}),
    }));
  }, [indicators, macro, b3, commodities, historyData]);

  const alerts = useMemo(() => detectAlerts(mergedIndicators, 2.5), [mergedIndicators]);

  return {
    indicators: mergedIndicators,
    alerts,
    isLoading: loadingMysql || loadingLive,
    getIndicator: (id: string) => mergedIndicators.find((i) => i.id === id),
  };
}

// ─── Hooks individuais por categoria ─────────────────────────────
export function useMacro(): MacroData | null { return useLiveData().macro; }
export function useB3(): B3Data | null { return useLiveData().b3; }
export function useCommodities(): CommoditiesData | null { return useLiveData().commodities; }
export function useCrypto(): CryptoData | null { return useLiveData().crypto; }

// ─── usePeriodFilter ─────────────────────────────────────────────
export function usePeriodFilter(defaultPeriod: PeriodKey = "1M") {
  const [period, setPeriod] = useState<PeriodKey>(defaultPeriod);
  const filterSeries = (series: { date: string; value: number }[]) =>
    filterSeriesByPeriod(series, period);
  return { period, setPeriod, filterSeries };
}

// ─── useCorrelation ──────────────────────────────────────────────
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
