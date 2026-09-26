import React, { useState, useEffect } from 'react';
import { storageRepo } from '../repositories/storageRepository';
import { calculateCampaignResults } from '../services/calculationEngine';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Megaphone,
  ShieldAlert,
  ClipboardList,
  AlertCircle,
  Clock,
  CheckCircle2,
  Building2,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    return storageRepo.subscribe(() => setRefreshKey((k) => k + 1));
  }, []);

  const company = storageRepo.getCompany();
  const campaigns = storageRepo.getCampaigns();
  const risks = storageRepo.getRisks();
  const actionPlans = storageRepo.getActions();
  const responses = storageRepo.getResponses();

  // Metrics calculation
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'aberta' || c.status === 'em_analise');

  const pendingRiskAssessments = risks.filter((r) => r.resultingRiskLevel === 'pendente_avaliacao').length;
  const criticalRisksCount = risks.filter((r) => r.resultingRiskLevel === 'critico' || r.resultingRiskLevel === 'alto').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingActionsCount = actionPlans.filter((a) => a.status === 'proposta').length;
  const overdueActionsCount = actionPlans.filter(
    (a) => a.status === 'em_andamento' && a.deadline && a.deadline < todayStr
  ).length;
  const awaitingEfficacyCount = actionPlans.filter((a) => a.status === 'em_verificacao_eficacia').length;

  // Primary campaign results for summary
  const primaryCampaign = campaigns[0];
  const demoInstrument = storageRepo.getInstruments().find((i) => i.code === 'DEMO_PSICO_12');
  const campaignResponses = primaryCampaign ? responses.filter((r) => r.campaignId === primaryCampaign.id) : [];

  const mainCalculation = demoInstrument && primaryCampaign
    ? calculateCampaignResults(demoInstrument, campaignResponses, undefined, 5)
    : null;

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
            <Building2 className="w-4 h-4 text-teal-700" />
            <span>{company.name}</span>
            <span className="text-stone-300">·</span>
            <span className="text-stone-500 font-normal">{company.establishmentName}</span>
          </div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">
            Gestão de Riscos Psicossociais Ocupacionais (NR-1)
          </h1>
          <p className="text-xs text-stone-500 max-w-2xl">
            Painel consolidado para acompanhamento de pesquisas, avaliação técnica de riscos e efetividade dos planos de ação para subsídio ao GRO/PGR.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('/action-plans')}
            className="px-3.5 py-2 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-200" />
            <span>Gerar Sugestões de Ação com IA</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Campanhas */}
        <div
          onClick={() => onNavigate('/campaigns')}
          className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs hover:border-stone-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Campanhas</span>
            <Megaphone className="w-4 h-4 text-teal-700" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">{totalCampaigns}</span>
            <span className="text-xs text-stone-500 font-medium">
              {activeCampaigns.length} ativas/em análise
            </span>
          </div>
          <p className="text-[11px] text-stone-400">Total de {campaignResponses.length} respostas coletadas</p>
        </div>

        {/* Card 2: Riscos a Avaliar */}
        <div
          onClick={() => onNavigate('/risk-inventory')}
          className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs hover:border-stone-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Inventário de Riscos</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">{risks.length}</span>
            <span className="text-xs text-red-700 font-medium">
              {criticalRisksCount} críticos/altos
            </span>
          </div>
          <p className="text-[11px] text-stone-400">
            {pendingRiskAssessments > 0
              ? `${pendingRiskAssessments} risco(s) aguardando avaliação`
              : 'Todos os riscos avaliados'}
          </p>
        </div>

        {/* Card 3: Ações Pendentes e Atrasadas */}
        <div
          onClick={() => onNavigate('/action-plans')}
          className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs hover:border-stone-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Planos de Ação</span>
            <ClipboardList className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">{actionPlans.length}</span>
            <span className={`text-xs font-medium ${overdueActionsCount > 0 ? 'text-red-700 font-bold' : 'text-stone-500'}`}>
              {overdueActionsCount} atrasada(s)
            </span>
          </div>
          <p className="text-[11px] text-stone-400">{pendingActionsCount} proposta(s) aguardando revisão</p>
        </div>

        {/* Card 4: Verificação de Eficácia */}
        <div
          onClick={() => onNavigate('/action-plans')}
          className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs hover:border-stone-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Eficácia (NR-1)</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">{awaitingEfficacyCount}</span>
            <span className="text-xs text-indigo-700 font-medium">
              Em verificação
            </span>
          </div>
          <p className="text-[11px] text-stone-400">Verificação obrigatória antes da conclusão</p>
        </div>
      </div>

      {/* Critical Operational Alerts */}
      {(overdueActionsCount > 0 || pendingRiskAssessments > 0 || pendingActionsCount > 0) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Alertas de Pendências Técnicas Ocupacionais</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-stone-700">
            {overdueActionsCount > 0 && (
              <div className="p-2.5 bg-white rounded-lg border border-red-200 flex items-start gap-2">
                <Clock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-900 block font-semibold">{overdueActionsCount} ação(ões) com prazo vencido</strong>
                  <span className="text-stone-500 text-[11px]">Requer atualização de prazo ou justificativa de execução.</span>
                </div>
              </div>
            )}
            {pendingRiskAssessments > 0 && (
              <div className="p-2.5 bg-white rounded-lg border border-amber-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-900 block font-semibold">{pendingRiskAssessments} risco(s) sem avaliação</strong>
                  <span className="text-stone-500 text-[11px]">Classificação de severidade x probabilidade pendente.</span>
                </div>
              </div>
            )}
            {pendingActionsCount > 0 && (
              <div className="p-2.5 bg-white rounded-lg border border-purple-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-purple-900 block font-semibold">{pendingActionsCount} sugestão(ões) de IA para revisão</strong>
                  <span className="text-stone-500 text-[11px]">Propostas geradas aguardando análise e aprovação humana.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Grid: Primary Findings & Action Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Results Preview */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Resultado Agregado da Campanha Principal</h2>
              <p className="text-xs text-stone-500">{primaryCampaign?.name || 'Nenhuma campanha cadastrada'}</p>
            </div>
            <button
              onClick={() => onNavigate('/results')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Ver resultados detalhados</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {mainCalculation && mainCalculation.dimensionScores.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <span>Respostas analisadas: <strong className="text-stone-800 font-mono">{mainCalculation.validResponsesForAnalysis}</strong></span>
                <span>Limite mínimo de privacidade: <strong className="text-stone-800 font-mono">K = {mainCalculation.minimumThresholdK}</strong></span>
                <span>Status: <strong className="text-emerald-700 font-medium">Calculado (OK)</strong></span>
              </div>

              <div className="space-y-3 pt-1">
                {mainCalculation.dimensionScores.map((score) => (
                  <div key={score.dimensionId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-800">{score.dimensionName}</span>
                      <span className="font-mono tabular-nums font-bold text-stone-900">{score.normalizedScore.toFixed(1)} / 100</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          score.desirableDirection === 'high'
                            ? score.normalizedScore >= 60 ? 'bg-emerald-600' : 'bg-amber-500'
                            : score.normalizedScore >= 60 ? 'bg-red-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${score.normalizedScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-stone-500">Nenhum resultado calculado.</div>
          )}
        </div>

        {/* Right 1 Col: Quick Action Status Breakdown */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-sm font-bold text-stone-900">Acompanhamento dos Planos de Ação</h2>
            <p className="text-xs text-stone-500">Ações preventivas e controle de efetividade</p>
          </div>

          <div className="space-y-3 text-xs">
            {actionPlans.slice(0, 4).map((action) => (
              <div
                key={action.id}
                onClick={() => onNavigate('/action-plans')}
                className="p-3 bg-stone-50/80 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-stone-700 text-[11px]">{action.code}</span>
                  <StatusBadge type="action_status" value={action.status} />
                </div>
                <p className="font-medium text-stone-900 line-clamp-2">{action.title}</p>
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-200/50">
                  <span>Resp: {action.responsiblePerson || action.responsibleRole}</span>
                  <span>Prazo: {action.deadline}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('/action-plans')}
            className="w-full py-2 text-xs font-semibold text-center text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200"
          >
            Gerenciar Todos os Planos de Ação
          </button>
        </div>
      </div>
    </div>
  );
};
