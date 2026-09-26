import React, { useState } from 'react';
import { storageRepo } from '../repositories/storageRepository';
import { ActionPlanItem, ActionStatus } from '../types/domain';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { AiSuggestionWizardModal } from './AiSuggestionWizardModal';
import {
  ClipboardList,
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Edit2,
  Calendar,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';

export const ActionPlansPage: React.FC = () => {
  const [actions, setActions] = useState<ActionPlanItem[]>(() => storageRepo.getActions());
  const risks = storageRepo.getRisks();
  const company = storageRepo.getCompany();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Wizard Modal State
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Edit / Efficacy Verification Modal State
  const [editingAction, setEditingAction] = useState<ActionPlanItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleOpenEdit = (action: ActionPlanItem) => {
    setEditingAction({ ...action });
    setIsEditModalOpen(true);
  };

  const handleActionSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAction) return;

    // Rule: Cannot move to 'concluida' without efficacy verification notes
    if (editingAction.status === 'concluida' && !editingAction.efficacyVerificationNotes) {
      alert('Atenção (NR-1): É obrigatório registrar a verificação de eficácia da medida antes de concluir o plano de ação.');
      return;
    }

    storageRepo.saveAction(editingAction);
    setActions(storageRepo.getActions());
    setIsEditModalOpen(false);
  };

  const refreshData = () => {
    setActions(storageRepo.getActions());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Planos de Ação Preventivos (PGR)</h1>
          <p className="text-xs text-stone-500">
            Medidas de controle organizacionais aprovadas, acompanhamento de prazos e verificação de eficácia conforme NR-1.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span>Sugerir Medidas com IA</span>
          </button>
        </div>
      </div>

      {/* Operational Alerts Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {actions.some((a) => a.status === 'em_andamento' && a.deadline && a.deadline < todayStr) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900 flex items-start gap-2">
            <Clock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong>Alertas de Prazos Vencidos:</strong>
              <p className="text-[11px] text-red-800">
                Ações em andamento com prazo de execução expirado. Requerem atualização do responsável técnico.
              </p>
            </div>
          </div>
        )}

        {actions.some((a) => a.status === 'proposta') && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong>Sugestões Aguardando Revisão:</strong>
              <p className="text-[11px] text-purple-800">
                Propostas da IA aguardando análise e aprovação pelo profissional responsável.
              </p>
            </div>
          </div>
        )}

        {actions.some((a) => a.status === 'em_verificacao_eficacia') && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong>Verificação de Eficácia Requerida:</strong>
              <p className="text-[11px] text-indigo-800">
                Medidas implementadas aguardando validação de redução real dos riscos.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* View Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-lg text-xs font-medium">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'table' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Visão em Tabela
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'kanban' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Visão por Status (Quadro)
          </button>
        </div>

        <span className="text-xs text-stone-500 font-mono">Total de ações: {actions.length}</span>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                  <th className="p-3">Código & Origem</th>
                  <th className="p-3">Ação Preventiva</th>
                  <th className="p-3">Riscos Vinculados</th>
                  <th className="p-3">Responsável</th>
                  <th className="p-3">Prazo</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {actions.map((act) => {
                  const isOverdue = act.status === 'em_andamento' && act.deadline && act.deadline < todayStr;

                  return (
                    <tr key={act.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-stone-900">
                        <div>{act.code}</div>
                        <span className="text-[10px] text-stone-400 block font-sans">
                          {act.origin === 'ia_sugerida' ? '⚡ Sugerida por IA' : '👤 Manual'}
                        </span>
                      </td>

                      <td className="p-3 max-w-sm">
                        <p className="font-bold text-stone-900 line-clamp-1">{act.title}</p>
                        <p className="text-[11px] text-stone-500 line-clamp-2">{act.actionDescription}</p>
                      </td>

                      <td className="p-3 font-mono text-[11px]">
                        {act.linkedRiskCodes.join(', ')}
                      </td>

                      <td className="p-3">
                        <p className="font-medium text-stone-900">{act.responsiblePerson || 'Não atribuído'}</p>
                        <p className="text-[11px] text-stone-500">{act.responsibleRole}</p>
                      </td>

                      <td className="p-3 font-mono text-xs">
                        <span className={isOverdue ? 'text-red-700 font-bold' : 'text-stone-800'}>
                          {act.deadline}
                        </span>
                        {isOverdue && <span className="block text-[10px] text-red-600 font-sans font-bold">VENCIDO</span>}
                      </td>

                      <td className="p-3">
                        <StatusBadge type="action_status" value={act.status} />
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenEdit(act)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded transition-colors"
                        >
                          Detalhes / Atualizar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
          {(
            [
              { status: 'proposta', title: 'Proposta / IA' },
              { status: 'aprovada', title: 'Aprovada' },
              { status: 'em_andamento', title: 'Em Andamento' },
              { status: 'em_verificacao_eficacia', title: 'Verificação Eficácia' },
              { status: 'concluida', title: 'Concluída' },
            ] as const
          ).map((col) => {
            const colActions = actions.filter((a) => a.status === col.status);

            return (
              <div key={col.status} className="bg-stone-100/70 border border-stone-200 rounded-xl p-3 space-y-3 min-w-[220px]">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs font-bold text-stone-800">{col.title}</span>
                  <span className="text-[11px] font-mono font-bold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                    {colActions.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {colActions.map((act) => (
                    <div
                      key={act.id}
                      onClick={() => handleOpenEdit(act)}
                      className="p-3 bg-white border border-stone-200 rounded-lg shadow-2xs hover:border-teal-500 transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-stone-700">{act.code}</span>
                        <span className="text-stone-400">{act.deadline}</span>
                      </div>
                      <p className="font-bold text-stone-900 text-xs line-clamp-2">{act.title}</p>
                      <p className="text-[11px] text-stone-500 line-clamp-2">{act.actionDescription}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Wizard Modal */}
      <AiSuggestionWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={refreshData}
      />

      {/* Edit / Detail / Efficacy Verification Modal */}
      {editingAction && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Ação ${editingAction.code} — Gerenciamento e Verificação de Eficácia`}
          maxWidth="2xl"
        >
          <form onSubmit={handleActionSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Status do Plano de Ação</label>
                <select
                  value={editingAction.status}
                  onChange={(e) =>
                    setEditingAction({ ...editingAction, status: e.target.value as ActionStatus })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                >
                  <option value="proposta">Proposta (Aguardando Aprovação)</option>
                  <option value="aprovada">Aprovada</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="implementada">Implementada</option>
                  <option value="em_verificacao_eficacia">Em Verificação de Eficácia</option>
                  <option value="concluida">Concluída (Requer Eficácia Comprovada)</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Prazo de Conclusão</label>
                <input
                  type="date"
                  value={editingAction.deadline}
                  onChange={(e) => setEditingAction({ ...editingAction, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Título da Medida Preventiva</label>
              <input
                type="text"
                required
                value={editingAction.title}
                onChange={(e) => setEditingAction({ ...editingAction, title: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Descrição Concreta (Organização do Trabalho)</label>
              <textarea
                rows={2}
                required
                value={editingAction.actionDescription}
                onChange={(e) => setEditingAction({ ...editingAction, actionDescription: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Responsável Direto (Nome / Função)</label>
                <input
                  type="text"
                  value={editingAction.responsiblePerson || ''}
                  onChange={(e) => setEditingAction({ ...editingAction, responsiblePerson: e.target.value })}
                  placeholder="Ex: Carlos Mendes (Gerente Operacional)"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Área / Função Responsável</label>
                <input
                  type="text"
                  value={editingAction.responsibleRole}
                  onChange={(e) => setEditingAction({ ...editingAction, responsibleRole: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Mandatory NR-1 Efficacy Verification Section */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold border-b border-stone-200 pb-2">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Registro de Verificação de Eficácia (Obrigatório para NR-1)</span>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Evidências de Execução Ocupacional</label>
                <textarea
                  rows={2}
                  value={editingAction.executionEvidenceNotes || ''}
                  onChange={(e) =>
                    setEditingAction({ ...editingAction, executionEvidenceNotes: e.target.value })
                  }
                  placeholder="Descreva fotos, atas de reunião, alterações no PABX ou documentos de implementação..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Resultado da Verificação de Eficácia</label>
                <textarea
                  rows={2}
                  value={editingAction.efficacyVerificationNotes || ''}
                  onChange={(e) =>
                    setEditingAction({ ...editingAction, efficacyVerificationNotes: e.target.value })
                  }
                  placeholder="Relato técnico demonstrando que a medida reduziu a percepção de estresse ou sobrecarga..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
              >
                Salvar Atualizações do Plano
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
