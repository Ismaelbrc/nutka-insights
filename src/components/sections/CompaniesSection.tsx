import { useState } from "react";
import { companies } from "@/data/mockData";
import Sparkline from "@/components/charts/Sparkline";
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip,
} from "recharts";

const CompaniesSection = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedCompany = companies.find((c) => c.ticker === selected);

  const brasilCompanies = companies.filter((c) => c.country === 'Brasil');
  const intlCompanies = companies.filter((c) => c.country === 'Internacional');

  return (
    <section id="empresas" className="py-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
          Empresas de Aço
        </h2>
      </div>

      <div className="flex gap-4">
        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                {['Empresa', 'Ticker', 'Preço', 'Mkt Cap', 'EV/EBITDA', 'P/L', 'Margem', 'Receita', 'Dív. Líq.', ''].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-data text-[10px] uppercase tracking-wider text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Brasil', data: brasilCompanies },
                { label: 'Internacional', data: intlCompanies },
              ].map((group) => (
                <>
                  <tr key={group.label}>
                    <td colSpan={10} className="px-3 py-1.5 font-data text-[10px] uppercase tracking-widest text-primary">
                      {group.label}
                    </td>
                  </tr>
                  {group.data.map((c) => (
                    <tr
                      key={c.ticker}
                      onClick={() => setSelected(selected === c.ticker ? null : c.ticker)}
                      className={`cursor-pointer border-b border-border/50 transition-colors hover:bg-primary/5 ${selected === c.ticker ? 'bg-primary/10' : ''}`}
                    >
                      <td className="px-3 py-2 font-data text-xs font-semibold text-foreground">{c.name}</td>
                      <td className="px-3 py-2 font-data text-xs text-muted-foreground">{c.ticker}</td>
                      <td className="px-3 py-2 font-data text-xs text-foreground">
                        {c.currency === 'BRL' ? 'R$' : c.currency === 'EUR' ? '€' : '$'}{c.price.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 font-data text-xs text-muted-foreground">{c.marketCap}</td>
                      <td className="px-3 py-2 font-data text-xs text-foreground">{c.evEbitda.toFixed(1)}x</td>
                      <td className="px-3 py-2 font-data text-xs text-foreground">{c.pe.toFixed(1)}x</td>
                      <td className="px-3 py-2 font-data text-xs text-foreground">{c.ebitdaMargin.toFixed(1)}%</td>
                      <td className="px-3 py-2 font-data text-xs text-muted-foreground">{c.revenue}</td>
                      <td className="px-3 py-2 font-data text-xs text-muted-foreground">{c.netDebt}</td>
                      <td className="px-3 py-2">
                        <Sparkline data={c.history} positive={c.history[c.history.length - 1] >= c.history[0]} width={60} height={20} />
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Side Panel */}
        {selectedCompany && (
          <div className="w-72 shrink-0 rounded-md border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-data text-sm font-bold text-foreground">{selectedCompany.name}</h3>
                <span className="font-data text-[10px] text-muted-foreground">{selectedCompany.ticker}</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="mb-3">
              <span className="font-data text-2xl font-bold text-foreground">
                {selectedCompany.currency === 'BRL' ? 'R$' : selectedCompany.currency === 'EUR' ? '€' : '$'}
                {selectedCompany.price.toFixed(2)}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={selectedCompany.history.map((v, i) => ({ i, v }))}>
                <XAxis dataKey="i" hide />
                <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(240, 4%, 14%)',
                    border: '1px solid hsl(240, 3%, 20%)',
                    borderRadius: '4px',
                    fontSize: 11,
                    color: 'hsl(37, 45%, 93%)',
                  }}
                />
                <Line type="monotone" dataKey="v" stroke="hsl(191, 67%, 40%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {[
                ['Market Cap', selectedCompany.marketCap],
                ['EV/EBITDA', `${selectedCompany.evEbitda.toFixed(1)}x`],
                ['P/L', `${selectedCompany.pe.toFixed(1)}x`],
                ['Margem EBITDA', `${selectedCompany.ebitdaMargin.toFixed(1)}%`],
                ['Receita', selectedCompany.revenue],
                ['Dívida Líquida', selectedCompany.netDebt],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border/50 pb-1">
                  <span className="font-data text-[10px] text-muted-foreground">{k}</span>
                  <span className="font-data text-xs font-semibold text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompaniesSection;
