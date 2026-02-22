const NewsletterSection = () => {
  return (
    <section id="newsletter" className="py-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
          Newsletter
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Daily */}
        <div className="rounded-md border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-data text-xs font-semibold uppercase tracking-wider text-primary">
              Briefing Diário
            </h3>
            <span className="font-data text-[10px] text-muted-foreground">22 Fev 2026</span>
          </div>
          <div className="space-y-3 font-serif text-xs leading-relaxed text-foreground/80">
            <p>
              <strong className="text-foreground">Minério de ferro</strong> recuou 2.3% com perspectiva de menor demanda chinesa no curto prazo. HRC doméstico segue estável, mas pressão de importados cresce.
            </p>
            <p>
              <strong className="text-foreground">Câmbio</strong> tocou R$ 5,87 — nível mais alto em 3 semanas. Correlação com HRC doméstico permanece elevada (0.87).
            </p>
            <p>
              <strong className="text-foreground">Construção civil</strong> apresenta sinais mistos: licenças em alta (+12% tri), mas confiança do setor estável em 97.2 pts.
            </p>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
              Nutka Research · Distribuição restrita
            </span>
          </div>
        </div>

        {/* Weekly Strategic */}
        <div className="rounded-md border border-primary/20 bg-card p-5 glow-teal">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-data text-xs font-semibold uppercase tracking-wider text-primary">
              Estratégico Semanal
            </h3>
            <span className="rounded bg-primary/20 px-2 py-0.5 font-data text-[10px] text-primary">
              PREMIUM
            </span>
          </div>
          <div className="space-y-3 font-serif text-xs leading-relaxed text-foreground/80">
            <p>
              <strong className="text-foreground">Tese da semana:</strong> Aumento de importações chinesas de planos (+34% YoY) cria risco de compressão de margens para produtores domésticos. CSN e Usiminas são as mais expostas.
            </p>
            <p>
              <strong className="text-foreground">Oportunidade:</strong> Segmento de longos segue protegido por logística e demanda de infraestrutura. Gerdau com posicionamento favorável.
            </p>
            <p>
              <strong className="text-foreground">Macro:</strong> Selic em 13.25% mantém pressão sobre financiamento imobiliário, mas pipeline de obras públicas em Goiás sustenta demanda regional.
            </p>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
              Nutka Intelligence · Uso institucional
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
