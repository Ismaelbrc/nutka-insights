// ===== MOCK DATA LAYER =====
// All mock data centralized here, ready for future API integration

export interface Indicator {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  sparkline: number[];
  category: 'steel' | 'macro' | 'construction' | 'currency';
}

export interface Company {
  name: string;
  ticker: string;
  country: string;
  price: number;
  currency: string;
  marketCap: string;
  evEbitda: number;
  pe: number;
  ebitdaMargin: number;
  revenue: string;
  netDebt: string;
  history: number[];
}

export interface InsightAlert {
  id: string;
  type: 'positive' | 'negative' | 'info';
  title: string;
  description: string;
  timestamp: string;
}

export interface ImportData {
  month: string;
  flatSteel: number;
  longSteel: number;
  chinaShare: number;
}

export interface ConsumptionData {
  month: string;
  flatConsumption: number;
  longConsumption: number;
  production: number;
  importRatio: number;
  capacityUtil: number;
}

export interface MacroData {
  indicator: string;
  value: number;
  unit: string;
  change: number;
  goias?: number;
}

// Generate sparkline data
const spark = (base: number, volatility: number, n = 20): number[] =>
  Array.from({ length: n }, (_, i) => base + Math.sin(i * 0.5) * volatility + (Math.random() - 0.5) * volatility * 0.5);

export const indicators: Indicator[] = [
  { id: 'iron-ore', name: 'Minério de Ferro 62%', value: 108.5, unit: 'USD/t', change: -2.3, sparkline: spark(110, 8), category: 'steel' },
  { id: 'hrc-china', name: 'HRC China', value: 520, unit: 'USD/t', change: 1.8, sparkline: spark(515, 20), category: 'steel' },
  { id: 'hrc-eua', name: 'HRC EUA', value: 780, unit: 'USD/t', change: -0.5, sparkline: spark(790, 30), category: 'steel' },
  { id: 'hrc-brasil', name: 'HRC Brasil', value: 4250, unit: 'BRL/t', change: 0.7, sparkline: spark(4200, 150), category: 'steel' },
  { id: 'rebar', name: 'Vergalhão Brasil', value: 4890, unit: 'BRL/t', change: -1.2, sparkline: spark(4900, 100), category: 'steel' },
  { id: 'scrap', name: 'Sucata', value: 1850, unit: 'BRL/t', change: 2.1, sparkline: spark(1800, 80), category: 'steel' },
  { id: 'usd-brl', name: 'USD/BRL', value: 5.87, unit: '', change: 0.4, sparkline: spark(5.8, 0.2), category: 'currency' },
  { id: 'di-futuro', name: 'DI Futuro Jan/26', value: 14.92, unit: '%', change: -0.08, sparkline: spark(15, 0.3), category: 'macro' },
  { id: 'selic', name: 'Selic', value: 13.25, unit: '%', change: 0, sparkline: spark(13.25, 0.5), category: 'macro' },
  { id: 'ipca', name: 'IPCA 12m', value: 4.87, unit: '%', change: 0.12, sparkline: spark(4.8, 0.3), category: 'macro' },
  { id: 'incc', name: 'INCC 12m', value: 6.31, unit: '%', change: -0.05, sparkline: spark(6.3, 0.4), category: 'construction' },
  { id: 'pib', name: 'PIB Brasil', value: 2.9, unit: '%', change: 0.1, sparkline: spark(2.8, 0.3), category: 'macro' },
  { id: 'icc', name: 'Confiança Construção', value: 97.2, unit: 'pts', change: 1.5, sparkline: spark(96, 3), category: 'construction' },
];

export const companies: Company[] = [
  { name: 'Gerdau', ticker: 'GGBR4', country: 'Brasil', price: 19.42, currency: 'BRL', marketCap: 'R$ 33.2B', evEbitda: 4.1, pe: 6.8, ebitdaMargin: 18.2, revenue: 'R$ 68.4B', netDebt: 'R$ 8.1B', history: spark(19, 2) },
  { name: 'CSN', ticker: 'CSNA3', country: 'Brasil', price: 11.87, currency: 'BRL', marketCap: 'R$ 15.8B', evEbitda: 5.9, pe: 12.3, ebitdaMargin: 22.1, revenue: 'R$ 42.1B', netDebt: 'R$ 32.4B', history: spark(12, 1.5) },
  { name: 'Usiminas', ticker: 'USIM5', country: 'Brasil', price: 6.54, currency: 'BRL', marketCap: 'R$ 8.4B', evEbitda: 7.2, pe: 18.5, ebitdaMargin: 10.8, revenue: 'R$ 28.6B', netDebt: 'R$ 2.1B', history: spark(6.5, 0.8) },
  { name: 'ArcelorMittal', ticker: 'MT', country: 'Internacional', price: 24.31, currency: 'EUR', marketCap: '€20.1B', evEbitda: 3.8, pe: 5.2, ebitdaMargin: 12.4, revenue: '€68.3B', netDebt: '€5.2B', history: spark(24, 3) },
  { name: 'Nucor', ticker: 'NUE', country: 'Internacional', price: 148.72, currency: 'USD', marketCap: '$35.8B', evEbitda: 5.4, pe: 10.1, ebitdaMargin: 16.7, revenue: '$34.7B', netDebt: '$3.8B', history: spark(150, 15) },
  { name: 'Ternium', ticker: 'TX', country: 'Internacional', price: 33.56, currency: 'USD', marketCap: '$6.6B', evEbitda: 3.2, pe: 7.4, ebitdaMargin: 14.3, revenue: '$18.2B', netDebt: '$1.1B', history: spark(34, 4) },
];

