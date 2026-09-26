import React, { useState } from 'react';
import { storageRepo } from '../repositories/storageRepository';
import { calculateCampaignResults } from '../services/calculationEngine';
import { DimensionBarChart, QuestionDistributionBar } from '../components/common/Charts';
import { Filter, ShieldCheck, AlertTriangle, Info, HelpCircle } from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const campaigns = storageRepo.getCampaigns();
  const company = storageRepo.getCompany();
  const instruments = storageRepo.getInstruments();
  const responses = storageRepo.getResponses();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id || ''
  );
  const [selectedDeptId, setSelectedDeptId] = useState<string>('ALL');

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);
  const demoInstrument = instruments.find((i) => i.code === 'DEMO_PSICO_12') || instruments[0];

  const campaignResponses = responses.filter((r) => r.campaignId === selectedCampaignId);

  // Calculation Engine call
  const deptFilter = selectedDeptId === 'ALL' ? undefined : selectedDeptId;
  const calculationResult = demoInstrument
    ? calculateCampaignResults(demoInstrument, campaignResponses, deptFilter, 5)
    : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Resultados da Avaliação</h1>
          <p className="text-xs text-stone-500">
            Estatísticas descritivas agregadas por dimensão psicossocial. Aplicação rigorosa da regra de privacidade (K ≥ 5).
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-700" />
            <span className="font-semibold text-stone-700">Campanha:</span>
            <select
              value={selectedCampaignId}
              onChange={(e) => {
                setSelectedCampaignId(e.target.value);
                setSelectedDeptId('ALL');
              }}
              className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.status})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">Setor / Recorte:</span>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="ALL">Todos os Setores (Consolidado)</option>
              {company.departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.workerCount} trab.)
                </option>
              ))}
            </select>
          </div>
        </div>

        {calculationResult && (
          <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono">
            <span>
              Respostas: <strong className="text-stone-900">{calculationResult.totalResponsesReceived}</strong>
            </span>
            <span>·</span>
            <span>
              Limite K: <strong className="text-stone-900">{calculationResult.minimumThresholdK}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Privacy Notice Banner if Suppressed */}
      {calculationResult?.isPrivacySuppressed && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Resultados Suprimidos por Política de Privacidade e Sigilo do Grupo (K &lt; 5)</span>
          </div>
          <p className="text-amber-800 leading-relaxed">
            Para garantir o sigilo absoluto dos participantes, os resultados estatísticos de grupos com menos de{' '}
            <strong>5 respostas válidas</strong> são automaticamente suprimidos na visualização, gráficos e exportações.
            Recebidas neste recorte: <strong>{calculationResult.totalResponsesReceived} respostas</strong>.
          </p>
        </div>
      )}

      {/* Results Main Section */}
      {calculationResult && !calculationResult.isPrivacySuppressed && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Dimension Bar Chart & Directions */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-stone-900">Escores por Dimensão Psicossocial</h2>
                  <p className="text-xs text-stone-500">Escala padronizada de 0 a 100 pontos.</p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>K ≥ 5 verificado</span>
                </div>
              </div>

              <DimensionBarChart scores={calculationResult.dimensionScores} />
            </div>

            {/* Questions Distribution Detail */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <h2 className="text-base font-bold text-stone-900">Distribuição Detalhada de Respostas por Pergunta</h2>
                <p className="text-xs text-stone-500">Frequência absoluta e percentual das alternativas escolhidas.</p>
              </div>

              <div className="space-y-3">
                {demoInstrument.dimensions.map((dim) => (
                  <div key={dim.id} className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-50/70 p-2 rounded border border-teal-100">
                      {dim.name}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {dim.questions.map((q) => (
                        <QuestionDistributionBar
                          key={q.id}
                          questionText={`${q.id}. ${q.text}`}
                          distribution={calculationResult.questionDistribution[q.id] || {}}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Methodological Notice & Guidance */}
          <div className="space-y-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-stone-900 font-bold">
                <Info className="w-4 h-4 text-teal-700" />
                <span>Orientação de Interpretação</span>
              </div>

              <div className="space-y-2 text-stone-600">
                <p>
                  <strong>Direção das Escalas:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-600">
                  <li>
                    <span className="font-semibold text-stone-800">Exigências / Sobrecarga:</span> Notas mais altas indicam maior exigência percebida (risco maior).
                  </li>
                  <li>
                    <span className="font-semibold text-stone-800">Autonomia, Apoio e Clareza:</span> Notas mais altas indicam condições mais favoráveis (fator de proteção).
                  </li>
                </ul>
                <p className="text-[11px] text-stone-500 pt-1">
                  Não converter pontuações estatísticas em diagnósticos individuais ou automáticos de risco ocupacional.
                </p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-stone-900 font-bold">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Fonte Metodológica e Limitações</span>
              </div>

              <div className="space-y-2 text-stone-600 text-[11px] leading-relaxed">
                <p>
                  <strong>Instrumento:</strong> {demoInstrument.name}
                </p>
                <p>
                  <strong>Status:</strong> {demoInstrument.limitationsNotice}
                </p>
                <p className="text-stone-500 pt-1">
                  Os dados estatísticos apresentados nesta tela servem como <em>evidências iniciais</em> para o profissional qualificado realizar a caracterização e gradação dos riscos no Inventário de Riscos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
