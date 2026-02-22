// ===== MICROECONOMY DATA LAYER =====

export type MicroIndicator = {
  id: string;
  name: string;
  category: 'construction' | 'investment' | 'realestate' | 'industry';
  currentValue: number;
  momVariation: number;
  yoyVariation: number;
  unit: string;
  source: string;
  historical: { date: string; value: number }[];
};

export type RegionalComparison = {
  date: string;
  brazil: number;
  goias: number;
};

export type GoiasIndicator = {
  id: string;
  name: string;
  currentValue: number;
  yoyVariation: number;
  unit: string;
  deltaBrazil: number; // difference vs national avg
  source: string;
  historical: RegionalComparison[];
};

// --- Generators ---

function generateMonthly(
  months: number,
  base: number,
  vol: number,
  trend: number = 0
): { date: string; value: number }[] {
  const points: { date: string; value: number }[] = [];
  let value = base;
  const now = new Date('2026-02-01');

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const dateStr = d.toISOString().slice(0, 7);

    const shock = (Math.random() - 0.5) * 2 * vol * value * 0.03;
    const trendComponent = value * (trend / 12);
    const seasonality = Math.sin((d.getMonth() / 12) * Math.PI * 2) * value * 0.015;
    value = Math.max(value * 0.5, value + shock + trendComponent + seasonality);
    points.push({ date: dateStr, value: Math.round(value * 100) / 100 });
  }
  return points;
}

function generateRegionalComparison(
  years: number,
  baseBrazil: number,
  baseGoias: number,
  volBrazil: number,
  volGoias: number,
  trendBrazil: number,
  trendGoias: number
): RegionalComparison[] {
  const data: RegionalComparison[] = [];
  let valBr = baseBrazil;
  let valGo = baseGoias;

  for (let i = 0; i < years * 12; i++) {
    const d = new Date('2021-03-01');
    d.setMonth(d.getMonth() + i);
    const dateStr = d.toISOString().slice(0, 7);

    const shockBr = (Math.random() - 0.5) * 2 * volBrazil * valBr * 0.02;
    const shockGo = (Math.random() - 0.5) * 2 * volGoias * valGo * 0.025;
    valBr = Math.max(valBr * 0.7, valBr + shockBr + valBr * (trendBrazil / 12));
    valGo = Math.max(valGo * 0.7, valGo + shockGo + valGo * (trendGoias / 12));

    data.push({
      date: dateStr,
      brazil: Math.round(valBr * 100) / 100,
      goias: Math.round(valGo * 100) / 100,
    });
  }
  return data;
}

function buildMicro(
  id: string,
  name: string,
  category: MicroIndicator['category'],
  base: number,
  vol: number,
  trend: number,
  unit: string,
  source: string
): MicroIndicator {
  const historical = generateMonthly(60, base, vol, trend);
  const len = historical.length;
  const current = historical[len - 1].value;
  const prevMonth = historical[len - 2]?.value ?? current;
  const prevYear = historical[Math.max(0, len - 13)]?.value ?? current;

  return {
    id,
    name,
    category,
    currentValue: current,
    momVariation: Math.round(((current - prevMonth) / prevMonth) * 10000) / 100,
    yoyVariation: Math.round(((current - prevYear) / prevYear) * 10000) / 100,
    unit,
    source,
    historical,
  };
}

// --- Brazil Micro Indicators ---

