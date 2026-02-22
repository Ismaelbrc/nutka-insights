import { indicators } from "@/data/mockData";
import IndicatorCard from "@/components/IndicatorCard";
import CorrelationChart from "@/components/charts/CorrelationChart";

const DashboardSection = () => {
  return (
    <section id="dashboard" className="py-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
          Dashboard Principal
        </h2>
      </div>

      {/* Indicator Grid */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
        {indicators.map((ind) => (
          <IndicatorCard key={ind.id} indicator={ind} />
        ))}
      </div>

      {/* Correlation Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <CorrelationChart type="dollar" />
        <CorrelationChart type="ore" />
      </div>
    </section>
  );
};

export default DashboardSection;
