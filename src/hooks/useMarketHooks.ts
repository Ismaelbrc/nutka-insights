import { useMemo, useState, useCallback } from "react";
import {
  marketIndicators,
  filterSeriesByPeriod,
  pearsonCorrelation,
  correlationLabel,
  detectAlerts,
  type MarketIndicator,
  type PeriodKey,
  type MarketAlert,
} from "@/data/marketData";

// --- useMarketData ---
export function useMarketData() {
  const indicators = useMemo(() => marketIndicators, []);

  const getIndicator = useCallback(
    (id: string) => indicators.find((i) => i.id === id),
    [indicators]
  );

  const alerts = useMemo(() => detectAlerts(indicators, 2.5), [indicators]);

  return { indicators, getIndicator, alerts };
}

// --- usePeriodFilter ---
export function usePeriodFilter(defaultPeriod: PeriodKey = '1Y') {
  const [period, setPeriod] = useState<PeriodKey>(defaultPeriod);

  const filterSeries = useCallback(
    (series: { date: string; value: number }[]) => filterSeriesByPeriod(series, period),
    [period]
  );

  return { period, setPeriod, filterSeries };
}

// --- useCorrelation ---
export function useCorrelation(
  indicatorA: MarketIndicator | undefined,
  indicatorB: MarketIndicator | undefined,
  period: PeriodKey = '1Y'
) {
  return useMemo(() => {
    if (!indicatorA || !indicatorB) return { coefficient: 0, label: correlationLabel(0), alignedData: [] };

    const seriesA = filterSeriesByPeriod(indicatorA.series, period);
    const seriesB = filterSeriesByPeriod(indicatorB.series, period);

    // Align by date
    const dateSetB = new Map(seriesB.map((p) => [p.date, p.value]));
    const aligned: { date: string; a: number; b: number }[] = [];

    for (const point of seriesA) {
      const bVal = dateSetB.get(point.date);
      if (bVal !== undefined) {
        aligned.push({ date: point.date, a: point.value, b: bVal });
      }
    }

    const xVals = aligned.map((d) => d.a);
    const yVals = aligned.map((d) => d.b);
    const coefficient = pearsonCorrelation(xVals, yVals);

    return {
      coefficient,
      label: correlationLabel(coefficient),
      alignedData: aligned,
    };
  }, [indicatorA, indicatorB, period]);
}
