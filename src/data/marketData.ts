// ===== MARKET DATA LAYER =====
// Structured time series data ready for future API integration

export type TimeSeriesPoint = {
  date: string;
  value: number;
};

export type MarketIndicator = {
  id: string;
  name: string;
  unit: string;
  currentValue: number;
  variation: number;
  weeklyVariation: number;
  monthlyVariation: number;
  series: TimeSeriesPoint[];
  category: 'steel' | 'macro' | 'construction' | 'currency';
};

// --- Realistic time series generator ---

function generateDailySeries(
  startDate: Date,
  days: number,
  baseValue: number,
  annualVolatility: number,
  trend: number = 0,
  meanReversion: number = 0.02
): TimeSeriesPoint[] {
  const dailyVol = annualVolatility / Math.sqrt(252);
  const dailyTrend = trend / 252;
  const points: TimeSeriesPoint[] = [];
  let value = baseValue;

  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    const shock = (Math.random() - 0.5) * 2 * dailyVol * value;
    const reversion = (baseValue * (1 + trend) - value) * meanReversion;
    const seasonality = Math.sin((i / days) * Math.PI * 4) * value * 0.005;
    value = Math.max(value * 0.7, value + shock + reversion * 0.1 + value * dailyTrend + seasonality);

    points.push({
      date: d.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
    });
  }

  return points;
}

const today = new Date('2026-02-22');
const startDate = new Date('2021-02-22'); // 5 years back
const DAYS_5Y = 365 * 5;

// --- Generate all indicator series ---

function buildIndicator(
  id: string,
  name: string,
  unit: string,
  base: number,
  vol: number,
  trend: number,
  category: MarketIndicator['category']
): MarketIndicator {
  const series = generateDailySeries(startDate, DAYS_5Y, base, vol, trend);
  const len = series.length;
  const current = series[len - 1].value;
  const prev = series[len - 2]?.value ?? current;
  const weekAgo = series[Math.max(0, len - 6)]?.value ?? current;
  const monthAgo = series[Math.max(0, len - 22)]?.value ?? current;

  return {
    id,
    name,
    unit,
    currentValue: current,
    variation: Math.round(((current - prev) / prev) * 10000) / 100,
    weeklyVariation: Math.round(((current - weekAgo) / weekAgo) * 10000) / 100,
    monthlyVariation: Math.round(((current - monthAgo) / monthAgo) * 10000) / 100,
    series,
    category,
  };
}

export const marketIndicators: MarketIndicator[] = [
  buildIndicator('iron-ore', 'Minério de Ferro 62%', 'USD/t', 110, 0.30, -0.05, 'steel'),
  buildIndicator('hrc-china', 'HRC China', 'USD/t', 520, 0.22, 0.02, 'steel'),
  buildIndicator('hrc-eua', 'HRC EUA', 'USD/t', 780, 0.28, -0.03, 'steel'),
  buildIndicator('hrc-brasil', 'HRC Brasil', 'BRL/t', 4250, 0.18, 0.04, 'steel'),
  buildIndicator('rebar', 'Vergalhão Brasil', 'BRL/t', 4890, 0.15, -0.02, 'steel'),
  buildIndicator('wire-rod', 'Fio-Máquina Brasil', 'BRL/t', 4650, 0.16, -0.01, 'steel'),
  buildIndicator('scrap', 'Sucata', 'BRL/t', 1850, 0.20, 0.03, 'steel'),
  buildIndicator('usd-brl', 'USD/BRL', '', 5.20, 0.14, 0.08, 'currency'),
  buildIndicator('di-futuro', 'DI Futuro Jan/27', '%', 14.50, 0.12, -0.02, 'macro'),
  buildIndicator('selic', 'Selic', '%', 12.50, 0.08, 0.04, 'macro'),
  buildIndicator('ipca', 'IPCA 12m', '%', 4.50, 0.10, 0.03, 'macro'),
  buildIndicator('incc', 'INCC 12m', '%', 6.00, 0.12, -0.01, 'construction'),
  buildIndicator('pib', 'PIB Brasil', '% a.a.', 2.50, 0.15, 0.02, 'macro'),
  buildIndicator('icc', 'Confiança Construção', 'pts', 96, 0.08, 0.01, 'construction'),
];

// --- Consumption / Demand Apparent Data ---

export type ConsumptionPoint = {
  year: string;
  quarter?: string;
  valueBrazil: number;
  valueGoias: number;
};

