import React, { useState } from 'react';
import { storageRepo } from '../repositories/storageRepository';
import { compileReportSnapshot } from '../services/reportGenerator';
import { calculateCampaignResults } from '../services/calculationEngine';
import { StatusBadge } from '../components/common/StatusBadge';
import { Printer, Download, ShieldAlert, FileText, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const company = storageRepo.getCompany();
  const campaigns = storageRepo.getCampaigns();
  const risks = storageRepo.getRisks();
  const actionPlans = storageRepo.getActions();
  const responses = storageRepo.getResponses();
  const instruments = storageRepo.getInstruments();
  const demoInstrument = instruments.find((i) => i.code === 'DEMO_PSICO_12') || instruments[0];

  const primaryCampaign = campaigns[0];
  const campaignResponses = primaryCampaign ? responses.filter((r) => r.campaignId === primaryCampaign.id) : [];

  const mainCalculation = demoInstrument && primaryCampaign
    ? calculateCampaignResults(demoInstrument, campaignResponses, undefined, 5)
    : null;

  const snapshot = compileReportSnapshot(
    company,
    campaigns,
    mainCalculation ? [mainCalculation] : [],
    risks,
    actionPlans
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSnapshotJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(snapshot.immutableDataJSON);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `relatorio_psicogestao_${snapshot.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Relatório de Subsídio ao GRO/PGR</h1>
          <p className="text-xs text-stone-500">
            Documento consolidado para integração ao Programa de Gerenciamento de Riscos (NR-1).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadSnapshotJSON}
            className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 border border-stone-200"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Baixar Snapshot JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Shell */}
      <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-xs space-y-8 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* MANDATORY WATERMARK HEADER */}
        <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-lg text-center text-amber-900 text-xs font-bold uppercase tracking-wider">
          DEMONSTRAÇÃO — dados fictícios; não utilizar como documento técnico final
        </div>

        {/* Document Header */}
        <div className="border-b-2 border-stone-900 pb-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>PsicoGestão NR-1 — Sistema de Gestão Psicossocial</span>
            <span className="font-mono">ID: {snapshot.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 leading-tight">
            Relatório de Avaliação de Fatores de Risco Psicossociais
          </h1>
          <h2 className="text-sm font-semibold text-teal-800 uppercase tracking-wide">
            Subsídio Técnico ao Gerenciamento de Riscos Ocupacionais (GRO / PGR — NR-1)
          </h2>
        </div>

        {/* Section 1: Company & Establishment */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-1">
            1. Empresa e Estabelecimento
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs text-stone-700">
            <div>
              <p><strong>Razão Social:</strong> {company.name}</p>
              <p><strong>Estabelecimento:</strong> {company.establishmentName}</p>
              <p><strong>CNPJ:</strong> {company.cnpj || 'Não informado'}</p>
            </div>
            <div>
              <p><strong>CNAE / Atividade:</strong> {company.economicActivityCnae}</p>
              <p><strong>Trabalhadores no Local:</strong> {company.totalWorkerCount}</p>
              <p><strong>Avaliador Responsável:</strong> {company.responsibleEvaluator} ({company.responsibleRole})</p>
            </div>
          </div>
        </div>

        {/* Section 2: Objective & Scope */}
        <div className="space-y-2 text-xs text-stone-700">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-1">
            2. Objetivo e Escopo
          </h2>
          <p className="leading-relaxed">
            Este documento apresenta os resultados estatísticos agregados da avaliação de fatores psicossociais relacionados ao trabalho, bem como o inventário de riscos graduados e o plano de ação de medidas de controle aprovadas para integração ao PGR da empresa, conforme estabelecido no item 1.5 da Norma Regulamentadora nº 1 (NR-1).
          </p>
        </div>

        {/* Section 3: Methodology & Instrument */}
        <div className="space-y-2 text-xs text-stone-700">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-1">
            3. Instrumento e Metodologia Utilizada
          </h2>
          <p><strong>Instrumento:</strong> {demoInstrument.name} ({demoInstrument.edition})</p>
          <p><strong>Condição do Instrumento:</strong> {demoInstrument.limitationsNotice}</p>
          <p className="text-stone-500 italic">
            Regra de privacidade aplicada: Supressão automática de resultados para grupos com menos de 5 respostas válidas (K ≥ 5).
          </p>
        </div>

        {/* Section 4: Aggregated Results Summary */}
        <div className="space-y-3 text-xs">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-1">
            4. Resultados Agregados por Dimensão
          </h2>

          {mainCalculation && !mainCalculation.isPrivacySuppressed ? (
            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-2.5">Dimensão Psicossocial</th>
                    <th className="p-2.5">Escore Normalizado (0-100)</th>
                    <th className="p-2.5">Direção Desejável</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-800">
                  {mainCalculation.dimensionScores.map((score) => (
                    <tr key={score.dimensionId}>
                      <td className="p-2.5 font-bold">{score.dimensionName}</td>
                      <td className="p-2.5 font-mono font-bold">{score.normalizedScore.toFixed(1)} / 100</td>
                      <td className="p-2.5 text-[11px] text-stone-500">
                        {score.desirableDirection === 'high' ? 'Alta é favorável' : 'Alta indica risco'}
                      </td>
                      <td className="p-2.5 uppercase text-[11px] font-semibold text-emerald-800">Calculado</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-amber-800 italic">Dados suprimidos devido ao tamanho reduzido do grupo (K &lt; 5).</p>
          )}
        </div>

        {/* Section 5: Risk Inventory Summary */}
        <div className="space-y-3 text-xs">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-1">
            5. Inventário dos Riscos Ocupacionais Avaliados
          </h2>

          <div className="border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-2.5">Código</th>
                  <th className="p-2.5">Fator de Risco / Perigo</th>
                  <th className="p-2.5">Setor Afetado</th>
                  <th className="p-2.5">Sev. x Prob.</th>
                  <th className="p-2.5">Nível do Risco</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {risks.map((r) => (
                  <tr key={r.id}>
                    <td className="p-2.5 font-mono font-bold">{r.code}</td>
                    <td className="p-2.5 font-semibold">{r.riskFactor}</td>
                    <td className="p-2.5">{r.departmentName}</td>
                    <td className="p-2.5 font-mono">{r.severity && r.probability ? `S${r.severity} × P${r.probability}` : 'Pendente'}</td>
                    <td className="p-2.5">
                      <StatusBadge type="risk_level" value={r.resultingRiskLevel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 6: Approved Action Plans */}
        <div className="space-y-3 text-xs">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-1">
            6. Plano de Ação de Medidas Preventivas Aprovadas
          </h2>

          <div className="border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-2.5">Código</th>
                  <th className="p-2.5">Medida Preventiva (Organização)</th>
                  <th className="p-2.5">Responsável</th>
                  <th className="p-2.5">Prazo</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {actionPlans
                  .filter((a) => a.status !== 'proposta' && a.status !== 'cancelada')
                  .map((a) => (
                    <tr key={a.id}>
                      <td className="p-2.5 font-mono font-bold">{a.code}</td>
                      <td className="p-2.5 max-w-xs">
                        <p className="font-bold">{a.title}</p>
                        <p className="text-[11px] text-stone-500 line-clamp-1">{a.actionDescription}</p>
                      </td>
                      <td className="p-2.5">{a.responsiblePerson || a.responsibleRole}</td>
                      <td className="p-2.5 font-mono">{a.deadline}</td>
                      <td className="p-2.5">
                        <StatusBadge type="action_status" value={a.status} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 7: Limitations & Signatures */}
        <div className="pt-6 border-t-2 border-stone-900 space-y-6 text-xs text-stone-700 page-break-inside-avoid">
          <div className="p-3 bg-stone-50 rounded border border-stone-200 text-[11px] text-stone-500 space-y-1">
            <p><strong>Aviso legal e limitações:</strong> Este relatório constitui um subsídio técnico para o Gerenciamento de Riscos Ocupacionais. Não substitui a análise presencial Ergonômica do Trabalho quando exigida e não garante imunidade automática a fiscalizações sem o devido cumprimento do Plano de Ação.</p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="border-t border-stone-400 pt-2 text-center">
              <p className="font-bold text-stone-900">{company.responsibleEvaluator}</p>
              <p className="text-stone-500 text-[11px]">{company.responsibleRole}</p>
              <p className="text-stone-400 text-[10px] mt-1">Avaliador Técnico Responsável</p>
            </div>

            <div className="border-t border-stone-400 pt-2 text-center">
              <p className="font-bold text-stone-900">{company.name}</p>
              <p className="text-stone-500 text-[11px]">Direção / Gestão de Pessoas</p>
              <p className="text-stone-400 text-[10px] mt-1">Representante Legal do Estabelecimento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
