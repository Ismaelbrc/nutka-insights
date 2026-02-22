import { useMemo } from "react";
import { inpaLabel } from "@/data/microeconomyData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface INPAGaugeProps {
  score: number;
}

const INPAGauge = ({ score }: INPAGaugeProps) => {
  const label = useMemo(() => inpaLabel(score), [score]);

  const colorClass =
    label.color === 'negative' ? 'text-negative' :
    label.color === 'positive' ? 'text-positive' : 'text-info';

  const strokeColor =
    label.color === 'negative' ? 'hsl(0, 72%, 51%)' :
    label.color === 'positive' ? 'hsl(142, 71%, 45%)' : 'hsl(191, 67%, 45%)';

  // SVG arc gauge (180 degrees)
  const radius = 70;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="font-data text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          INPA — Índice Nutka de Pressão do Aço
        </h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3 w-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[220px] text-xs">
                Modelo sintético: 30% Minério, 20% USD/BRL, 20% Consumo Aparente,
                15% Crédito Imobiliário, 15% Produção Construção.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex flex-col items-center">
        <svg width="180" height="100" viewBox="0 0 180 100">
          {/* Background arc */}
          <path
            d="M 10 90 A 70 70 0 0 1 170 90"
            fill="none"
            stroke="hsl(240, 3%, 20%)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d="M 10 90 A 70 70 0 0 1 170 90"
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
          />
        </svg>
        <div className="-mt-8 text-center">
          <span className="font-data text-3xl font-bold text-foreground">{score.toFixed(1)}</span>
          <span className="font-data text-sm text-muted-foreground">/100</span>
        </div>
        <span className={`mt-1 font-data text-xs font-semibold uppercase ${colorClass}`}>
          {label.text}
        </span>
        <p className="mt-2 max-w-[260px] text-center font-serif-body text-[10px] leading-relaxed text-muted-foreground">
          Modelo sintético baseado em variáveis líderes do setor de aço.
        </p>
      </div>
    </div>
  );
};

export default INPAGauge;
