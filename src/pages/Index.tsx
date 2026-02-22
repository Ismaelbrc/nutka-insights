import Header from "@/components/Header";
import DashboardSection from "@/components/sections/DashboardSection";
import CompaniesSection from "@/components/sections/CompaniesSection";
import ImportSection from "@/components/sections/ImportSection";
import ConsumptionSection from "@/components/sections/ConsumptionSection";
import MicroeconomySection from "@/components/sections/MicroeconomySection";
import MacroSection from "@/components/sections/MacroSection";
import InsightsSection from "@/components/sections/InsightsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container pb-12">
        <DashboardSection />
        <div className="my-4 border-t border-border" />
        <CompaniesSection />
        <div className="my-4 border-t border-border" />
        <ImportSection />
        <div className="my-4 border-t border-border" />
        <ConsumptionSection />
        <div className="my-4 border-t border-border" />
        <MicroeconomySection />
        <div className="my-4 border-t border-border" />
        <MacroSection />
        <div className="my-4 border-t border-border" />
        <InsightsSection />
        <div className="my-4 border-t border-border" />
        <NewsletterSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary py-4">
        <div className="container text-center">
          <p className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
            Terminal Nutka © 2026 · Steel & Macro Intelligence · Dados simulados para demonstração
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
