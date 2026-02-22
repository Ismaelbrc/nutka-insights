import logoNutka from "@/assets/logo-nutka.png";

const NAV_ITEMS = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Empresas", href: "#empresas" },
  { label: "Importações", href: "#importacoes" },
  { label: "Consumo", href: "#consumo" },
  { label: "Macro", href: "#macro" },
  { label: "Insights", href: "#insights" },
  { label: "Newsletter", href: "#newsletter" },
];

const Header = () => {
  return (
    <>
      {/* Header 1 — Institucional */}
      <header className="border-b border-border bg-secondary py-6">
        <div className="container flex flex-col items-center gap-2">
          <img src={logoNutka} alt="Nutka" className="h-16 w-auto" />
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-widest text-foreground">
              TERMINAL <span className="text-primary">NUTKA</span>
            </h1>
            <p className="font-serif text-sm tracking-wider text-muted-foreground">
              Steel & Macro Intelligence
            </p>
          </div>
        </div>
      </header>

      {/* Header 2 — Navegação */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center gap-1 overflow-x-auto py-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-sm px-3 py-1.5 font-data text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {item.label}
            </a>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse-glow rounded-full bg-success" />
            <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
              Live Data
            </span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
