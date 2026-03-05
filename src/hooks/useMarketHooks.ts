import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  marketIndicators as mockIndicators,
  MarketIndicator,
  PeriodKey,
  detectAlerts,
  filterSeriesByPeriod,
  pearsonCorrelation,
  correlationLabel,
} from "@/data/marketData";
import { getIndicators, ApiIndicator } from "@/lib/api";

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

export function usePeriodFilter(defaultPeriod: PeriodKey = "1M") {
  const [period, setPeriod] = useState<PeriodKey>(defaultPeriod);
  const filterSeries = (series: { date: string; value: number }[]) =>
    filterSeriesByPeriod(series, period);
  return { period, setPeriod, filterSeries };
}

const DEFAULT_CORRELATION = {
  coefficient: 0,
  label: "Sem dados",
  data: [] as { date: string; a: number; b: number }[],
  nameA: "",
  nameB: "",
};

export function useCorrelation(
  indicatorAId: string,
  indicatorBId: string,
  period: PeriodKey = "1Y"
) {
  const { indicators } = useMarketData();

  return useMemo(() => {
    const a = indicators.find((i) => i.id === indicatorAId);
    const b = indicators.find((i) => i.id === indicatorBId);
    if (!a || !b) return DEFAULT_CORRELATION;

    const filteredA = filterSeriesByPeriod(a.series, period);
    const filteredB = filterSeriesByPeriod(b.series, period);

    const mapB = new Map(filteredB.map((p) => [p.date, p.value]));
    const aligned = filteredA
      .filter((p) => mapB.has(p.date))
      .map((p) => ({ date: p.date, a: p.value, b: mapB.get(p.date)! }));

    if (aligned.length < 2) return DEFAULT_CORRELATION;

    const r = pearsonCorrelation(
      aligned.map((p) => p.a),
      aligned.map((p) => p.b)
    );
    return {
      coefficient: Math.round(r * 1000) / 1000,
      label: correlationLabel(r),
      data: aligned,
      nameA: a.name,
      nameB: b.name,
    };
  }, [indicatorAId, indicatorBId, period, indicators]);
}
