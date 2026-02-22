import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area,
} from "recharts";
import { consumptionData } from "@/data/mockData";

const tooltipStyle = {
  backgroundColor: 'hsl(240, 4%, 14%)',
  border: '1px solid hsl(240, 3%, 20%)',
  borderRadius: '4px',
  fontSize: 11,
  color: 'hsl(37, 45%, 93%)',
};
const axisTick = { fontSize: 10, fill: 'hsl(156, 4%, 60%)' };

const ConsumptionSection = () => {
  return (
    <section id="consumo" className="py-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
          Consumo Aparente
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-4">
          <h3 className="mb-3 font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Consumo Brasil (kt)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={consumptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3%, 20%)" />
              <XAxis dataKey="month" tick={axisTick} tickLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="flatConsumption" name="Planos" fill="hsl(191, 67%, 35%)" stackId="a" />
              <Bar dataKey="longConsumption" name="Longos" fill="hsl(191, 67%, 55%)" stackId="a" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <h3 className="mb-3 font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Produção vs Utilização de Capacidade
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={consumptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3%, 20%)" />
              <XAxis dataKey="month" tick={axisTick} tickLine={false} />
              <YAxis yAxisId="left" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={axisTick} tickLine={false} axisLine={false} domain={[60, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line yAxisId="left" type="monotone" dataKey="production" name="Produção (kt)" stroke="hsl(30, 55%, 46%)" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="capacityUtil" name="Utilização (%)" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-md border border-border bg-card p-4 md:col-span-2">
          <h3 className="mb-3 font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Importação / Consumo (%)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={consumptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3%, 20%)" />
              <XAxis dataKey="month" tick={axisTick} tickLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="importRatio" name="Import/Consumo %" fill="hsl(0, 72%, 51% / 0.15)" stroke="hsl(0, 72%, 51%)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default ConsumptionSection;
