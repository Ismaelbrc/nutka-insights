import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, ComposedChart, Area,
} from "recharts";
import { importData } from "@/data/mockData";

const tooltipStyle = {
  backgroundColor: 'hsl(240, 4%, 14%)',
  border: '1px solid hsl(240, 3%, 20%)',
  borderRadius: '4px',
  fontSize: 11,
  color: 'hsl(37, 45%, 93%)',
};

const axisTick = { fontSize: 10, fill: 'hsl(156, 4%, 60%)' };

const ImportSection = () => {
  // Calculate YoY
  const yoyData = importData.map((d, i) => ({
    month: d.month,
    flatYoY: i > 0 ? ((d.flatSteel - importData[i - 1].flatSteel) / importData[i - 1].flatSteel * 100) : 0,
    longYoY: i > 0 ? ((d.longSteel - importData[i - 1].longSteel) / importData[i - 1].longSteel * 100) : 0,
  }));

  return (
    <section id="importacoes" className="py-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
          Importações & Comércio Exterior
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Flat & Long Steel Imports */}
        <div className="rounded-md border border-border bg-card p-4">
          <h3 className="mb-3 font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Importação por Tipo (kt)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={importData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3%, 20%)" />
              <XAxis dataKey="month" tick={axisTick} tickLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="flatSteel" name="Planos" fill="hsl(191, 67%, 35%)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="longSteel" name="Longos" fill="hsl(30, 55%, 46%)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* China Share */}
        <div className="rounded-md border border-border bg-card p-4">
          <h3 className="mb-3 font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Participação da China (%)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={importData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3%, 20%)" />
              <XAxis dataKey="month" tick={axisTick} tickLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="chinaShare" fill="hsl(0, 72%, 51% / 0.15)" stroke="hsl(0, 72%, 51%)" strokeWidth={2} name="China %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* YoY */}
        <div className="rounded-md border border-border bg-card p-4 md:col-span-2">
          <h3 className="mb-3 font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Variação YoY (%)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={yoyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3%, 20%)" />
              <XAxis dataKey="month" tick={axisTick} tickLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="flatYoY" name="Planos YoY" stroke="hsl(191, 67%, 40%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="longYoY" name="Longos YoY" stroke="hsl(30, 55%, 46%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default ImportSection;
