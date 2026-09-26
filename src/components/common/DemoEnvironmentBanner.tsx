import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const DemoEnvironmentBanner: React.FC = () => {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-900 flex items-center justify-between no-print">
      <div className="flex items-center gap-2 font-medium">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Ambiente demonstrativo</strong> — utilize somente dados fictícios. Nenhuma informação real de trabalhadores deve ser inserida neste protótipo.
        </span>
      </div>
      <div className="hidden md:flex items-center gap-2 text-amber-800 text-[11px]">
        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
        <span>Persistência local isolada (localStorage)</span>
      </div>
    </div>
  );
};
