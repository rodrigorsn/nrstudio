import React from 'react';
import { DimensionScore } from '../../types/domain';

interface DimensionBarChartProps {
  scores: DimensionScore[];
}

export const DimensionBarChart: React.FC<DimensionBarChartProps> = ({ scores }) => {
  if (!scores || scores.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-lg border border-dashed border-stone-200">
        Nenhum dado de dimensão disponível para exibição.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scores.map((score) => {
        const isSuppressed = score.status === 'suprimido_privacidade';
        const isInsufficient = score.status === 'dados_insuficientes';

        // Color coding based on desirable direction and score
        // High desirable: >70 Green, 40-70 Amber, <40 Red
        // Low desirable (High = Risk): >70 Red, 40-70 Amber, <40 Green
        let barColor = 'bg-stone-300';
        if (score.status === 'calculado') {
          if (score.desirableDirection === 'high') {
            if (score.normalizedScore >= 70) barColor = 'bg-emerald-600';
            else if (score.normalizedScore >= 45) barColor = 'bg-amber-500';
            else barColor = 'bg-red-500';
          } else {
            if (score.normalizedScore >= 70) barColor = 'bg-red-500';
            else if (score.normalizedScore >= 45) barColor = 'bg-amber-500';
            else barColor = 'bg-emerald-600';
          }
        }

        return (
          <div key={score.dimensionId} className="space-y-1.5 p-3 rounded-lg bg-stone-50/70 border border-stone-200/60">
            <div className="flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-stone-900">{score.dimensionName}</span>
                <p className="text-[11px] text-stone-500">
                  {score.desirableDirection === 'high'
                    ? '↑ Pontuação alta é favorável'
                    : '↓ Pontuação alta indica maior exigência/risco'}
                </p>
              </div>

              <div className="text-right">
                {isSuppressed ? (
                  <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                    Suprimido (K &lt; 5)
                  </span>
                ) : isInsufficient ? (
                  <span className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded font-medium">
                    Dados Insuficientes
                  </span>
                ) : (
                  <div className="font-mono tabular-nums text-sm font-bold text-stone-900">
                    {score.normalizedScore.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-stone-500">/ 100</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bar Track */}
            <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden">
              {!isSuppressed && !isInsufficient && (
                <div
                  className={`h-full ${barColor} transition-all duration-500 rounded-full`}
                  style={{ width: `${Math.min(100, Math.max(0, score.normalizedScore))}%` }}
                />
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span>0 (Menor e.g.)</span>
              <span>{score.interpretationNote}</span>
              <span>100 (Maior e.g.)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface QuestionDistributionProps {
  questionText: string;
  distribution: Record<number, number>; // 1->count, 2->count, ...
  optionsLabels?: string[];
}

export const QuestionDistributionBar: React.FC<QuestionDistributionProps> = ({
  questionText,
  distribution,
  optionsLabels = [
    '1 - Nunca',
    '2 - Raramente',
    '3 - Às vezes',
    '4 - Frequentemente',
    '5 - Sempre',
  ],
}) => {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-2 p-3 bg-white border border-stone-200 rounded-lg">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-stone-900">{questionText}</p>
        <span className="text-[11px] text-stone-500 font-mono tabular-nums shrink-0">
          {total} resps
        </span>
      </div>

      <div className="space-y-1">
        {[1, 2, 3, 4, 5].map((val, idx) => {
          const count = distribution[val] || 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={val} className="flex items-center gap-2 text-[11px]">
              <span className="w-28 text-stone-600 truncate">{optionsLabels[idx] || `Opção ${val}`}</span>
              <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-12 text-right font-mono tabular-nums text-stone-500">
                {count} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface RiskMatrixProps {
  selectedSeverity?: number;
  selectedProbability?: number;
  onSelectCell?: (severity: number, probability: number) => void;
}

export const RiskMatrixGrid: React.FC<RiskMatrixProps> = ({
  selectedSeverity,
  selectedProbability,
  onSelectCell,
}) => {
  // Severity (Rows 5 down to 1), Probability (Cols 1 to 5)
  const severities = [5, 4, 3, 2, 1];
  const probabilities = [1, 2, 3, 4, 5];

  const getCellColor = (sev: number, prob: number) => {
    const score = sev * prob;
    if (score >= 20) return 'bg-red-500 text-white hover:bg-red-600';
    if (score >= 12) return 'bg-orange-500 text-white hover:bg-orange-600';
    if (score >= 6) return 'bg-amber-400 text-amber-950 hover:bg-amber-500';
    if (score >= 3) return 'bg-emerald-300 text-emerald-950 hover:bg-emerald-400';
    return 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
        <span>Matriz demonstrativa: Severidade x Probabilidade</span>
        <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          Critério demonstrativo — requer validação técnica
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-1.5 text-stone-400 font-normal text-[11px]">Sev \ Prob</th>
              {probabilities.map((p) => (
                <th key={p} className="p-1.5 text-stone-600 font-medium text-[11px]">
                  P{p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {severities.map((s) => (
              <tr key={s}>
                <td className="p-1.5 font-medium text-stone-600 text-[11px]">S{s}</td>
                {probabilities.map((p) => {
                  const isSelected = selectedSeverity === s && selectedProbability === p;
                  const score = s * p;
                  return (
                    <td key={p} className="p-1">
                      <button
                        type="button"
                        onClick={() => onSelectCell && onSelectCell(s, p)}
                        className={`w-full py-2 rounded font-mono font-bold text-xs transition-transform ${getCellColor(
                          s,
                          p
                        )} ${isSelected ? 'ring-2 ring-stone-900 ring-offset-1 scale-105 shadow-md' : 'opacity-90'}`}
                      >
                        {score}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 pt-1">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-200 rounded" /> Baixíssimo/Baixo (1-5)</span>
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-400 rounded" /> Médio (6-10)</span>
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 bg-orange-500 rounded" /> Alto (12-16)</span>
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded" /> Crítico (20-25)</span>
        </div>
      </div>
    </div>
  );
};
