import React, { useState } from 'react';
import { storageRepo } from '../repositories/storageRepository';
import { Company, Department, WorkRegime } from '../types/domain';
import { Modal } from '../components/common/Modal';
import { Building2, Plus, Edit2, Trash2, Users, Layers, ShieldCheck, Check } from 'lucide-react';

export const CompanyPage: React.FC = () => {
  const [company, setCompany] = useState<Company>(() => storageRepo.getCompany());
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Department Modal State
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [deptForm, setDeptForm] = useState({
    name: '',
    activitiesDescription: '',
    workerCount: 10,
    regime: 'presencial' as WorkRegime,
    workOrganization: '',
    existingPreventiveMeasures: '',
  });

  const handleCompanySave = (e: React.FormEvent) => {
    e.preventDefault();
    storageRepo.saveCompany(company);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleOpenDeptModal = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setDeptForm({
        name: dept.name,
        activitiesDescription: dept.activitiesDescription,
        workerCount: dept.workerCount,
        regime: dept.regime,
        workOrganization: dept.workOrganization,
        existingPreventiveMeasures: dept.existingPreventiveMeasures,
      });
    } else {
      setEditingDept(null);
      setDeptForm({
        name: '',
        activitiesDescription: '',
        workerCount: 10,
        regime: 'presencial',
        workOrganization: '',
        existingPreventiveMeasures: '',
      });
    }
    setIsDepartmentModalOpen(true);
  };

  const handleDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedDepts = [...company.departments];

    if (editingDept) {
      updatedDepts = updatedDepts.map((d) =>
        d.id === editingDept.id ? { ...editingDept, ...deptForm } : d
      );
    } else {
      const newDept: Department = {
        id: `dep-${Date.now()}`,
        ...deptForm,
      };
      updatedDepts.push(newDept);
    }

    const totalWorkerCount = updatedDepts.reduce((acc, curr) => acc + curr.workerCount, 0);
    const updatedCompany = { ...company, departments: updatedDepts, totalWorkerCount };

    setCompany(updatedCompany);
    storageRepo.saveCompany(updatedCompany);
    setIsDepartmentModalOpen(false);
  };

  const handleDeleteDept = (deptId: string) => {
    if (confirm('Tem certeza que deseja remover este setor?')) {
      const updatedDepts = company.departments.filter((d) => d.id !== deptId);
      const totalWorkerCount = updatedDepts.reduce((acc, curr) => acc + curr.workerCount, 0);
      const updatedCompany = { ...company, departments: updatedDepts, totalWorkerCount };
      setCompany(updatedCompany);
      storageRepo.saveCompany(updatedCompany);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Empresa e Setores</h1>
          <p className="text-xs text-stone-500">
            Cadastro de informações do estabelecimento e setores para caracterização da exposição ocupacional (Sem dados nominais de trabalhadores).
          </p>
        </div>
        {isSavedNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Dados da empresa salvos com sucesso!</span>
          </div>
        )}
      </div>

      {/* Main Company Form */}
      <form onSubmit={handleCompanySave} className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
          <Building2 className="w-5 h-5 text-teal-700" />
          <h2 className="text-sm font-bold text-stone-900">Dados do Estabelecimento e Responsável Técnico</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Razão Social / Nome da Empresa</label>
            <input
              type="text"
              required
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Estabelecimento / Unidade</label>
            <input
              type="text"
              required
              value={company.establishmentName}
              onChange={(e) => setCompany({ ...company, establishmentName: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">CNPJ Fictício / Opcional</label>
            <input
              type="text"
              value={company.cnpj || ''}
              onChange={(e) => setCompany({ ...company, cnpj: e.target.value })}
              placeholder="00.000.000/0001-00"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-stone-700 mb-1">Atividade Econômica Principal (CNAE)</label>
            <input
              type="text"
              required
              value={company.economicActivityCnae}
              onChange={(e) => setCompany({ ...company, economicActivityCnae: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Total de Trabalhadores no Estabelecimento</label>
            <input
              type="number"
              min="1"
              required
              value={company.totalWorkerCount}
              onChange={(e) => setCompany({ ...company, totalWorkerCount: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Avaliador Técnico Responsável</label>
            <input
              type="text"
              required
              value={company.responsibleEvaluator}
              onChange={(e) => setCompany({ ...company, responsibleEvaluator: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-stone-700 mb-1">Função / Habilitação Profissional</label>
            <input
              type="text"
              required
              value={company.responsibleRole}
              onChange={(e) => setCompany({ ...company, responsibleRole: e.target.value })}
              placeholder="Ex: Engenheira de Segurança do Trabalho (CREA-SP XXXXX)"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block font-semibold text-stone-700 mb-1">Descrição dos Processos de Trabalho</label>
            <textarea
              rows={2}
              value={company.processDescription}
              onChange={(e) => setCompany({ ...company, processDescription: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
          >
            Salvar Alterações da Empresa
          </button>
        </div>
      </form>

      {/* Sectors / Departments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Setores / Mapeamento de Atividades</h2>
            <p className="text-xs text-stone-500">Mapeamento dos grupos homogêneos de trabalhadores para avaliação de exposição.</p>
          </div>
          <button
            onClick={() => handleOpenDeptModal()}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Setor</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {company.departments.map((dept) => (
            <div key={dept.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-2">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-stone-900">{dept.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3 text-stone-400" /> {dept.workerCount} trabalhadores</span>
                      <span>·</span>
                      <span className="capitalize font-medium text-teal-800">{dept.regime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenDeptModal(dept)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-100 transition-colors"
                      title="Editar Setor"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDept(dept.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-stone-100 transition-colors"
                      title="Excluir Setor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-stone-600">
                  <div>
                    <strong className="text-stone-800 block">Atividades desenvolvidas:</strong>
                    <p className="line-clamp-2 text-stone-600 text-[11px]">{dept.activitiesDescription}</p>
                  </div>
                  <div>
                    <strong className="text-stone-800 block">Organização do trabalho:</strong>
                    <p className="line-clamp-2 text-stone-600 text-[11px]">{dept.workOrganization}</p>
                  </div>
                  <div>
                    <strong className="text-stone-800 block">Medidas preventivas existentes:</strong>
                    <p className="line-clamp-2 text-stone-600 text-[11px]">{dept.existingPreventiveMeasures}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Department Modal */}
      <Modal
        isOpen={isDepartmentModalOpen}
        onClose={() => setIsDepartmentModalOpen(false)}
        title={editingDept ? 'Editar Setor' : 'Adicionar Novo Setor'}
        maxWidth="lg"
      >
        <form onSubmit={handleDeptSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Nome do Setor / Área</label>
            <input
              type="text"
              required
              value={deptForm.name}
              onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
              placeholder="Ex: Atendimento ao Cliente, Almoxarifado"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Quantidade de Trabalhadores</label>
              <input
                type="number"
                min="1"
                required
                value={deptForm.workerCount}
                onChange={(e) => setDeptForm({ ...deptForm, workerCount: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Regime de Trabalho</label>
              <select
                value={deptForm.regime}
                onChange={(e) => setDeptForm({ ...deptForm, regime: e.target.value as WorkRegime })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 capitalize"
              >
                <option value="presencial">Presencial</option>
                <option value="remoto">Remoto</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Descrição das Atividades do Setor</label>
            <textarea
              rows={2}
              required
              value={deptForm.activitiesDescription}
              onChange={(e) => setDeptForm({ ...deptForm, activitiesDescription: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Organização do Trabalho e Fluxos</label>
            <textarea
              rows={2}
              required
              value={deptForm.workOrganization}
              onChange={(e) => setDeptForm({ ...deptForm, workOrganization: e.target.value })}
              placeholder="Ex: Turnos de 6 horas, metas diárias de sistema, pausa regulada..."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Medidas Preventivas Existentes no Setor</label>
            <textarea
              rows={2}
              value={deptForm.existingPreventiveMeasures}
              onChange={(e) => setDeptForm({ ...deptForm, existingPreventiveMeasures: e.target.value })}
              placeholder="Ex: Pausas da NR-17, ginástica laboral, flexibilidade..."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setIsDepartmentModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
            >
              {editingDept ? 'Salvar Setor' : 'Adicionar Setor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