function generateConsumptionData(): ConsumptionPoint[] {
  const data: ConsumptionPoint[] = [];
  const baseYearBrazil = 8500; // mil toneladas
  const goiasShare = 0.045; // ~4.5% do Brasil

  for (let y = 2014; y <= 2024; y++) {
    // Simulate cycles: dip in 2015-2016, recovery, covid dip 2020, boom 2021-2022
    let factor = 1;
    if (y === 2015) factor = 0.88;
    else if (y === 2016) factor = 0.82;
    else if (y === 2017) factor = 0.87;
    else if (y === 2018) factor = 0.92;
    else if (y === 2019) factor = 0.95;
    else if (y === 2020) factor = 0.85;
    else if (y === 2021) factor = 1.08;
    else if (y === 2022) factor = 1.12;
    else if (y === 2023) factor = 1.05;
    else if (y === 2024) factor = 1.07;

    const brazil = Math.round(baseYearBrazil * factor * (1 + (Math.random() - 0.5) * 0.04));
    // Goiás grows slightly faster due to agribusiness construction
    const goiasGrowthExtra = y >= 2020 ? 1.15 : 1.0;
    const goias = Math.round(brazil * goiasShare * goiasGrowthExtra * (1 + (Math.random() - 0.5) * 0.06));

    data.push({ year: String(y), valueBrazil: brazil, valueGoias: goias });
  }
  return data;
}

export const consumptionApparentData: ConsumptionPoint[] = generateConsumptionData();

// Generate quarterly breakdown
export function getQuarterlyConsumption(): ConsumptionPoint[] {
  const quarterly: ConsumptionPoint[] = [];
  const seasonality = [0.22, 0.26, 0.28, 0.24]; // Q1-Q4 weights

  for (const annual of consumptionApparentData) {
    for (let q = 0; q < 4; q++) {
      quarterly.push({
        year: annual.year,
        quarter: `Q${q + 1}`,
        valueBrazil: Math.round(annual.valueBrazil * seasonality[q]),
        valueGoias: Math.round(annual.valueGoias * seasonality[q]),
      });
    }
  }
  return quarterly;
}

// --- Period filter utility ---

export type PeriodKey = '1D' | '5D' | '1M' | '6M' | '1Y' | '5Y';

export function filterSeriesByPeriod(series: TimeSeriesPoint[], period: PeriodKey): TimeSeriesPoint[] {
  if (series.length === 0) return series;

  const lastDate = new Date(series[series.length - 1].date);
  let cutoff: Date;

  switch (period) {
    case '1D': cutoff = new Date(lastDate); cutoff.setDate(cutoff.getDate() - 1); break;
    case '5D': cutoff = new Date(lastDate); cutoff.setDate(cutoff.getDate() - 5); break;
    case '1M': cutoff = new Date(lastDate); cutoff.setMonth(cutoff.getMonth() - 1); break;
    case '6M': cutoff = new Date(lastDate); cutoff.setMonth(cutoff.getMonth() - 6); break;
    case '1Y': cutoff = new Date(lastDate); cutoff.setFullYear(cutoff.getFullYear() - 1); break;
    case '5Y': return series;
  }

  const cutoffStr = cutoff.toISOString().split('T')[0];
  return series.filter(p => p.date >= cutoffStr);
}

// --- Pearson Correlation ---

export function pearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
    sumY2 += y[i] * y[i];
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 1000;
}

export function correlationLabel(r: number): { text: string; color: 'positive' | 'negative' | 'info' | 'muted' } {
  const abs = Math.abs(r);
  if (abs >= 0.7) return { text: r > 0 ? 'Forte positiva' : 'Forte negativa', color: r > 0 ? 'positive' : 'negative' };
  if (abs >= 0.4) return { text: r > 0 ? 'Moderada positiva' : 'Moderada negativa', color: 'info' };
  return { text: 'Fraca', color: 'muted' };
}

// --- Abnormal movement detection ---

export interface MarketAlert {
  id: string;
  indicatorName: string;
  variation: number;
  message: string;
  timestamp: string;
}

export function detectAlerts(indicators: MarketIndicator[], threshold = 3): MarketAlert[] {
  return indicators
    .filter(ind => Math.abs(ind.variation) >= threshold)
    .map(ind => ({
      id: `alert-${ind.id}`,
      indicatorName: ind.name,
      variation: ind.variation,
      message: `Movimento anormal detectado em ${ind.name}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }));
}
