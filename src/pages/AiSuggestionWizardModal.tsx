import React, { useState } from 'react';
import { Modal } from '../components/common/Modal';
import { ActionPlanItem, ActionSuggestion, RiskAssessment } from '../types/domain';
import { MockAiActionPlanProvider } from '../services/aiActionPlanService';
import { storageRepo } from '../repositories/storageRepository';
import { Sparkles, Check, X, Edit3, ArrowRight, ArrowLeft, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

interface AiSuggestionWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const AiSuggestionWizardModal: React.FC<AiSuggestionWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const risks = storageRepo.getRisks();
  const company = storageRepo.getCompany();

  // Wizard Step: 1 = Select Risks, 2 = Review Context, 3 = Loading/Generated, 4 = Review/Approve
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRiskIds, setSelectedRiskIds] = useState<string[]>(
    risks.filter((r) => r.resultingRiskLevel !== 'pendente_avaliacao').map((r) => r.id)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [generatedSuggestions, setGeneratedSuggestions] = useState<ActionSuggestion[]>([]);
  const [editableSuggestions, setEditableSuggestions] = useState<ActionSuggestion[]>([]);
  const [approvedStatus, setApprovedStatus] = useState<Record<string, boolean>>({});

  const provider = new MockAiActionPlanProvider();

  const handleToggleRisk = (riskId: string) => {
    setSelectedRiskIds((prev) =>
      prev.includes(riskId) ? prev.filter((id) => id !== riskId) : [...prev, riskId]
    );
  };

  const handleGenerate = async () => {
    setStep(3);
    setIsLoading(true);

    const selectedRisks = risks.filter((r) => selectedRiskIds.includes(r.id));
    const firstRisk = selectedRisks[0];
    const dept = company.departments.find((d) => d.id === firstRisk?.departmentId);

    try {
      const response = await provider.generateActionSuggestions({
        selectedRisks,
        companyName: company.name,
        departmentName: dept?.name || 'Setor Operacional',
        workActivities: dept?.activitiesDescription || '',
        existingControlMeasures: dept?.existingPreventiveMeasures || '',
      });

      setGeneratedSuggestions(response.suggestions);
      setEditableSuggestions(JSON.parse(JSON.stringify(response.suggestions)));

      // Default all to approved initially for review
      const initialApproved: Record<string, boolean> = {};
      response.suggestions.forEach((s) => {
        initialApproved[s.tempId] = true;
      });
      setApprovedStatus(initialApproved);

      setIsLoading(false);
      setStep(4);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleFieldChange = (tempId: string, field: keyof ActionSuggestion, value: any) => {
    setEditableSuggestions((prev) =>
      prev.map((item) => (item.tempId === tempId ? { ...item, [field]: value } : item))
    );
  };

  const handleToggleApprove = (tempId: string) => {
    setApprovedStatus((prev) => ({ ...prev, [tempId]: !prev[tempId] }));
  };

  const handleSaveApprovedActions = () => {
    const actionsToSave: ActionPlanItem[] = editableSuggestions
      .filter((s) => approvedStatus[s.tempId])
      .map((s, idx) => {
        const linkedRisk = risks.find((r) => r.id === s.linkedRiskId);
        return {
          id: `act-${Date.now()}-${idx}`,
          code: `ACT-${(storageRepo.getActions().length + idx + 1).toString().padStart(3, '0')}`,
          linkedRiskIds: [s.linkedRiskId],
          linkedRiskCodes: linkedRisk ? [linkedRisk.code] : ['R-001'],
          title: s.title,
          actionDescription: s.actionDescription,
          justification: s.justification,
          implementationSteps: s.implementationSteps,
          responsibleRole: s.suggestedResponsibleRole,
          deadline: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
          requiredResources: s.requiredResources,
          executionIndicator: s.executionIndicator,
          efficacyIndicator: s.efficacyIndicator,
          verificationMethod: s.verificationMethod,
          status: 'proposta' as const, // Salva como proposta aguardando aprovação técnica final
          origin: 'ia_sugerida' as const,
          aiAssumptions: s.assumptions,
          aiMissingInfo: s.missingInformation,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

    if (actionsToSave.length > 0) {
      storageRepo.saveBatchActions(actionsToSave);
    }

    onComplete();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assistente de Sugestões de Ação com IA (Gemini)" maxWidth="4xl">
      <div className="space-y-5 text-xs">
        {/* Banner Indicator */}
        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-900 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-purple-700 shrink-0" />
            <span>Sugestões simuladas — Gemini ainda não conectado (Operação local sem chaves)</span>
          </div>
          <span className="text-[11px] text-purple-800 font-semibold">Etapa {step} de 4</span>
        </div>

        {/* STEP 1: Select Risks */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Passo 1: Selecione os Riscos Ocupacionais para Análise</h3>
              <p className="text-stone-500">
                Selecione os riscos já avaliados no inventário para os quais a IA deve propor medidas de controle organizacionais.
              </p>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {risks.map((risk) => {
                const isSelected = selectedRiskIds.includes(risk.id);
                const isPending = risk.resultingRiskLevel === 'pendente_avaliacao';

                return (
                  <div
                    key={risk.id}
                    onClick={() => !isPending && handleToggleRisk(risk.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                      isPending
                        ? 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'bg-purple-50/60 border-purple-300 ring-1 ring-purple-400'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={isPending}
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-1 rounded text-purple-700 focus:ring-purple-600"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-stone-900">{risk.code} — {risk.riskFactor}</span>
                        <span className="text-[11px] text-stone-500">{risk.departmentName}</span>
                      </div>
                      <p className="text-[11px] text-stone-600">{risk.workSituation}</p>
                      {isPending && (
                        <span className="text-[11px] text-amber-700 font-medium">
                          ⚠️ Risco pendente de avaliação técnica. Não elegível para ações definitivas.
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={selectedRiskIds.length === 0}
                onClick={() => setStep(2)}
                className="px-4 py-2 font-semibold text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-50 rounded-lg flex items-center gap-1.5"
              >
                <span>Avançar para Revisão do Contexto</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Review Context */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Passo 2: Revisar Contexto Enviado ao Modelo</h3>
              <p className="text-stone-500">
                A IA receberá apenas dados agregados e desidentificados, respeitando rigorosamente o sigilo do grupo.
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between text-stone-700 border-b border-stone-200 pb-2">
                <span className="font-bold">PAYLOAD SANITIZADO (SEM DADOS IDENTIFICÁVEIS)</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>

              <p><strong>Empresa:</strong> {company.name}</p>
              <p><strong>Riscos Selecionados:</strong> {selectedRiskIds.length} item(ns)</p>
              <p><strong>Foco Mandatório:</strong> Condições e Organização do Trabalho (Distribuição de carga, metas, autonomia, papéis).</p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                className="px-4 py-2 font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Gerar Sugestões Contextualizadas</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Loading State */}
        {step === 3 && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-purple-700 animate-spin mx-auto" />
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Processando sugestões preventivas com IA...</h3>
              <p className="text-stone-500 text-xs mt-1">
                Analisando evidências agregadas e elaborando medidas focadas na organização do trabalho.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: Review, Edit & Approve */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Passo 4: Analise, Edite e Aprove as Medidas Sugeridas</h3>
              <p className="text-stone-500">
                A IA é uma ferramenta auxiliar. Edite qualquer campo para adequar à realidade do setor antes de salvar.
              </p>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {editableSuggestions.map((sug) => {
                const isApproved = approvedStatus[sug.tempId];

                return (
                  <div
                    key={sug.tempId}
                    className={`p-4 rounded-xl border transition-all space-y-3 ${
                      isApproved ? 'bg-white border-purple-300 shadow-xs' : 'bg-stone-50 border-stone-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-2">
                      <div className="space-y-0.5 flex-1">
                        <span className="text-[11px] font-mono font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          Vinculado ao Risco {sug.linkedRiskCode}
                        </span>
                        <input
                          type="text"
                          value={sug.title}
                          onChange={(e) => handleFieldChange(sug.tempId, 'title', e.target.value)}
                          className="w-full font-bold text-stone-900 text-xs border-b border-transparent hover:border-stone-300 focus:border-purple-600 focus:outline-none bg-transparent pt-1"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleApprove(sug.tempId)}
                        className={`px-3 py-1.5 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0 ${
                          isApproved
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        {isApproved ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        <span>{isApproved ? 'Aprovada para Salvar' : 'Rejeitada'}</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Medida Concreta (Organização / Condições):</label>
                        <textarea
                          rows={2}
                          value={sug.actionDescription}
                          onChange={(e) => handleFieldChange(sug.tempId, 'actionDescription', e.target.value)}
                          className="w-full p-2 border border-stone-300 rounded text-stone-800 focus:ring-1 focus:ring-purple-600 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Área / Função Responsável:</label>
                          <input
                            type="text"
                            value={sug.suggestedResponsibleRole}
                            onChange={(e) => handleFieldChange(sug.tempId, 'suggestedResponsibleRole', e.target.value)}
                            className="w-full p-1.5 border border-stone-300 rounded text-stone-800 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Prazo Estimado:</label>
                          <input
                            type="text"
                            value={sug.estimatedTimeframe}
                            onChange={(e) => handleFieldChange(sug.tempId, 'estimatedTimeframe', e.target.value)}
                            className="w-full p-1.5 border border-stone-300 rounded text-stone-800 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={handleSaveApprovedActions}
                className="px-5 py-2 font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs"
              >
                Salvar Ações Aprovadas nos Planos de Ação
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
