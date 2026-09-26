import React, { useState } from 'react';
import { storageRepo } from '../repositories/storageRepository';
import { RiskAssessment, RiskLevel, RiskAssessmentStatus, RiskSeverity, RiskProbability } from '../types/domain';
import { calculateRiskLevel } from '../services/calculationEngine';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { RiskMatrixGrid } from '../components/common/Charts';
import { ShieldAlert, Plus, Edit2, AlertTriangle, FileText, CheckCircle2, User, Sparkles } from 'lucide-react';

interface RiskInventoryPageProps {
  onNavigate: (path: string) => void;
}

export const RiskInventoryPage: React.FC<RiskInventoryPageProps> = ({ onNavigate }) => {
  const [risks, setRisks] = useState<RiskAssessment[]>(() => storageRepo.getRisks());
  const company = storageRepo.getCompany();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<RiskAssessment | null>(null);

  const [form, setForm] = useState({
    code: `R-${(risks.length + 1).toString().padStart(3, '0')}`,
    riskFactor: '',
    workSituation: '',
    departmentId: company.departments[0]?.id || '',
    exposedGroup: '',
    exposedWorkerCount: 10,
    sourcesAndCircumstances: '',
    possibleConsequences: '',
    exposureCharacterization: '',
    existingControlMeasures: '',
    complementaryEvidence: '',
    evaluationCriteriaUsed: 'Matriz de Risco Ocupacional (Critério demonstrativo — Severidade x Probabilidade)',
    severity: undefined as RiskSeverity | undefined,
    severityJustification: '',
    probability: undefined as RiskProbability | undefined,
    probabilityJustification: '',
    evaluatorName: company.responsibleEvaluator,
    status: 'em_analise' as RiskAssessmentStatus,
  });

  const handleOpenModal = (risk?: RiskAssessment) => {
    if (risk) {
      setEditingRisk(risk);
      setForm({
        code: risk.code,
        riskFactor: risk.riskFactor,
        workSituation: risk.workSituation,
        departmentId: risk.departmentId,
        exposedGroup: risk.exposedGroup,
        exposedWorkerCount: risk.exposedWorkerCount,
        sourcesAndCircumstances: risk.sourcesAndCircumstances,
        possibleConsequences: risk.possibleConsequences,
        exposureCharacterization: risk.exposureCharacterization,
        existingControlMeasures: risk.existingControlMeasures,
        complementaryEvidence: risk.complementaryEvidence,
        evaluationCriteriaUsed: risk.evaluationCriteriaUsed,
        severity: risk.severity,
        severityJustification: risk.severityJustification || '',
        probability: risk.probability,
        probabilityJustification: risk.probabilityJustification || '',
        evaluatorName: risk.evaluatorName,
        status: risk.status,
      });
    } else {
      setEditingRisk(null);
      const selectedDept = company.departments[0];
      setForm({
        code: `R-${(risks.length + 1).toString().padStart(3, '0')}`,
        riskFactor: '',
        workSituation: '',
        departmentId: selectedDept?.id || '',
        exposedGroup: '',
        exposedWorkerCount: selectedDept?.workerCount || 10,
        sourcesAndCircumstances: '',
        possibleConsequences: '',
        exposureCharacterization: '',
        existingControlMeasures: selectedDept?.existingPreventiveMeasures || '',
        complementaryEvidence: '',
        evaluationCriteriaUsed: 'Matriz de Risco Ocupacional (Critério demonstrativo — Severidade x Probabilidade)',
        severity: undefined,
        severityJustification: '',
        probability: undefined,
        probabilityJustification: '',
        evaluatorName: company.responsibleEvaluator,
        status: 'em_analise',
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDept = company.departments.find((d) => d.id === form.departmentId);
    const { level } = calculateRiskLevel(form.severity, form.probability);

    const riskToSave: RiskAssessment = {
      id: editingRisk ? editingRisk.id : `risk-${Date.now()}`,
      code: form.code,
      riskFactor: form.riskFactor,
      workSituation: form.workSituation,
      departmentId: form.departmentId,
      departmentName: selectedDept ? selectedDept.name : 'Setor Não Especificado',
      exposedGroup: form.exposedGroup,
      exposedWorkerCount: form.exposedWorkerCount,
      sourcesAndCircumstances: form.sourcesAndCircumstances,
      possibleConsequences: form.possibleConsequences,
      exposureCharacterization: form.exposureCharacterization,
      existingControlMeasures: form.existingControlMeasures,
      linkedFindings: editingRisk ? editingRisk.linkedFindings : [],
      complementaryEvidence: form.complementaryEvidence,
      evaluationCriteriaUsed: form.evaluationCriteriaUsed,
      severity: form.severity,
      severityJustification: form.severityJustification,
      probability: form.probability,
      probabilityJustification: form.probabilityJustification,
      resultingRiskLevel: level as RiskLevel,
      evaluatorName: form.evaluatorName,
      evaluationDate: new Date().toISOString().split('T')[0],
      status: form.severity && form.probability ? 'avaliado' : form.status,
      createdAt: editingRisk ? editingRisk.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageRepo.saveRisk(riskToSave);
    setRisks(storageRepo.getRisks());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Inventário de Riscos Ocupacionais (PGR)</h1>
          <p className="text-xs text-stone-500">
            Caracterização, gradação e registro dos perigos e riscos psicossociais alinhados à NR-1.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Risco</span>
        </button>
      </div>

      {/* Mandatory Matrix Disclaimer Banner */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Matriz demonstrativa:</strong> As pontuações do questionário constituem evidências. A atribuição de Severidade e Probabilidade exige análise e validação técnica do profissional qualificado.
          </span>
        </div>
      </div>

      {/* Risk Inventory Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-stone-200 bg-stone-50/50 flex items-center justify-between">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Registros de Perigos e Riscos Psicossociais
          </h2>
          <span className="text-[11px] text-stone-500 font-mono">Total: {risks.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                <th className="p-3">Código</th>
                <th className="p-3">Fator de Risco / Perigo</th>
                <th className="p-3">Setor & Grupo Exposto</th>
                <th className="p-3">Sev. x Prob.</th>
                <th className="p-3">Classificação Resultante</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-stone-800">
              {risks.map((risk) => (
                <tr key={risk.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-stone-900">{risk.code}</td>
                  <td className="p-3 max-w-xs">
                    <p className="font-semibold text-stone-900">{risk.riskFactor}</p>
                    <p className="text-[11px] text-stone-500 line-clamp-1">{risk.workSituation}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-stone-900">{risk.departmentName}</p>
                    <p className="text-[11px] text-stone-500">{risk.exposedGroup} ({risk.exposedWorkerCount} hab.)</p>
                  </td>
                  <td className="p-3 font-mono tabular-nums">
                    {risk.severity && risk.probability ? (
                      <span className="font-semibold text-stone-800">
                        S{risk.severity} × P{risk.probability} = {risk.severity * risk.probability}
                      </span>
                    ) : (
                      <span className="text-stone-400 italic">Pendente</span>
                    )}
                  </td>
                  <td className="p-3">
                    <StatusBadge type="risk_level" value={risk.resultingRiskLevel} />
                  </td>
                  <td className="p-3">
                    <StatusBadge type="risk_status" value={risk.status} />
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleOpenModal(risk)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded transition-colors"
                    >
                      Editar / Avaliar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Edit / Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRisk ? `Editar Registro ${editingRisk.code}` : 'Cadastrar Novo Registro de Risco'}
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Código do Risco</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Setor Afetado</label>
              <select
                value={form.departmentId}
                onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                {company.departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.workerCount} trabalhadores)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Fator de Risco / Perigo Psicossocial</label>
            <input
              type="text"
              required
              value={form.riskFactor}
              onChange={(e) => setForm({ ...form, riskFactor: e.target.value })}
              placeholder="Ex: Sobrecarga quantitativa de trabalho e pressão temporal"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Situação de Trabalho / Atividade</label>
            <textarea
              rows={2}
              required
              value={form.workSituation}
              onChange={(e) => setForm({ ...form, workSituation: e.target.value })}
              placeholder="Ex: Operação de atendimento telefônico receptivo com metas de TMA..."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Grupo Exposto</label>
              <input
                type="text"
                required
                value={form.exposedGroup}
                onChange={(e) => setForm({ ...form, exposedGroup: e.target.value })}
                placeholder="Ex: Operadores de Teleatendimento"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Nº Trabalhadores Expostos</label>
              <input
                type="number"
                min="1"
                required
                value={form.exposedWorkerCount}
                onChange={(e) => setForm({ ...form, exposedWorkerCount: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          {/* Severity x Probability Matrix Grid Picker */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <h3 className="font-bold text-stone-900">Gradação do Risco Ocupacional (Critério Técnico)</h3>
            <RiskMatrixGrid
              selectedSeverity={form.severity}
              selectedProbability={form.probability}
              onSelectCell={(sev, prob) => {
                setForm({ ...form, severity: sev as RiskSeverity, probability: prob as RiskProbability });
              }}
            />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Justificativa da Severidade</label>
                <textarea
                  rows={2}
                  value={form.severityJustification}
                  onChange={(e) => setForm({ ...form, severityJustification: e.target.value })}
                  placeholder="Fundamentação técnica do potencial de agravo à saúde..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Justificativa da Probabilidade</label>
                <textarea
                  rows={2}
                  value={form.probabilityJustification}
                  onChange={(e) => setForm({ ...form, probabilityJustification: e.target.value })}
                  placeholder="Fundamentação do perfil de exposição, frequência e controles atuais..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Evidências Complementares (Observações, Entrevistas Coletivas)</label>
            <textarea
              rows={2}
              value={form.complementaryEvidence}
              onChange={(e) => setForm({ ...form, complementaryEvidence: e.target.value })}
              placeholder="Registros adicionais sem dados pessoais nominais..."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
            >
              Salvar Registro de Risco
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