export const insights: InsightAlert[] = [
  { id: '1', type: 'negative', title: 'Alta anormal de importação', description: 'Importação de planos cresceu 34% YoY — pressão sobre preço doméstico.', timestamp: '2h atrás' },
  { id: '2', type: 'info', title: 'Correlação forte USD × HRC', description: 'Correlação USD/BRL e HRC doméstico em 0.87 nos últimos 60 dias.', timestamp: '4h atrás' },
  { id: '3', type: 'negative', title: 'Queda de utilização industrial', description: 'Utilização de capacidade caiu para 72% — menor nível em 6 meses.', timestamp: '6h atrás' },
  { id: '4', type: 'positive', title: 'Demanda construção acelerando', description: 'Licenças de construção +12% no trimestre — sinal positivo para longos.', timestamp: '8h atrás' },
  { id: '5', type: 'info', title: 'Risco de tarifa anti-dumping', description: 'MDIC analisa extensão de sobretaxa sobre importação chinesa de planos.', timestamp: '12h atrás' },
];

export const importData: ImportData[] = [
  { month: 'Jan', flatSteel: 320, longSteel: 85, chinaShare: 42 },
  { month: 'Fev', flatSteel: 280, longSteel: 78, chinaShare: 38 },
  { month: 'Mar', flatSteel: 350, longSteel: 92, chinaShare: 45 },
  { month: 'Abr', flatSteel: 410, longSteel: 105, chinaShare: 52 },
  { month: 'Mai', flatSteel: 380, longSteel: 95, chinaShare: 48 },
  { month: 'Jun', flatSteel: 420, longSteel: 110, chinaShare: 55 },
  { month: 'Jul', flatSteel: 390, longSteel: 88, chinaShare: 50 },
  { month: 'Ago', flatSteel: 450, longSteel: 120, chinaShare: 58 },
  { month: 'Set', flatSteel: 430, longSteel: 102, chinaShare: 53 },
  { month: 'Out', flatSteel: 470, longSteel: 115, chinaShare: 60 },
  { month: 'Nov', flatSteel: 440, longSteel: 98, chinaShare: 56 },
  { month: 'Dez', flatSteel: 490, longSteel: 125, chinaShare: 62 },
];

export const consumptionData: ConsumptionData[] = [
  { month: 'Jan', flatConsumption: 1250, longConsumption: 980, production: 2850, importRatio: 14.2, capacityUtil: 76 },
  { month: 'Fev', flatConsumption: 1180, longConsumption: 920, production: 2700, importRatio: 13.2, capacityUtil: 74 },
  { month: 'Mar', flatConsumption: 1320, longConsumption: 1050, production: 2920, importRatio: 15.1, capacityUtil: 78 },
  { month: 'Abr', flatConsumption: 1400, longConsumption: 1100, production: 2980, importRatio: 17.3, capacityUtil: 79 },
  { month: 'Mai', flatConsumption: 1350, longConsumption: 1080, production: 2900, importRatio: 16.4, capacityUtil: 77 },
  { month: 'Jun', flatConsumption: 1450, longConsumption: 1150, production: 3050, importRatio: 18.2, capacityUtil: 80 },
  { month: 'Jul', flatConsumption: 1380, longConsumption: 1020, production: 2880, importRatio: 16.6, capacityUtil: 76 },
  { month: 'Ago', flatConsumption: 1500, longConsumption: 1200, production: 3100, importRatio: 19.4, capacityUtil: 82 },
  { month: 'Set', flatConsumption: 1420, longConsumption: 1100, production: 2950, importRatio: 18.0, capacityUtil: 78 },
  { month: 'Out', flatConsumption: 1550, longConsumption: 1250, production: 3200, importRatio: 20.1, capacityUtil: 84 },
  { month: 'Nov', flatConsumption: 1480, longConsumption: 1180, production: 3050, importRatio: 18.8, capacityUtil: 80 },
  { month: 'Dez', flatConsumption: 1600, longConsumption: 1300, production: 3300, importRatio: 21.5, capacityUtil: 85 },
];

export const macroIndicators: MacroData[] = [
  { indicator: 'PIB Brasil', value: 2.9, unit: '% a.a.', change: 0.1, goias: 3.4 },
  { indicator: 'PIB Construção', value: 4.1, unit: '% a.a.', change: 0.8, goias: 5.2 },
  { indicator: 'Emprego Industrial', value: -0.3, unit: '% m/m', change: -0.5, goias: 0.8 },
  { indicator: 'Licenças Construção', value: 12400, unit: 'unidades', change: 12, goias: 1850 },
  { indicator: 'INCC', value: 6.31, unit: '% 12m', change: -0.05 },
  { indicator: 'Confiança Indústria', value: 52.1, unit: 'pts', change: 1.2 },
];

// Correlation chart data
export const correlationData = Array.from({ length: 24 }, (_, i) => ({
  month: `${['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][i % 12]} ${i < 12 ? '24' : '25'}`,
  hrcBrasil: 3800 + Math.sin(i * 0.4) * 400 + Math.random() * 200,
  usdBrl: 5.2 + Math.sin(i * 0.3) * 0.5 + Math.random() * 0.2,
  minerio: 100 + Math.sin(i * 0.5) * 15 + Math.random() * 5,
}));