export const microBrazilIndicators: MicroIndicator[] = [
  // Construção Civil
  buildMicro('prod-construcao', 'Produção Física da Construção', 'construction', 102, 0.12, 0.03, 'índice', 'IBGE (simulado)'),
  buildMicro('incc', 'INCC', 'construction', 6.2, 0.10, 0.02, '% a.a.', 'FGV (simulado)'),
  buildMicro('cub', 'CUB Médio Nacional', 'construction', 1850, 0.08, 0.05, 'R$/m²', 'SINDUSCON (simulado)'),
  buildMicro('area-licenciada', 'Área Licenciada', 'construction', 12500, 0.18, -0.02, 'mil m²', 'IBGE (simulado)'),
  // Investimento
  buildMicro('fbcf', 'FBCF', 'investment', 18.5, 0.12, 0.04, '% PIB', 'IBGE (simulado)'),
  buildMicro('invest-infra', 'Investimento em Infraestrutura', 'investment', 142, 0.15, 0.06, 'R$ bi', 'ABDIB (simulado)'),
  // Mercado Imobiliário
  buildMicro('vendas-imoveis', 'Vendas de Imóveis', 'realestate', 78500, 0.20, 0.08, 'unidades', 'ABRAINC (simulado)'),
  buildMicro('estoque-imoveis', 'Estoque de Imóveis', 'realestate', 145000, 0.06, -0.03, 'unidades', 'CBIC (simulado)'),
  buildMicro('credito-imob', 'Crédito Imobiliário Concedido', 'realestate', 19.8, 0.14, 0.10, 'R$ bi/mês', 'BCB (simulado)'),
  // Indústria
  buildMicro('prod-ind-bk', 'Produção Industrial – Bens de Capital', 'industry', 98.5, 0.15, 0.02, 'índice', 'IBGE (simulado)'),
];

// --- Goiás Indicators ---

function buildGoias(
  id: string,
  name: string,
  baseBr: number,
  baseGo: number,
  volBr: number,
  volGo: number,
  trendBr: number,
  trendGo: number,
  unit: string,
  source: string
): GoiasIndicator {
  const historical = generateRegionalComparison(5, baseBr, baseGo, volBr, volGo, trendBr, trendGo);
  const len = historical.length;
  const current = historical[len - 1].goias;
  const prevYear = historical[Math.max(0, len - 13)]?.goias ?? current;
  const brazilCurrent = historical[len - 1].brazil;
  const brazilPrevYear = historical[Math.max(0, len - 13)]?.brazil ?? brazilCurrent;
  const yoyGo = ((current - prevYear) / prevYear) * 100;
  const yoyBr = ((brazilCurrent - brazilPrevYear) / brazilPrevYear) * 100;

  return {
    id,
    name,
    currentValue: current,
    yoyVariation: Math.round(yoyGo * 100) / 100,
    unit,
    deltaBrazil: Math.round((yoyGo - yoyBr) * 100) / 100,
    source,
    historical,
  };
}

export const goiasIndicators: GoiasIndicator[] = [
  buildGoias('pib-construcao-go', 'PIB Construção Goiás', 100, 100, 0.10, 0.14, 0.03, 0.05, 'índice', 'IBGE/IMB (simulado)'),
  buildGoias('prod-ind-go', 'Produção Industrial Goiás', 105, 108, 0.12, 0.15, 0.02, 0.04, 'índice', 'IBGE (simulado)'),
  buildGoias('energia-ind-go', 'Consumo Energia Industrial', 3200, 280, 0.08, 0.12, 0.03, 0.06, 'GWh', 'CELG/EPE (simulado)'),
  buildGoias('alvaras-go', 'Alvarás Emitidos (GO)', 1800, 220, 0.15, 0.20, -0.01, 0.03, 'unid./mês', 'Prefeituras (simulado)'),
  buildGoias('export-metal-go', 'Exportações Metalurgia GO', 450, 85, 0.18, 0.22, 0.04, 0.07, 'USD mi/mês', 'MDIC (simulado)'),
];

// --- INPA (Índice Nutka de Pressão do Aço) ---

export function calculateINPA(inputs: {
  ironOreVariation: number;
  usdBrlVariation: number;
  consumptionVariation: number;
  creditVariation: number;
  constructionVariation: number;
}): number {
  // Normalize variations to 0-100 scale. Assume +-10% maps to 0-100.
  const normalize = (v: number) => Math.max(0, Math.min(100, 50 + v * 5));

  const score =
    normalize(inputs.ironOreVariation) * 0.30 +
    normalize(inputs.usdBrlVariation) * 0.20 +
    normalize(inputs.consumptionVariation) * 0.20 +
    normalize(inputs.creditVariation) * 0.15 +
    normalize(inputs.constructionVariation) * 0.15;

  return Math.round(score * 10) / 10;
}

export function inpaLabel(score: number): { text: string; color: 'positive' | 'negative' | 'info' } {
  if (score >= 70) return { text: 'Pressão Alta', color: 'negative' };
  if (score >= 40) return { text: 'Pressão Moderada', color: 'info' };
  return { text: 'Pressão Baixa', color: 'positive' };
}
