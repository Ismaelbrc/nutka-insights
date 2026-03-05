import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { subscribeNewsletter } from "@/lib/api";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<"daily" | "premium">("daily");
  const [successMsg, setSuccessMsg] = useState("");

  const mutation = useMutation({
    mutationFn: () => subscribeNewsletter(email, plan),
    onSuccess: (data) => {
      setSuccessMsg(data.message);
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSuccessMsg("");
    mutation.mutate();
  };

  return (
    <section id="newsletter" className="py-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
          Newsletter
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Briefing Diário */}
        <div className="rounded-md border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-data text-xs font-semibold uppercase tracking-wider text-primary">
              Briefing Diário
            </h3>
            <span className="font-data text-[10px] text-muted-foreground">
              22 Fev 2026
            </span>
          </div>
          <div className="space-y-3 font-serif text-xs leading-relaxed text-foreground/80">
            <p>
              <strong className="text-foreground">Minério de ferro</strong>{" "}
              recuou 2.3% com perspectiva de menor demanda chinesa no curto
              prazo. HRC doméstico segue estável, mas pressão de importados
              cresce.
            </p>
            <p>
              <strong className="text-foreground">Câmbio</strong> tocou R$
              5,87 — nível mais alto em 3 semanas. Correlação com HRC
              doméstico permanece elevada (0.87).
            </p>
            <p>
              <strong className="text-foreground">Construção civil</strong>{" "}
              apresenta sinais mistos: licenças em alta (+12% tri), mas
              confiança do setor estável em 97.2 pts.
            </p>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
              Nutka Research · Distribuição restrita
            </span>
          </div>
        </div>

        {/* Estratégico Semanal */}
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
              <strong className="text-foreground">Tese da semana:</strong>{" "}
              Aumento de importações chinesas de planos (+34% YoY) cria risco
              de compressão de margens para produtores domésticos. CSN e
              Usiminas são as mais expostas.
            </p>
            <p>
              <strong className="text-foreground">Oportunidade:</strong>{" "}
              Segmento de longos segue protegido por logística e demanda de
              infraestrutura. Gerdau com posicionamento favorável.
            </p>
            <p>
              <strong className="text-foreground">Macro:</strong> Selic em
              13.25% mantém pressão sobre financiamento imobiliário, mas
              pipeline de obras públicas em Goiás sustenta demanda regional.
            </p>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
              Nutka Intelligence · Uso institucional
            </span>
          </div>
        </div>
      </div>

      {/* Formulário de inscrição */}
      <div className="mt-4 rounded-md border border-border bg-card p-5">
        <h3 className="mb-3 font-data text-xs font-semibold uppercase tracking-wider text-primary">
          Receber Newsletter
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label className="mb-1 block font-data text-[10px] uppercase tracking-wider text-muted-foreground">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded border border-border bg-background px-3 py-2 font-data text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1 block font-data text-[10px] uppercase tracking-wider text-muted-foreground">
              Plano
            </label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as "daily" | "premium")}
              className="rounded border border-border bg-background px-3 py-2 font-data text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="daily">Diário (gratuito)</option>
              <option value="premium">Premium (semanal)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded bg-primary px-4 py-2 font-data text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {mutation.isPending ? "Aguarde..." : "Inscrever"}
          </button>
        </form>

        {successMsg && (
          <p className="mt-2 font-data text-[11px] text-primary">{successMsg}</p>
        )}
        {mutation.isError && (
          <p className="mt-2 font-data text-[11px] text-destructive">
            {(mutation.error as Error).message}
          </p>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
