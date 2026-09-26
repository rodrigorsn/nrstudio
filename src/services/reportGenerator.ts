/**
 * Report Generator for PsicoGestão NR-1
 * Prepares printable report snapshots with immutable audit logs.
 */

import { ActionPlanItem, Campaign, Company, CalculationResult, RiskAssessment, ReportSnapshot } from '../types/domain';

export function compileReportSnapshot(
  company: Company,
  campaigns: Campaign[],
  calculationResults: CalculationResult[],
  risks: RiskAssessment[],
  actionPlans: ActionPlanItem[]
): ReportSnapshot {
  const risksSummaryCount = {
    baixissimo: risks.filter((r) => r.resultingRiskLevel === 'baixissimo').length,
    baixo: risks.filter((r) => r.resultingRiskLevel === 'baixo').length,
    medio: risks.filter((r) => r.resultingRiskLevel === 'medio').length,
    alto: risks.filter((r) => r.resultingRiskLevel === 'alto').length,
    critico: risks.filter((r) => r.resultingRiskLevel === 'critico').length,
    pendente_avaliacao: risks.filter((r) => r.resultingRiskLevel === 'pendente_avaliacao').length,
  };

  const actionPlansSummaryCount = {
    proposta: actionPlans.filter((a) => a.status === 'proposta').length,
    aprovada: actionPlans.filter((a) => a.status === 'aprovada').length,
    em_andamento: actionPlans.filter((a) => a.status === 'em_andamento').length,
    implementada: actionPlans.filter((a) => a.status === 'implementada').length,
    em_verificacao_eficacia: actionPlans.filter((a) => a.status === 'em_verificacao_eficacia').length,
    concluida: actionPlans.filter((a) => a.status === 'concluida').length,
    cancelada: actionPlans.filter((a) => a.status === 'cancelada').length,
  };

  const totalResponses = calculationResults.reduce((acc, curr) => acc + curr.totalResponsesReceived, 0);

  const immutableDataJSON = JSON.stringify(
    {
      company,
      campaigns,
      calculationResults,
      risks,
      approvedActionPlans: actionPlans.filter((a) => a.status !== 'proposta' && a.status !== 'cancelada'),
    },
    null,
    2
  );

  return {
    id: `REP-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    companyName: company.name,
    establishmentName: company.establishmentName,
    cnpj: company.cnpj,
    evaluatorName: company.responsibleEvaluator,
    evaluatorRole: company.responsibleRole,
    campaignsIncluded: campaigns.map((c) => c.name),
    totalResponsesAnalyzed: totalResponses,
    risksSummaryCount,
    actionPlansSummaryCount,
    immutableDataJSON,
  };
}
