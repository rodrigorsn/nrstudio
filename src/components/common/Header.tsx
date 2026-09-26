import React, { useState } from 'react';
import { RefreshCw, Building2, ExternalLink } from 'lucide-react';
import { storageRepo } from '../../repositories/storageRepository';
import { ConfirmModal } from './ConfirmModal';

interface HeaderProps {
  onDataReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onDataReset }) => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const company = storageRepo.getCompany();

  const handleResetConfirm = () => {
    storageRepo.restoreDemoData();
    if (onDataReset) onDataReset();
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between no-print">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a href="#/" className="text-lg font-bold tracking-tight text-stone-900 hover:text-teal-700 transition-colors">
            PsicoGestão <span className="text-teal-700 font-semibold">NR-1</span>
          </a>
          <span className="hidden sm:inline-block text-stone-300">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 truncate max-w-xs">
            <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate font-medium text-stone-700">{company.name}</span>
          </div>
        </div>

        {/* Zone 2: Quick context / navigation indicator */}
        <div className="hidden md:flex items-center gap-4 text-xs text-stone-500">
          <span>Avaliador: <strong className="text-stone-700 font-medium">{company.responsibleEvaluator}</strong></span>
        </div>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          <a
            href="#/responder/camp-2026-01"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200"
          >
            <span>Ver Questionário (Mobile)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200"
            title="Restaura os dados fictícios originais"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Restaurar dados demonstrativos</span>
            <span className="sm:hidden">Restaurar</span>
          </button>
        </div>
      </header>

      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfirm}
        title="Restaurar dados demonstrativos?"
        message="Esta ação irá substituir todas as alterações atuais e recarregar os dados fictícios originais de empresas, setores, campanhas, respostas e planos de ação. Deseja continuar?"
        confirmLabel="Sim, restaurar dados"
        cancelLabel="Cancelar"
        isDanger={true}
      />
    </>
  );
};
