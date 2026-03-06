// ===== API CLIENT =====
// Conecta ao backend Express (nutka-api) que agrega dados externos + MySQL

const API_BASE = "/bloomberg/api";

// ─── Tipos MySQL (bloom_indicators) ──────────────────────────────
export interface ApiIndicator {
  id: number;
  category: string;
  name: string;
  value: number;
  unit: string | null;
  change_pct: number | null;
  region: string;
  source: string | null;
  recorded_at: string;
}

export interface ApiSeries {
  period_label: string;
  value: number;
}

// ─── Tipos dados externos (cache diário) ─────────────────────────
export interface MacroData {
  selic:      { valor: number; data: string } | null;
  ipca12m:    { valor: number; data: string } | null;
  igpm12m:    { valor: number; data: string } | null;
  dolar:      { valor: number; data: string } | null;
  euro:       { valor: number; data: string } | null;
  reservas:   { valor: number; data: string } | null;
  desemprego: { valor: number; data: string } | null;
  incc12m:    { valor: number; data: string } | null; // INCC-DI acumulado 12 meses
  pibYoY:     { valor: number; data: string } | null; // PIB variação YoY (%)
  confianca:  { valor: number; data: string } | null; // FGV ICC (pts)
  forex: {
    usdBrl: { valor: number; variacao: number } | null;
    eurBrl: { valor: number; variacao: number } | null;
  } | null;
}

export interface AcaoData {
  ticker: string; nome: string; preco: number; variacao: number;
  abertura: number; alta: number; baixa: number;
  volume: number; valorMercado: number; logoUrl: string | null; moeda: string;
}

export interface B3Data {
  ibovespa: { valor: number; variacao: number; pontos: number; data: string } | null;
  acoes: AcaoData[];
  fiis:  AcaoData[];
}

export interface CommodityItem {
  valor: number; variacao: number; data?: string; unidade?: string;
  symbol?: string; moeda?: string; nota?: string;
}

export interface CommoditiesData {
  brent:       CommodityItem | null;
  wti:         CommodityItem | null;
  gasNatural:  CommodityItem | null;
  ouro:        CommodityItem | null;
  prata:       CommodityItem | null;
  cobre:       CommodityItem | null;
  aluminio:    CommodityItem | null;
  trigo:       CommodityItem | null;
  milho:       CommodityItem | null;
  acucar:      CommodityItem | null;
  cafe:        CommodityItem | null;
  minerioFerro:CommodityItem | null; // TIO=F — Iron Ore SGX 62% Fe futures
  acoEtf:      CommodityItem | null; // SLX — VanEck Steel ETF (proxy aço global)
  vale:        CommodityItem | null;
  gerdau:      CommodityItem | null;
  hrcFutures:  CommodityItem | null; // HRC=F CME (USD/short ton — raw)
  hrcUsd:      CommodityItem | null; // HRC EUA convertido (USD/t métrico)
  hrcBrl:      CommodityItem | null; // HRC Brasil derivado (BRL/t)
  rebarBrl:    CommodityItem | null; // Vergalhão Brasil derivado (BRL/t)
  wireRodBrl:  CommodityItem | null; // Fio-Máquina Brasil derivado (BRL/t)
  scrapBrl:    CommodityItem | null; // Sucata derivada (BRL/t)
}

export interface CoinData {
  id: string; nome: string; simbolo: string;
  brl: number; usd: number; variacao24h: number;
  volume24hBrl: number; marketCapBrl: number;
}

export interface CryptoData {
  bitcoin:   CoinData | null;
  ethereum:  CoinData | null;
  solana:    CoinData | null;
  ripple:    CoinData | null;
  cardano:   CoinData | null;
  dogecoin:  CoinData | null;
}

export interface AllData {
  ok: boolean;
  updatedAt: string;
  macro:       MacroData | null;
  b3:          B3Data    | null;
  commodities: CommoditiesData | null;
  crypto:      CryptoData | null;
}

// ─── Helpers ──────────────────────────────────────────────────────
async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path}: ${res.status}`);
  return res.json();
}

// ─── Funções existentes (MySQL) ───────────────────────────────────
export async function getIndicators(category?: string): Promise<ApiIndicator[]> {
  const params = category ? `?category=${encodeURIComponent(category)}` : "";
  return get<ApiIndicator[]>(`/indicators${params}`);
}

export async function getIndicatorSeries(name: string): Promise<ApiSeries[]> {
  return get<ApiSeries[]>(`/indicators/series/${encodeURIComponent(name)}`);
}

export async function postIndicator(data: {
  category: string; name: string; value: number;
  unit?: string; change_pct?: number; region?: string; source?: string;
}): Promise<{ id: number }> {
  const res = await fetch(`${API_BASE}/indicators`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function subscribeNewsletter(
  email: string,
  plan: "daily" | "premium"
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, plan }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || `Erro ${res.status}`);
  }
  return res.json();
}

// ─── Novas funções (dados externos, cache diário) ─────────────────
export async function getAllData(): Promise<AllData> {
  return get<AllData>("/all");
}

export async function getMacro(): Promise<{ ok: boolean; updatedAt: string; data: MacroData }> {
  return get("/macro");
}

export async function getB3(): Promise<{ ok: boolean; updatedAt: string; data: B3Data }> {
  return get("/b3");
}

export async function getCommodities(): Promise<{ ok: boolean; updatedAt: string; data: CommoditiesData }> {
  return get("/commodities");
}

export async function getCrypto(): Promise<{ ok: boolean; updatedAt: string; data: CryptoData }> {
  return get("/crypto");
}
