import React from 'react';
import { storageRepo } from '../repositories/storageRepository';
import { BookOpen, ExternalLink, ShieldAlert, FileCheck, Info, CheckCircle2 } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const sources = storageRepo.getMethodologySources();
  const instruments = storageRepo.getInstruments();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl font-bold text-stone-900 tracking-tight">Metodologia, Fontes e Fundamentação Técnica</h1>
        <p className="text-xs text-stone-500">
          Registro de referências regulatórias, científicas e limitações metodológicas dos instrumentos cadastrados.
        </p>
      </div>

      {/* Distinction Banner */}
      <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-teal-900">
          <Info className="w-4 h-4 text-teal-700 shrink-0" />
          <span>Distinção Metodológica Fundamental (NR-1)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-stone-700 text-[11px] pt-1">
          <div className="p-2.5 bg-white rounded-lg border border-teal-200">
            <strong className="text-teal-900 block font-semibold">1. Correção do Instrumento Psicossocial:</strong>
            <span>Processo estatístico de apuração de médias e escores normalizados (0-100) por dimensão, fundamentado nos manuais da ferramenta.</span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-teal-200">
            <strong className="text-teal-900 block font-semibold">2. Avaliação Ocupacional do Risco (PGR):</strong>
            <span>Julgamento técnico do profissional qualificado que pondera severidade e probabilidade da exposição para tomada de decisão no GRO.</span>
          </div>
        </div>
      </div>

      {/* Primary Regulatory & Reference Links */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-stone-900 border-b border-stone-200 pb-2">
          Referências Documentais Regulatórias e Internacionais
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-stone-900 font-bold">MTE / NR-1 — Norma Regulamentadora nº 1</strong>
              <a
                href="https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:text-teal-900 flex items-center gap-1 font-medium text-[11px]"
              >
                <span>Acessar NR-1 Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-stone-600 text-[11px]">
              Estabelece as diretrizes gerais para o Gerenciamento de Riscos Ocupacionais (GRO) e a elaboração do Programa de Gerenciamento de Riscos (PGR).
            </p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-stone-900 font-bold">COPSOQ International Network</strong>
              <a
                href="https://www.copsoq-network.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:text-teal-900 flex items-center gap-1 font-medium text-[11px]"
              >
                <span>Acessar COPSOQ Network</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-stone-600 text-[11px]">
              Rede internacional de pesquisa responsável pelas diretrizes, licenças e validação psicométrica do Copenhagen Psychosocial Questionnaire.
            </p>
            <div className="flex gap-3 text-[11px] text-teal-800 pt-1">
              <a href="https://www.copsoq-network.org/licence-guidelines-and-questionnaire" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Diretrizes de Licença
              </a>
              <span>·</span>
              <a href="https://www.copsoq-network.org/validation-studies" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Estudos de Validação
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog of Methodology Sources */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-stone-900">Catálogo de Fontes e Situação de Validação dos Instrumentos</h2>

        <div className="space-y-4">
          {sources.map((src) => (
            <div key={src.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{src.name}</h3>
                  <p className="text-[11px] text-stone-500">{src.instrumentEdition} — {src.countryLanguage}</p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    src.verificationStatus === 'Verificado documentalmente'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : src.verificationStatus === 'Instrumento demonstrativo'
                      ? 'bg-purple-50 text-purple-800 border border-purple-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {src.verificationStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-stone-700">
                <div>
                  <strong className="text-stone-900 block">Documento de Origem:</strong>
                  <p className="text-[11px] text-stone-600">{src.documentSource} ({src.sectionPage})</p>
                </div>
                <div>
                  <strong className="text-stone-900 block">Regras de Cálculo Sumarizadas:</strong>
                  <p className="text-[11px] text-stone-600">{src.calculationRulesSummary}</p>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg text-[11px] text-stone-600 space-y-1">
                <strong className="text-stone-800 block">Limitações e Restrições Declaradas:</strong>
                <p>{src.limitations}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
