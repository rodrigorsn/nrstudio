import React, { useState } from 'react';
import { Modal } from './Modal';
import { Copy, Check, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignName: string;
  campaignId: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  campaignName,
  campaignId,
}) => {
  const [copied, setCopied] = useState(false);
  const demoUrl = `${window.location.origin}/#/responder/${campaignId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(demoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Link & QR Code Demonstrativo" maxWidth="md">
      <div className="space-y-5 text-center">
        <div className="p-3 bg-stone-50 rounded-lg text-left text-xs border border-stone-200">
          <p className="font-semibold text-stone-900">{campaignName}</p>
          <p className="text-stone-500 mt-0.5">
            Utilize este link para simular a resposta ao questionário em nova aba ou dispositivo móvel.
          </p>
        </div>

        {/* Vector SVG QR Code Representation */}
        <div className="flex flex-col items-center justify-center p-6 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="p-3 bg-white border border-stone-300 rounded-lg shadow-inner">
            <svg
              className="w-48 h-48 text-stone-900"
              viewBox="0 0 100 100"
              fill="currentColor"
              aria-label="QR Code Demonstrativo"
            >
              {/* Outer border & finder patterns */}
              <rect x="5" y="5" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="11" y="11" width="16" height="16" fill="currentColor" />

              <rect x="67" y="5" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="73" y="11" width="16" height="16" fill="currentColor" />

              <rect x="5" y="67" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="11" y="73" width="16" height="16" fill="currentColor" />

              {/* Data Modules */}
              <rect x="40" y="8" width="6" height="6" />
              <rect x="52" y="8" width="6" height="6" />
              <rect x="40" y="20" width="18" height="6" />
              <rect x="40" y="32" width="6" height="6" />
              <rect x="52" y="32" width="6" height="6" />

              <rect x="8" y="40" width="6" height="18" />
              <rect x="20" y="40" width="6" height="6" />
              <rect x="20" y="52" width="12" height="6" />

              <rect x="68" y="40" width="6" height="12" />
              <rect x="80" y="40" width="12" height="6" />
              <rect x="80" y="52" width="6" height="18" />
              <rect x="68" y="68" width="6" height="6" />
              <rect x="80" y="76" width="12" height="6" />
              <rect x="68" y="88" width="18" height="6" />

              <rect x="40" y="44" width="18" height="18" fill="currentColor" opacity="0.85" />
              <rect x="44" y="68" width="12" height="12" />
              <rect x="40" y="88" width="18" height="6" />
            </svg>
          </div>
          <p className="text-[11px] text-stone-400 mt-3 flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5" />
            <span>Escaneie para abrir o questionário demonstrativo</span>
          </p>
        </div>

        {/* Copyable Link Box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={demoUrl}
            className="flex-1 px-3 py-2 text-xs font-mono text-stone-700 bg-stone-100 border border-stone-300 rounded-lg select-all"
          />
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
          </button>
        </div>

        <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded border border-amber-200/80 text-left">
          <strong>Aviso de limitação:</strong> Em ambiente sem backend, as respostas enviadas em outros navegadores ou dispositivos não serão centralizadas no seu browser local.
        </p>
      </div>
    </Modal>
  );
};
