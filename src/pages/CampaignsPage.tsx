import React, { useState } from 'react';
import { storageRepo } from '../repositories/storageRepository';
import { Campaign, CampaignStatus } from '../types/domain';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { QRCodeModal } from '../components/common/QRCodeModal';
import {
  Megaphone,
  Plus,
  QrCode,
  Sparkles,
  Lock,
  ExternalLink,
  Users,
  Calendar,
  AlertCircle,
  FileCheck,
  Play,
  CheckCircle,
} from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => storageRepo.getCampaigns());
  const company = storageRepo.getCompany();
  const instruments = storageRepo.getInstruments();
  const responses = storageRepo.getResponses();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // QR Modal State
  const [qrCampaign, setQrCampaign] = useState<Campaign | null>(null);

  // Simulation Feedback State
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    objective: '',
    instrumentId: 'inst-demo-12',
    targetDepartmentIds: [] as string[],
    eligibleWorkerCount: 50,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    responsibleEvaluator: company.responsibleEvaluator,
    participantInstructions: 'Sua participação é totalmente anônima. Responda com base na sua rotina habitual.',
    status: 'rascunho' as CampaignStatus,
  });

  const handleOpenModal = (camp?: Campaign) => {
    if (camp) {
      setEditingCampaign(camp);
      setForm({
        name: camp.name,
        objective: camp.objective,
        instrumentId: camp.instrumentId,
        targetDepartmentIds: camp.targetDepartmentIds,
        eligibleWorkerCount: camp.eligibleWorkerCount,
        startDate: camp.startDate.split('T')[0],
        endDate: camp.endDate.split('T')[0],
        responsibleEvaluator: camp.responsibleEvaluator,
        participantInstructions: camp.participantInstructions,
        status: camp.status,
      });
    } else {
      setEditingCampaign(null);
      setForm({
        name: '',
        objective: '',
        instrumentId: 'inst-demo-12',
        targetDepartmentIds: company.departments.map((d) => d.id),
        eligibleWorkerCount: company.totalWorkerCount,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        responsibleEvaluator: company.responsibleEvaluator,
        participantInstructions: 'Sua participação é totalmente anônima. Não insira dados pessoais.',
        status: 'rascunho',
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedInstrument = instruments.find((i) => i.id === form.instrumentId);

    let frozenAt = editingCampaign?.frozenAt;
    // Freeze rules when moving to Aberta
    if (form.status === 'aberta' && !frozenAt) {
      frozenAt = new Date().toISOString();
    }

    const campaignToSave: Campaign = {
      id: editingCampaign ? editingCampaign.id : `camp-${Date.now()}`,
      name: form.name,
      objective: form.objective,
      instrumentId: form.instrumentId,
      instrumentVersion: selectedInstrument ? `${selectedInstrument.code} (${selectedInstrument.edition})` : 'DEMO_PSICO_12',
      targetDepartmentIds: form.targetDepartmentIds,
      eligibleWorkerCount: form.eligibleWorkerCount,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      responsibleEvaluator: form.responsibleEvaluator,
      participantInstructions: form.participantInstructions,
      status: form.status,
      frozenAt,
      createdAt: editingCampaign ? editingCampaign.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageRepo.saveCampaign(campaignToSave);
    setCampaigns(storageRepo.getCampaigns());
    setIsModalOpen(false);
  };

  const handleStatusChange = (camp: Campaign, newStatus: CampaignStatus) => {
    let frozenAt = camp.frozenAt;
    if (newStatus === 'aberta' && !frozenAt) {
      frozenAt = new Date().toISOString();
    }
    const updated = { ...camp, status: newStatus, frozenAt, updatedAt: new Date().toISOString() };
    storageRepo.saveCampaign(updated);
    setCampaigns(storageRepo.getCampaigns());
  };

  // Batch Response Simulator for testing
  const handleSimulateBatchResponses = (camp: Campaign) => {
    const targetDeptId = camp.targetDepartmentIds[0] || company.departments[0].id;
    const batchSize = 15;
    const simulatedResponses = [];

    for (let i = 1; i <= batchSize; i++) {
      simulatedResponses.push({
        id: `sim-resp-${Date.now()}-${i}`,
        campaignId: camp.id,
        departmentId: targetDeptId,
        submittedAt: new Date().toISOString(),
        answers: {
          Q1: Math.floor(Math.random() * 3) + 3, // 3 to 5
          Q2: Math.floor(Math.random() * 3) + 3,
          Q3: Math.floor(Math.random() * 3) + 1,
          Q4: Math.floor(Math.random() * 3) + 2,
          Q5: Math.floor(Math.random() * 3) + 2,
          Q6: Math.floor(Math.random() * 3) + 2,
          Q7: Math.floor(Math.random() * 3) + 3,
          Q8: Math.floor(Math.random() * 3) + 2,
          Q9: Math.floor(Math.random() * 3) + 1,
          Q10: Math.floor(Math.random() * 3) + 2,
          Q11: Math.floor(Math.random() * 3) + 2,
          Q12: Math.floor(Math.random() * 3) + 2,
        },
      });
    }

    storageRepo.addBatchResponses(simulatedResponses);
    setSimulationNotice(`Simulação concluída! +${batchSize} respostas anônimas geradas para ${camp.name}.`);
    setTimeout(() => setSimulationNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Campanhas de Coleta</h1>
          <p className="text-xs text-stone-500">
            Crie e gerencie pesquisas psicossociais. Ao abrir uma campanha, o instrumento e suas regras de cálculo são congelados.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Campanha</span>
        </button>
      </div>

      {simulationNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{simulationNotice}</span>
        </div>
      )}

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((camp) => {
          const campResponses = responses.filter((r) => r.campaignId === camp.id);
          const isFrozen = !!camp.frozenAt;

          return (
            <div
              key={camp.id}
              className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-stone-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-stone-900">{camp.name}</h2>
                    <StatusBadge type="campaign" value={camp.status} />
                    {isFrozen && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        <Lock className="w-3 h-3 text-stone-400" />
                        <span>Regras congeladas</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600">{camp.objective}</p>
                </div>

                {/* Quick Status Select */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-semibold text-stone-400">Status:</span>
                  <select
                    value={camp.status}
                    onChange={(e) => handleStatusChange(camp, e.target.value as CampaignStatus)}
                    className="px-2.5 py-1 text-xs border border-stone-300 rounded-lg text-stone-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="aberta">Aberta</option>
                    <option value="encerrada">Encerrada</option>
                    <option value="em_analise">Em análise</option>
                    <option value="finalizada">Finalizada</option>
                  </select>
                </div>
              </div>

              {/* Campaign Metadata Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-stone-600 bg-stone-50/70 p-3 rounded-lg border border-stone-200/60">
                <div>
                  <span className="text-stone-400 text-[11px] block">Instrumento:</span>
                  <strong className="text-stone-800 font-medium">{camp.instrumentVersion}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Período:</span>
                  <span className="font-mono text-stone-800">
                    {camp.startDate.split('T')[0]} a {camp.endDate.split('T')[0]}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">População Elegível:</span>
                  <strong className="text-stone-800 font-mono">{camp.eligibleWorkerCount} trabalhadores</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Respostas Coletadas:</span>
                  <strong className="text-teal-800 font-mono font-bold text-sm">
                    {campResponses.length} recebidas
                  </strong>
                </div>
              </div>

              {/* Campaign Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setQrCampaign(camp)}
                    className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 border border-stone-200"
                  >
                    <QrCode className="w-3.5 h-3.5 text-stone-500" />
                    <span>Link & QR Code</span>
                  </button>

                  <a
                    href={`# /responder/${camp.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1.5 border border-teal-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-teal-700" />
                    <span>Abrir Questionário</span>
                  </a>

                  <button
                    onClick={() => handleSimulateBatchResponses(camp)}
                    className="px-3 py-1.5 text-xs font-semibold text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-1.5 border border-purple-200"
                    title="Insere 15 respostas fictícias para simular acúmulo de dados"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Simular +15 Respostas</span>
                  </button>
                </div>

                <button
                  onClick={() => handleOpenModal(camp)}
                  className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Editar Detalhes
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCampaign ? 'Editar Campanha' : 'Nova Campanha de Avaliação'}
        maxWidth="xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Nome da Campanha</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Diagnóstico Psicossocial 2026.1"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Objetivo da Pesquisa</label>
            <textarea
              rows={2}
              required
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
              placeholder="Ex: Mapeamento de fatores psicossociais organizacionais para fundamentação do GRO/PGR."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Instrumento Utilizado</label>
              <select
                value={form.instrumentId}
                onChange={(e) => setForm({ ...form, instrumentId: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                {instruments.map((i) => (
                  <option key={i.id} value={i.id} disabled={!i.isPublishable}>
                    {i.name} {!i.isPublishable ? '(Pendente de Validação)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Status Inicial</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as CampaignStatus })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 capitalize"
              >
                <option value="rascunho">Rascunho</option>
                <option value="aberta">Aberta (Congela instrumento)</option>
                <option value="encerrada">Encerrada</option>
                <option value="em_analise">Em análise</option>
                <option value="finalizada">Finalizada</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Data de Início</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Data de Encerramento</label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Instruções Aos Participantes (Exibidas no Formulário)</label>
            <textarea
              rows={2}
              value={form.participantInstructions}
              onChange={(e) => setForm({ ...form, participantInstructions: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] space-y-1">
            <strong>Aviso metodológico de congelamento:</strong>
            <p>Ao abrir a campanha, o instrumento e as regras de cálculo são congelados. Alterações posteriores no catálogo não modificarão esta campanha.</p>
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
              Salvar Campanha
            </button>
          </div>
        </form>
      </Modal>

      {/* QR Code Modal */}
      {qrCampaign && (
        <QRCodeModal
          isOpen={!!qrCampaign}
          onClose={() => setQrCampaign(null)}
          campaignName={qrCampaign.name}
          campaignId={qrCampaign.id}
        />
      )}
    </div>
  );
};
