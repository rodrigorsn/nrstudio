import React, { useState, useEffect } from 'react';
import { storageRepo } from '../repositories/storageRepository';
import { AnonymousResponse, Campaign, InstrumentVersion, QuestionDefinition } from '../types/domain';
import { ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, Building2, Lock } from 'lucide-react';

interface ParticipantQuestionnairePageProps {
  campaignId: string;
}

export const ParticipantQuestionnairePage: React.FC<ParticipantQuestionnairePageProps> = ({
  campaignId,
}) => {
  const campaigns = storageRepo.getCampaigns();
  const campaign = campaigns.find((c) => c.id === campaignId) || campaigns[0];
  const company = storageRepo.getCompany();
  const instruments = storageRepo.getInstruments();
  const demoInstrument = instruments.find((i) => i.code === 'DEMO_PSICO_12') || instruments[0];

  // Flow State: 0 = Presentation/Consent, 1 = Questionnaire Questions, 2 = Review, 3 = Submitted Confirmation
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    campaign?.targetDepartmentIds[0] || company.departments[0]?.id || ''
  );

  // Response answers state: questionId -> value (1-5)
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(false);

  // Check double submission token in local storage for this campaign
  useEffect(() => {
    if (campaign) {
      const tokenKey = `psicogestao_submitted_${campaign.id}`;
      if (localStorage.getItem(tokenKey)) {
        setHasAlreadySubmitted(true);
      }
    }
  }, [campaign]);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl border border-stone-200 text-center max-w-md">
          <p className="text-sm font-bold text-stone-900">Campanha não encontrada.</p>
          <p className="text-xs text-stone-500 mt-1">Verifique o link de acesso ou contate o responsável técnico.</p>
        </div>
      </div>
    );
  }

  // All 12 questions from demo instrument
  const allQuestions: QuestionDefinition[] = demoInstrument.dimensions.flatMap((d) => d.questions);

  const handleOptionSelect = (qId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const isAllAnswered = allQuestions.every((q) => answers[q.id] !== undefined && answers[q.id] !== null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newResponse: AnonymousResponse = {
      id: `resp-user-${Date.now()}`,
      campaignId: campaign.id,
      departmentId: selectedDeptId,
      submittedAt: new Date().toISOString(),
      answers,
    };

    storageRepo.addResponse(newResponse);

    // Save token to prevent simple double submission on same device
    localStorage.setItem(`psicogestao_submitted_${campaign.id}`, 'true');
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center p-3 sm:p-6 font-sans antialiased text-stone-900">
      {/* Mobile-oriented Container Shell */}
      <div className="w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-md overflow-hidden flex flex-col my-auto">
        {/* Top Header */}
        <div className="bg-teal-800 text-white p-4 space-y-1 text-center border-b border-teal-900">
          <div className="flex items-center justify-center gap-1.5 text-xs text-teal-200 font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>{company.name}</span>
          </div>
          <h1 className="text-base font-bold leading-tight">{campaign.name}</h1>
          <p className="text-[11px] text-teal-100/80">
            Pesquisa de Fatores Psicossociais Ocupacionais (NR-1)
          </p>
        </div>

        {/* Demo Warning Banner */}
        <div className="bg-amber-50 border-b border-amber-200 p-2.5 text-center text-[11px] text-amber-900 font-medium">
          ⚠️ Instrumento demonstrativo — não é uma versão validada do COPSOQ.
        </div>

        {/* STEP 0: Presentation & Privacy Notice */}
        {step === 0 && (
          <div className="p-6 space-y-5 text-xs">
            {hasAlreadySubmitted ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-2 text-center">
                <Lock className="w-6 h-6 text-amber-600 mx-auto" />
                <strong className="block font-bold">Você já enviou sua resposta para esta pesquisa!</strong>
                <p className="text-stone-600 text-[11px]">
                  Para garantir a idoneidade das estatísticas, cada dispositivo pode registrar apenas uma submissão por campanha.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
                    <div className="flex items-center gap-2 font-bold">
                      <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                      <span>Garantia de Anonymato e Sigilo Absoluto</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-emerald-800">
                      <li>Não solicitamos seu Nome, CPF, Matrícula ou E-mail.</li>
                      <li>Nenhum dado pessoal é registrado ou armazenado.</li>
                      <li>Os resultados são apresentados aos gestores exclusivamente em grupos agregados (mínimo K ≥ 5).</li>
                    </ul>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Selecione o seu Setor de Trabalho:</label>
                    <select
                      value={selectedDeptId}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-xl text-stone-900 font-medium text-xs bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    >
                      {company.departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-600 space-y-1">
                    <strong className="text-stone-800 block">Instruções aos Participantes:</strong>
                    <p className="text-[11px] leading-relaxed">{campaign.participantInstructions}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-3 font-bold text-xs text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Iniciar Questionário Anônimo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}

        {/* STEP 1: Questionnaire Form */}
        {step === 1 && (
          <div className="p-5 space-y-5 text-xs">
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-stone-500 font-medium">
                <span>Progresso</span>
                <span className="font-mono">{Object.keys(answers).length} / {allQuestions.length} respondidas</span>
              </div>
              <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 transition-all duration-300"
                  style={{ width: `${(Object.keys(answers).length / allQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
              {allQuestions.map((q, idx) => (
                <div key={q.id} className="space-y-2 p-3 bg-stone-50/80 border border-stone-200 rounded-xl">
                  <p className="font-bold text-stone-900 leading-snug">
                    <span className="text-teal-800 font-mono font-bold mr-1">{idx + 1}.</span>
                    {q.text}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt) => {
                      const isSelected = answers[q.id] === opt.value;
                      return (
                        <label
                          key={opt.value}
                          onClick={() => handleOptionSelect(q.id, opt.value)}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold ring-1 ring-teal-600'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            checked={isSelected}
                            onChange={() => {}}
                            className="text-teal-700 focus:ring-teal-600 shrink-0"
                          />
                          <span className="text-xs">{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="px-4 py-2 font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                disabled={!isAllAnswered}
                onClick={() => setStep(2)}
                className="px-5 py-2 font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <span>Revisar Respostas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Review Before Submit */}
        {step === 2 && (
          <div className="p-5 space-y-4 text-xs">
            <div className="border-b border-stone-200 pb-2">
              <h2 className="font-bold text-stone-900 text-sm">Revisão Final do Envio</h2>
              <p className="text-stone-500">Confira suas respostas. Nenhuma informação pessoal será gravada.</p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 font-mono text-[11px]">
              {allQuestions.map((q, idx) => {
                const val = answers[q.id];
                const opt = q.options.find((o) => o.value === val);
                return (
                  <div key={q.id} className="p-2 bg-stone-50 border border-stone-200 rounded flex justify-between items-center">
                    <span className="truncate pr-2">{idx + 1}. {q.text}</span>
                    <strong className="text-teal-800 shrink-0">{opt?.label || 'Não respondida'}</strong>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
              >
                Corrigir Respostas
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2.5 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Enviar Resposta Anônima</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Submitted Confirmation */}
        {step === 3 && (
          <div className="p-8 text-center space-y-4">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-stone-900">Resposta Registrada com Sucesso!</h2>
              <p className="text-xs text-stone-600">
                Agradecemos sua valiosa contribuição. Suas respostas foram salvas de forma anônima e comporão os relatórios agregados do seu setor.
              </p>
            </div>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-500">
              Você já pode fechar esta aba com segurança.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
