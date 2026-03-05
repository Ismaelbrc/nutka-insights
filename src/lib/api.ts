// ===== API CLIENT =====
// Conecta ao backend Express que acessa o MySQL (ligecom20)

const API_BASE = "/bloomberg/api";

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

export async function getIndicators(category?: string): Promise<ApiIndicator[]> {
  const params = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await fetch(`${API_BASE}/indicators${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getIndicatorSeries(name: string): Promise<ApiSeries[]> {
  const res = await fetch(
    `${API_BASE}/indicators/series/${encodeURIComponent(name)}`
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function postIndicator(data: {
  category: string;
  name: string;
  value: number;
  unit?: string;
  change_pct?: number;
  region?: string;
  source?: string;
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
