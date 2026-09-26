import React from 'react';
import { CampaignStatus, RiskAssessmentStatus, RiskLevel, ActionStatus } from '../../types/domain';

interface StatusBadgeProps {
  type: 'campaign' | 'risk_level' | 'risk_status' | 'action_status';
  value: CampaignStatus | RiskLevel | RiskAssessmentStatus | ActionStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, className = '' }) => {
  let label = String(value);
  let dotColor = 'bg-stone-400';
  let textColor = 'text-stone-700';

  if (type === 'campaign') {
    switch (value as CampaignStatus) {
      case 'rascunho':
        label = 'Rascunho';
        dotColor = 'bg-stone-400';
        textColor = 'text-stone-600';
        break;
      case 'aberta':
        label = 'Aberta';
        dotColor = 'bg-emerald-500';
        textColor = 'text-emerald-800';
        break;
      case 'encerrada':
        label = 'Encerrada';
        dotColor = 'bg-amber-500';
        textColor = 'text-amber-800';
        break;
      case 'em_analise':
        label = 'Em análise';
        dotColor = 'bg-teal-500';
        textColor = 'text-teal-800';
        break;
      case 'finalizada':
        label = 'Finalizada';
        dotColor = 'bg-stone-600';
        textColor = 'text-stone-700';
        break;
    }
  } else if (type === 'risk_level') {
    switch (value as RiskLevel) {
      case 'baixissimo':
        label = 'Baixíssimo';
        dotColor = 'bg-emerald-400';
        textColor = 'text-emerald-700';
        break;
      case 'baixo':
        label = 'Baixo';
        dotColor = 'bg-emerald-600';
        textColor = 'text-emerald-800';
        break;
      case 'medio':
        label = 'Médio';
        dotColor = 'bg-amber-500';
        textColor = 'text-amber-800';
        break;
      case 'alto':
        label = 'Alto';
        dotColor = 'bg-orange-600';
        textColor = 'text-orange-900';
        break;
      case 'critico':
        label = 'Crítico';
        dotColor = 'bg-red-600';
        textColor = 'text-red-900 font-semibold';
        break;
      case 'pendente_avaliacao':
        label = 'Pendente de avaliação';
        dotColor = 'bg-stone-400';
        textColor = 'text-stone-500 italic';
        break;
    }
  } else if (type === 'risk_status') {
    switch (value as RiskAssessmentStatus) {
      case 'em_analise':
        label = 'Em análise';
        dotColor = 'bg-amber-400';
        textColor = 'text-amber-800';
        break;
      case 'aguardando_informacoes':
        label = 'Aguardando informações';
        dotColor = 'bg-blue-400';
        textColor = 'text-blue-800';
        break;
      case 'avaliado':
        label = 'Avaliado';
        dotColor = 'bg-emerald-600';
        textColor = 'text-emerald-800';
        break;
    }
  } else if (type === 'action_status') {
    switch (value as ActionStatus) {
      case 'proposta':
        label = 'Proposta (Aguardando Revisão)';
        dotColor = 'bg-purple-500';
        textColor = 'text-purple-800';
        break;
      case 'aprovada':
        label = 'Aprovada';
        dotColor = 'bg-blue-500';
        textColor = 'text-blue-800';
        break;
      case 'em_andamento':
        label = 'Em andamento';
        dotColor = 'bg-amber-500';
        textColor = 'text-amber-800';
        break;
      case 'implementada':
        label = 'Implementada';
        dotColor = 'bg-teal-600';
        textColor = 'text-teal-800';
        break;
      case 'em_verificacao_eficacia':
        label = 'Em verificação de eficácia';
        dotColor = 'bg-indigo-500';
        textColor = 'text-indigo-800 font-medium';
        break;
      case 'concluida':
        label = 'Concluída';
        dotColor = 'bg-emerald-600';
        textColor = 'text-emerald-800 font-medium';
        break;
      case 'cancelada':
        label = 'Cancelada';
        dotColor = 'bg-stone-400';
        textColor = 'text-stone-500 line-through';
        break;
    }
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${textColor} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};
