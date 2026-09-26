/**
 * Seed Data for PsicoGestão NR-1
 * Fictional demonstration dataset fulfilling all scenario requirements.
 */

import {
  AnonymousResponse,
  ActionPlanItem,
  Campaign,
  Company,
  InstrumentVersion,
  MethodologySource,
  RiskAssessment,
} from '../types/domain';

export const DEMO_COMPANY: Company = {
  id: 'comp-001',
  name: 'Empresa Demonstrativa TecnoLogística S.A.',
  establishmentName: 'Matriz São Paulo — Unidade Operacional Central',
  cnpj: '00.123.456/0001-89',
  economicActivityCnae: '6201-5/01 — Desenvolvimento de programas de computador customizáveis',
  processDescription: 'Operações de atendimento a clientes, desenvolvimento contínuo de sistemas corporativos, movimentação e armazenagem de cargas operacionais e gestão administrativa.',
  totalWorkerCount: 142,
  responsibleEvaluator: 'Dra. Patricia Lima Fernandes',
  responsibleRole: 'Engenheira de Segurança do Trabalho e Ergonomista (CREA-SP 506987/D)',
  departments: [
    {
      id: 'dep-001',
      name: 'Atendimento e Suporte (Teleatendimento)',
      activitiesDescription: 'Atendimento receptivo e ativo de suporte a clientes com chamados críticos, metas diárias de tempo médio de atendimento (TMA) e sistema telefônico automatizado.',
      workerCount: 45,
      regime: 'presencial',
      workOrganization: 'Turnos fixos de 6h com pausas de NR-17. Sistema de fila de chamados automatizada sem controle manual de fluxo pelos operadores.',
      existingPreventiveMeasures: 'Pausas reguladas de 10 e 20 minutos conforme NR-17. Fones de ouvido biauriculares com controle de volume individual.',
    },
    {
      id: 'dep-002',
      name: 'Tecnologia e Engenharia de Software',
      activitiesDescription: 'Desenvolvimento e manutenção de plataformas de software, entregas em sprints quinzenais e suporte a incidentes em regime de sobreaviso.',
      workerCount: 38,
      regime: 'hibrido',
      workOrganization: 'Metodologia ágil com sprints de 2 semanas. Múltiplas lideranças diretas (Product Owner, Scrum Master e Gerente Técnico) gerando demandas simultâneas.',
      existingPreventiveMeasures: 'Horário flexível de entrada e saída. Dia sem reuniões às quartas-feiras.',
    },
    {
      id: 'dep-003',
      name: 'Operações Logísticas e Manutenção',
      activitiesDescription: 'Separação, conferência, movimentação física de mercadorias e manutenção preventiva de equipamentos.',
      workerCount: 52,
      regime: 'presencial',
      workOrganization: 'Trabalho em equipes fixas por setor do galpão. Rotinas padronizadas com margem razoável de autonomia na sequência de tarefas diárias.',
      existingPreventiveMeasures: 'Ginástica laboral diária de 15 minutos. Treinamento semestral de movimentação segura de cargas.',
    },
    {
      id: 'dep-004',
      name: 'Recursos Humanos e Estratégia',
      activitiesDescription: 'Gestão de pessoas, folha de pagamento, recrutamento e treinamento interno.',
      workerCount: 4, // GRUPO PEQUENO (< 5 RESPOSTAS PARA TESTAR SUPRESSÃO DE PRIVACIDADE)
      regime: 'hibrido',
      workOrganization: 'Atividades administrativas de planejamento e atendimento interno.',
      existingPreventiveMeasures: 'Feedback trimestral e acompanhamento individualizado.',
    },
  ],
};

// Catalogo de Instrumentos (COPSOQ I, II, III curtos/médios/longos como PENDENTES + DEMO_PSICO_12 como DEMONSTRATIVO)
export const DEMO_INSTRUMENTS: InstrumentVersion[] = [
  {
    id: 'inst-copsoq-3-curto',
    code: 'COPSOQ_III_CURTO',
    name: 'COPSOQ III — Versão Curta (Internacional)',
    description: 'Questionário de Fatores Psicossociais de Copenhagen — Edição III (Versão Curta).',
    edition: 'COPSOQ III (2019)',
    adaptationLanguage: 'Português (Brasil) — Pendente de confirmação do manual oficial',
    validationStatus: 'pendente_validacao_documental',
    isPublishable: false,
    dimensions: [],
    limitationsNotice: 'Pendente de validação documental. Este instrumento não pode ser publicado ou utilizado para coleta até que a tradução e os manuais oficiais da rede COPSOQ sejam validados.',
    sourceReference: 'COPSOQ International Network — https://www.copsoq-network.org/',
  },
  {
    id: 'inst-copsoq-3-medio',
    code: 'COPSOQ_III_MEDIO',
    name: 'COPSOQ III — Versão Média',
    description: 'Questionário de Fatores Psicossociais de Copenhagen — Edição III (Versão Média para Gestão de Riscos).',
    edition: 'COPSOQ III (2019)',
    adaptationLanguage: 'Português (Brasil)',
    validationStatus: 'pendente_validacao_documental',
    isPublishable: false,
    dimensions: [],
    limitationsNotice: 'Pendente de validação documental e verificação das propriedades psicométricas para a versão média no Brasil.',
    sourceReference: 'COPSOQ International Network — https://www.copsoq-network.org/',
  },
  {
    id: 'inst-demo-12',
    code: 'DEMO_PSICO_12',
    name: 'Questionário Demonstrativo de Fatores Psicossociais (12 Itens)',
    description: 'Instrumento demonstrativo simplificado desenvolvido exclusivamente para simulação de fluxo no protótipo PsicoGestão NR-1.',
    edition: 'Edição Demonstrativa 2026',
    adaptationLanguage: 'Português (Brasil)',
    validationStatus: 'demonstrativo',
    isPublishable: true,
    limitationsNotice: 'Instrumento demonstrativo — NÃO é uma versão validada do COPSOQ. Os resultados são meramente ilustrativos para verificação do protótipo.',
    sourceReference: 'Módulo de Demonstração Interna PsicoGestão NR-1 (Não validado cientificamente).',
    dimensions: [
      {
        id: 'DEMANDAS',
        name: 'Exigências e Carga de Trabalho',
        description: 'Avalia a percepção sobre ritmo acelerado, pressão por prazos e volume excessivo de tarefas.',
        desirableDirection: 'low', // Nota alta indica MAIOR exigência / risco
        interpretationNote: 'Pontuações elevadas indicam ritmo de trabalho acelerado ou sobrecarga percebida. Requer avaliação do dimensionamento e fluxo.',
        questions: [
          {
            id: 'Q1',
            dimensionId: 'DEMANDAS',
            text: 'Com que frequência você precisa trabalhar em um ritmo muito acelerado para cumprir suas tarefas?',
            options: [
              { label: 'Nunca ou quase nunca', value: 1 },
              { label: 'Raramente', value: 2 },
              { label: 'Às vezes', value: 3 },
              { label: 'Frequentemente', value: 4 },
              { label: 'Sempre ou quase sempre', value: 5 },
            ],
            isReversed: false,
          },
          {
            id: 'Q2',
            dimensionId: 'DEMANDAS',
            text: 'O seu trabalho exige que você fique sob pressão constante de prazos ou metas?',
            options: [
              { label: 'Nunca ou quase nunca', value: 1 },
              { label: 'Raramente', value: 2 },
              { label: 'Às vezes', value: 3 },
              { label: 'Frequentemente', value: 4 },
              { label: 'Sempre ou quase sempre', value: 5 },
            ],
            isReversed: false,
          },
          {
            id: 'Q3',
            dimensionId: 'DEMANDAS',
            text: 'A quantidade de tarefas atribuídas a você é compatível com a sua jornada normal de trabalho?',
            options: [
              { label: 'Nunca ou quase nunca', value: 1 },
              { label: 'Raramente', value: 2 },
              { label: 'Às vezes', value: 3 },
              { label: 'Frequentemente', value: 4 },
              { label: 'Sempre ou quase sempre', value: 5 },
            ],
            isReversed: true, // Inverso: responder "Sempre" (5) significa BAIXA exigência/risco -> invertido fica 1
          },
        ],
      },
      {
        id: 'AUTONOMIA',
        name: 'Autonomia e Controle sobre o Trabalho',
        description: 'Avalia a margem de manobra para tomar decisões e influenciar o ritmo e os métodos de trabalho.',
        desirableDirection: 'high', // Nota alta é FAVORÁVEL
        interpretationNote: 'Pontuações elevadas indicam boa autonomia e controle. Pontuações baixas sugerem trabalho rígido ou excessivamente prescrito.',
        questions: [
          {
            id: 'Q4',
            dimensionId: 'AUTONOMIA',
            text: 'Você tem influência sobre a forma como realiza suas tarefas diárias?',
            options: [
              { label: 'Nenhuma influência', value: 1 },
              { label: 'Pouca influência', value: 2 },
              { label: 'Alguma influência', value: 3 },
              { label: 'Muita influência', value: 4 },
              { label: 'Total influência', value: 5 },
            ],
            isReversed: false,
          },
          {
            id: 'Q5',
            dimensionId: 'AUTONOMIA',
            text: 'Você pode decidir quando fazer pausas curtas durante o seu turno de trabalho?',
            options: [
              { label: 'Nunca', value: 1 },
              { label: 'Raramente', value: 2 },
              { label: 'Às vezes', value: 3 },
              { label: 'Frequentemente', value: 4 },
              { label: 'Sempre', value: 5 },
            ],
            isReversed: false,
          },
          {
            id: 'Q6',
            dimensionId: 'AUTONOMIA',
            text: 'As decisões sobre a ordem de execução do seu trabalho dependem inteiramente de ordens externas?',
            options: [
              { label: 'Nunca', value: 1 },
              { label: 'Raramente', value: 2 },
              { label: 'Às vezes', value: 3 },
              { label: 'Frequentemente', value: 4 },
              { label: 'Sempre', value: 5 },
            ],
            isReversed: true, // Inverso
          },
        ],
      },
      {
        id: 'APOIO_SOCIAL',
        name: 'Apoio Social e Liderança',
        description: 'Avalia a disponibilidade de ajuda técnica e relacional da chefia imediata e dos colegas de trabalho.',
        desirableDirection: 'high', // Nota alta é FAVORÁVEL
        interpretationNote: 'Pontuações elevadas indicam ambiente colaborativo. Pontuações baixas apontam isolamento ou lacuna no suporte da gestão.',
        questions: [
          {
            id: 'Q7',
            dimensionId: 'APOIO_SOCIAL',
            text: 'Quando surgem imprevistos no trabalho, você pode contar com o auxílio de seus colegas?',
            options: [
              { label: 'Nunca', value: 1 },
              { label: 'Raramente', value: 2 },
              { label: 'Às vezes', value: 3 },
              { label: 'Frequentemente', value: 4 },
              { label: 'Sempre', value: 5 },
            ],
            isReversed: false,
          },
          {
            id: 'Q8',
            dimensionId: 'APOIO_SOCIAL',
            text: 'Sua liderança direta está disponível para ouvir suas dificuldades e ajudar a resolver problemas do dia a dia?',
            options: [
              { label: 'Nunca', value: 1 },
              { label: 'Raramente', value: 2 },
              { label: 'Às vezes', value: 3 },
              { label: 'Frequentemente', value: 4 },
              { label: 'Sempre', value: 5 },
            ],
            isReversed: false,
          },
          {
            id: 'Q9',
            dimensionId: 'APOIO_SOCIAL',
            text: 'Você se sente isolado(a) ou sem suporte para realizar suas tarefas operacionais?',
            options: [
              { label: 'Nunca', value: 1 },
              { label: 'Raramente', value: 2 },
              { label: 'Às vezes', value: 3 },
              { label: 'Frequentemente', value: 4 },
              { label: 'Sempre', value: 5 },
            ],
            isReversed: true, // Inverso
          },
        ],
      },
      {
        id: 'CLAREZA_RECONHECIMENTO',
        name: 'Clareza de Papel e Reconhecimento',
        description: 'Avalia se o trabalhador sabe exatamente o que é esperado do seu papel e se recebe feedback adequado.',
        desirableDirection: 'high', // Nota alta é FAVORÁVEL
        interpretationNote: 'Pontuações altas indicam objetivos claros e valorização percebida. Pontuações baixas indicam conflito de atribuições ou ambiguidade.',
        questions: [
          {
            id: 'Q10',
            dimensionId: 'CLAREZA_RECONHECIMENTO',
            text: 'Você sabe com clareza quais são as suas responsabilidades e os limites do seu papel?',
            options: [
              { label: 'Nunca', value: 1 },
              { label: 'Raramente', value: 2 },
              { label: 'Às vezes', value: 3 },
              { label: 'Frequentemente', value: 4 },
              { label: 'Sempre', value: 5 },
            ],
            isReversed: false,
          },
          {
            id: 'Q11',
            dimensionId: 'CLAREZA_RECONHECIMENTO',
            text: 'Você recebe instruções contraditórias de pessoas diferentes dentro da empresa?',
            options: [
              { label: 'Nunca', value: 1 },
              { label: 'Raramente', value: 2 },
              { label: 'Às vezes', value: 3 },
              { label: 'Frequentemente', value: 4 },
              { label: 'Sempre', value: 5 },
            ],
            isReversed: true, // Inverso
          },
          {
            id: 'Q12',
            dimensionId: 'CLAREZA_RECONHECIMENTO',
            text: 'O seu trabalho é devidamente reconhecido e valorizado pela sua chefia imediata?',
            options: [
              { label: 'Nunca', value: 1 },
              { label: 'Raramente', value: 2 },
              { label: 'Às vezes', value: 3 },
              { label: 'Frequentemente', value: 4 },
              { label: 'Sempre', value: 5 },
            ],
            isReversed: false,
          },
        ],
      },
    ],
  },
];

export const DEMO_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-2026-01',
    name: 'Campanha de Diagnóstico Psicossocial 2026.1',
    objective: 'Mapeamento de fatores psicossociais organizacionais para fundamentação do Inventário de Riscos do GRO/PGR.',
    instrumentId: 'inst-demo-12',
    instrumentVersion: 'DEMO_PSICO_12 (Edição 2026)',
    targetDepartmentIds: ['dep-001', 'dep-002', 'dep-003', 'dep-004'],
    eligibleWorkerCount: 139,
    startDate: '2026-08-01T08:00:00.000Z',
    endDate: '2026-09-15T18:00:00.000Z',
    responsibleEvaluator: 'Dra. Patricia Lima Fernandes',
    participantInstructions: 'Sua participação é totalmente anônima. Não responda com dados pessoais. Os resultados serão apresentados exclusivamente de forma agregada por setor.',
    status: 'em_analise',
    frozenAt: '2026-08-01T08:00:00.000Z',
    createdAt: '2026-07-15T10:00:00.000Z',
    updatedAt: '2026-09-16T09:00:00.000Z',
  },
  {
    id: 'camp-2026-02',
    name: 'Avaliação Piloto — Novo Fluxo Operacional',
    objective: 'Acompanhar percepção da equipe do Teleatendimento após alteração do sistema de chamados.',
    instrumentId: 'inst-demo-12',
    instrumentVersion: 'DEMO_PSICO_12 (Edição 2026)',
    targetDepartmentIds: ['dep-001'],
    eligibleWorkerCount: 45,
    startDate: '2026-09-20T08:00:00.000Z',
    endDate: '2026-10-20T18:00:00.000Z',
    responsibleEvaluator: 'Dra. Patricia Lima Fernandes',
    participantInstructions: 'Pesquisa pulse de acompanhamento do setor de Atendimento. Respostas anônimas.',
    status: 'aberta',
    frozenAt: '2026-09-20T08:00:00.000Z',
    createdAt: '2026-09-18T14:00:00.000Z',
    updatedAt: '2026-09-20T08:00:00.000Z',
  },
];

// Fictional anonymous responses for Campaign camp-2026-01
export function generateSeedResponses(): AnonymousResponse[] {
  const responses: AnonymousResponse[] = [];

  // 1. Setor Teleatendimento (dep-001): 32 respostas -> Alta Carga/Sobrecarga (Q1=4, Q2=5, Q3=1)
  for (let i = 1; i <= 32; i++) {
    responses.push({
      id: `resp-dep1-${i}`,
      campaignId: 'camp-2026-01',
      departmentId: 'dep-001',
      submittedAt: `2026-08-10T10:${(i % 50).toString().padStart(2, '0')}:00.000Z`,
      answers: {
        Q1: 4 + (i % 2 === 0 ? 1 : 0), // 4 ou 5 (Muita sobrecarga)
        Q2: 5,
        Q3: 1, // "Nunca" compatível com jornada -> Inverso vira 5 (Risco alto)
        Q4: 2, // Pouca autonomia
        Q5: 1, // Pouca pausa
        Q6: 4, // Ordens externas
        Q7: 4, // Bom apoio colegas
        Q8: 3, // Apoio médio chefia
        Q9: 2,
        Q10: 4,
        Q11: 3,
        Q12: 2,
      },
    });
  }

  // 2. Setor TI/Dev (dep-002): 25 respostas -> Dificuldades de Comunicação/Clareza (Q11=4, Q12=2, Q10=2)
  for (let i = 1; i <= 25; i++) {
    responses.push({
      id: `resp-dep2-${i}`,
      campaignId: 'camp-2026-01',
      departmentId: 'dep-002',
      submittedAt: `2026-08-12T14:${(i % 50).toString().padStart(2, '0')}:00.000Z`,
      answers: {
        Q1: 3,
        Q2: 4,
        Q3: 2,
        Q4: 4, // Boa autonomia
        Q5: 4,
        Q6: 2,
        Q7: 4,
        Q8: 2, // Apoio chefia baixo
        Q9: 3,
        Q10: 2, // Clareza baixa
        Q11: 4 + (i % 2 === 0 ? 1 : 0), // Instruções contraditórias altas (4 ou 5)
        Q12: 2, // Baixo reconhecimento
      },
    });
  }

  // 3. Setor Logística (dep-003): 38 respostas -> Indicadores mais favoráveis
  for (let i = 1; i <= 38; i++) {
    responses.push({
      id: `resp-dep3-${i}`,
      campaignId: 'camp-2026-01',
      departmentId: 'dep-003',
      submittedAt: `2026-08-15T09:${(i % 50).toString().padStart(2, '0')}:00.000Z`,
      answers: {
        Q1: 2,
        Q2: 2,
        Q3: 4,
        Q4: 3,
        Q5: 3,
        Q6: 2,
        Q7: 5, // Excelente apoio entre colegas
        Q8: 4,
        Q9: 1,
        Q10: 4,
        Q11: 1,
        Q12: 4,
      },
    });
  }

  // 4. Setor RH (dep-004): Apenas 3 respostas -> GRUPO SUPRIMIDO POR PRIVACIDADE (< 5 respostas)
  for (let i = 1; i <= 3; i++) {
    responses.push({
      id: `resp-dep4-${i}`,
      campaignId: 'camp-2026-01',
      departmentId: 'dep-004',
      submittedAt: `2026-08-20T11:00:00.000Z`,
      answers: {
        Q1: 3, Q2: 3, Q3: 3, Q4: 3, Q5: 3, Q6: 3,
        Q7: 3, Q8: 3, Q9: 3, Q10: 3, Q11: 3, Q12: 3,
      },
    });
  }

  return responses;
}

// Exemplos Fictícios de Inventário de Riscos Ocupacionais
export const DEMO_RISK_ASSESSMENTS: RiskAssessment[] = [
  {
    id: 'risk-001',
    code: 'R-001',
    riskFactor: 'Sobrecarga quantitativa de trabalho e pressão temporal excessiva',
    workSituation: 'Operação de atendimento telefônico receptivo de suporte técnico aos clientes com monitoramento contínuo de tempo médio de atendimento (TMA).',
    departmentId: 'dep-001',
    departmentName: 'Atendimento e Suporte (Teleatendimento)',
    exposedGroup: 'Operadores de Teleatendimento Receptivo',
    exposedWorkerCount: 45,
    sourcesAndCircumstances: 'Fila automatizada de chamados sem intervalo regulável pelo operador entre atendimentos; acúmulo de chamados no período da tarde.',
    possibleConsequences: 'Fadiga mental intensa, queixas estressoras repetitivas, queda da atenção e sintomas psicossomáticos.',
    exposureCharacterization: 'Exposição diária e contínua durante o turno de 6 horas.',
    existingControlMeasures: 'Pausas regulamentadas pela NR-17 anexos II.',
    linkedFindings: [
      {
        campaignId: 'camp-2026-01',
        dimensionId: 'DEMANDAS',
        normalizedScore: 87.5,
        observation: 'Escore elevado na dimensão de Exigências (87,5/100), com 92% dos participantes relatando ritmo muito acelerado.',
      },
    ],
    complementaryEvidence: 'Observação direta da rotina em 12/08/2026 demonstrou ausência de tempo de pausa pré-atendimento para registro pós-chamada.',
    evaluationCriteriaUsed: 'Matriz de Risco Ocupacional da Empresa (Critério demonstrativo — Severidade x Probabilidade).',
    severity: 4,
    severityJustification: 'Potencial de gerar agravos à saúde mental e aumento nas taxas de absenteísmo no setor.',
    probability: 4,
    probabilityJustification: 'Exposição diária de 100% da equipe do setor a ambiente de fila de chamados ininterrupta.',
    resultingRiskLevel: 'critico',
    evaluatorName: 'Dra. Patricia Lima Fernandes',
    evaluationDate: '2026-09-16',
    status: 'avaliado',
    createdAt: '2026-09-16T10:00:00.000Z',
    updatedAt: '2026-09-16T10:00:00.000Z',
  },
  {
    id: 'risk-002',
    code: 'R-002',
    riskFactor: 'Conflito de comandos e ambiguidade nas atribuições de papel',
    workSituation: 'Desenvolvimento de software corporativo sob metodologias ágeis com dupla liderança (Product Owner e Gerente Técnico).',
    departmentId: 'dep-002',
    departmentName: 'Tecnologia e Engenharia de Software',
    exposedGroup: 'Desenvolvedores e Analistas de Sistemas',
    exposedWorkerCount: 38,
    sourcesAndCircumstances: 'Instruções divergentes quanto a priorizar velocidade de entrega de novas funcionalidades vs resolução de débitos técnicos.',
    possibleConsequences: 'Desmotivação, retrabalho constante, tensão interpessoal e desgaste do clima organizacional.',
    exposureCharacterization: 'Exposição frequente durante o planejamento de sprints quinzenais.',
    existingControlMeasures: 'Reuniões de alinhamento quinzenais.',
    linkedFindings: [
      {
        campaignId: 'camp-2026-01',
        dimensionId: 'CLAREZA_RECONHECIMENTO',
        normalizedScore: 32.0,
        observation: 'Escore desfavorável na dimensão Clareza/Reconhecimento (32,0/100, onde maior é melhor).',
      },
    ],
    complementaryEvidence: 'Entrevistas coletivas estruturadas confirmaram que 70% dos desenvolvedores relatam receber ordens contraditórias na mesma semana.',
    evaluationCriteriaUsed: 'Matriz de Risco Ocupacional da Empresa (Critério demonstrativo).',
    severity: 3,
    severityJustification: 'Pode resultar em estresse crônico e rotatividade voluntária de talentos (turnover).',
    probability: 4,
    probabilityJustification: 'Ocorrência sistêmica observada em múltiplas equipes de desenvolvimento.',
    resultingRiskLevel: 'alto',
    evaluatorName: 'Dra. Patricia Lima Fernandes',
    evaluationDate: '2026-09-17',
    status: 'avaliado',
    createdAt: '2026-09-17T11:00:00.000Z',
    updatedAt: '2026-09-17T11:00:00.000Z',
  },
  {
    id: 'risk-003',
    code: 'R-003',
    riskFactor: 'Baixa margem de autonomia no controle do ritmo de trabalho',
    workSituation: 'Atendimento de suporte com rigidez nos tempos de pausa e rotinas.',
    departmentId: 'dep-001',
    departmentName: 'Atendimento e Suporte (Teleatendimento)',
    exposedGroup: 'Operadores de Teleatendimento Receptivo',
    exposedWorkerCount: 45,
    sourcesAndCircumstances: 'Impossibilidade de flexibilizar a sequência de tratativas das demandas recebidas.',
    possibleConsequences: 'Sensação de desamparo aprendido e esgotamento profissional.',
    exposureCharacterization: 'Diária durante todo o expediente.',
    existingControlMeasures: 'Pausas reguladas pela NR-17.',
    linkedFindings: [
      {
        campaignId: 'camp-2026-01',
        dimensionId: 'AUTONOMIA',
        normalizedScore: 28.5,
        observation: 'Escore baixo na dimensão Autonomia (28,5/100).',
      },
    ],
    complementaryEvidence: 'Análise ergonômica do trabalho realizada em julho de 2026.',
    evaluationCriteriaUsed: 'Matriz de Risco Ocupacional da Empresa.',
    severity: 3,
    severityJustification: 'Impacto moderado na saúde psicofisiológica.',
    probability: 3,
    probabilityJustification: 'Fator estrutural do modelo de atendimento.',
    resultingRiskLevel: 'medio',
    evaluatorName: 'Dra. Patricia Lima Fernandes',
    evaluationDate: '2026-09-18',
    status: 'avaliado',
    createdAt: '2026-09-18T14:00:00.000Z',
    updatedAt: '2026-09-18T14:00:00.000Z',
  },
  {
    id: 'risk-004',
    code: 'R-004',
    riskFactor: 'Relatos esporádicos de dificuldades de comunicação no setor logístico',
    workSituation: 'Movimentação e triagem de mercadorias no galpão.',
    departmentId: 'dep-003',
    departmentName: 'Operações Logísticas e Manutenção',
    exposedGroup: 'Operadores de Logística',
    exposedWorkerCount: 52,
    sourcesAndCircumstances: 'Ruído elevado durante horários de pico de expedição dificultando a comunicação falada.',
    possibleConsequences: 'Falhas de comunicação operacional.',
    exposureCharacterization: 'Intermitente.',
    existingControlMeasures: 'Uso de protetores auditivos e sinalização visual.',
    linkedFindings: [],
    complementaryEvidence: 'Aguardando complemento da inspeção técnica ergonômica.',
    evaluationCriteriaUsed: 'Pendente de consolidação dos dados complementares.',
    resultingRiskLevel: 'pendente_avaliacao', // RISCO PENDENTE DE AVALIAÇÃO
    evaluatorName: 'Dra. Patricia Lima Fernandes',
    evaluationDate: '2026-09-20',
    status: 'em_analise',
    createdAt: '2026-09-20T09:00:00.000Z',
    updatedAt: '2026-09-20T09:00:00.000Z',
  },
];

// Fictional Action Plans in various required status states
export const DEMO_ACTION_PLANS: ActionPlanItem[] = [
  {
    id: 'act-001',
    code: 'ACT-001',
    linkedRiskIds: ['risk-001'],
    linkedRiskCodes: ['R-001'],
    title: 'Ajuste no algoritmo de fila de chamados e implementação de buffer de 3 minutos pós-atendimento',
    actionDescription: 'Configurar a plataforma de PABX virtual para inserir automaticamente um intervalo suplementar de 180 segundos entre atendimentos finalizados para preenchimento de chamados, sem impactar o tempo de pausa regulamentar da NR-17.',
    justification: 'Ação diretamente direcionada à redução da pressão temporal e sobrecarga no setor de Atendimento (R-001).',
    implementationSteps: [
      'Solicitar ao fornecedor de PABX a alteração da regra do distribuidor de chamados (ACD).',
      'Testar a alteração em grupo piloto de 5 operadores por 1 semana.',
      'Ajustar os indicadores de desempenho operacional para desconsiderar o tempo de buffer.',
      'Comunicar e orientar toda a equipe de atendimento sobre a nova funcionalidade.'
    ],
    responsibleRole: 'Gestão de Tecnologia e Operações de Teleatendimento',
    responsiblePerson: 'Carlos Eduardo Mendes (Gerente de TI)',
    deadline: '2026-10-30',
    requiredResources: 'Ajuste de configuração em contrato vigente com provedor de PABX.',
    executionIndicator: 'Configuração do buffer ativa e funcional em 100% das posições de atendimento.',
    efficacyIndicator: 'Redução observada de pelo menos 15% na percepção de sobrecarga na próxima campanha.',
    verificationMethod: 'Auditoria nos logs do sistema ACD e aplicação de questionário pulse com a equipe.',
    status: 'em_andamento', // AÇÃO APROVADA E EM ANDAMENTO
    origin: 'ia_sugerida',
    aiAssumptions: 'PABX permite parametrização do tempo de wrap-up sem custos contratuais extras.',
    aiMissingInfo: 'Confirmar SLA de atendimento com clientes corporativos.',
    approvedBy: 'Dra. Patricia Lima Fernandes',
    approvedAt: '2026-09-18T10:00:00.000Z',
    createdAt: '2026-09-17T15:00:00.000Z',
    updatedAt: '2026-09-18T10:00:00.000Z',
  },
  {
    id: 'act-002',
    code: 'ACT-002',
    linkedRiskIds: ['risk-002'],
    linkedRiskCodes: ['R-002'],
    title: 'Formalização da Matriz de Responsabilidades (RACI) e ponto focal único para demandas do desenvolvimento',
    actionDescription: 'Definir formalmente que todas as solicitações de alteração de escopo na sprint devem obrigatoriamente passar pela aprovação prévia do Gerente Técnico, eliminando ordens diretas de múltiplos interlocutores.',
    justification: 'Combate a ambiguidade e conflito de papéis identificado na equipe de software (R-002).',
    implementationSteps: [
      'Mapear e publicar o fluxo oficial de entrada de demandas de software no Jira.',
      'Realizar workshop de alinhamento entre Product Owners, Gerentes e desenvolvedores.',
      'Revisar as descrições de papel no sistema interno de RH.'
    ],
    responsibleRole: 'Coordenação de Engenharia de Software e RH',
    responsiblePerson: 'Mariana Castro (Tech Lead)',
    deadline: '2026-09-01', // PRAZO VENCIDO PARA DEMONSTRAR ALERTA DE ATRASO!
    requiredResources: 'Horas de alinhamento das lideranças técnicas.',
    executionIndicator: 'Matriz RACI publicada no Confluence e 100% dos desenvolvedores alinhados.',
    efficacyIndicator: 'Redução de relatos de orientações contraditórias para zero nas reuniões retro.',
    verificationMethod: 'Checagem mensal nas reuniões de retrospectiva de sprint.',
    status: 'em_andamento', // EM ANDAMENTO COM PRAZO VENCIDO
    origin: 'ia_sugerida',
    approvedBy: 'Dra. Patricia Lima Fernandes',
    approvedAt: '2026-08-20T14:00:00.000Z',
    createdAt: '2026-08-19T11:00:00.000Z',
    updatedAt: '2026-08-20T14:00:00.000Z',
  },
  {
    id: 'act-003',
    code: 'ACT-003',
    linkedRiskIds: ['risk-001'],
    linkedRiskCodes: ['R-001'],
    title: 'Implantação de escala de revezamento de horários para distribuição uniforme do pico de atendimento',
    actionDescription: 'Ajustar a escala de entrada dos atendentes para cobrir o intervalo das 14h às 16h com maior número de posições ativas.',
    justification: 'Ação preventiva para suavizar o acúmulo de chamados em horários de pico.',
    implementationSteps: [
      'Analisar histórico de chamados por faixa de 30 minutos.',
      'Propor nova grade de horários de entrada com concordância dos trabalhadores.',
      'Ativar a nova escala no sistema de folha e ponto.'
    ],
    responsibleRole: 'Supervisão de Operações de Atendimento',
    responsiblePerson: 'Roberto Alves (Supervisor de Operações)',
    deadline: '2026-09-10',
    requiredResources: 'Sistema de gestão de escalas de pessoal.',
    executionIndicator: 'Nova escala homologada e em operação há 15 dias.',
    efficacyIndicator: 'Dimensionamento adequado confirmado e diminuição da taxa de abandono de chamados.',
    verificationMethod: 'Reavaliação por questionário e análise dos indicadores ergonômicos agregados.',
    status: 'em_verificacao_eficacia', // IMPLEMENTADA AGUARDANDO VERIFICAÇÃO DE EFICÁCIA
    executionEvidenceNotes: 'Nova escala em vigor desde 10/09/2026. Acompanhamento do nível de ruído e queixas em andamento.',
    origin: 'manual',
    approvedBy: 'Dra. Patricia Lima Fernandes',
    approvedAt: '2026-08-25T09:00:00.000Z',
    createdAt: '2026-08-24T16:00:00.000Z',
    updatedAt: '2026-09-11T10:00:00.000Z',
  },
  {
    id: 'act-004',
    code: 'ACT-004',
    linkedRiskIds: ['risk-003'],
    linkedRiskCodes: ['R-003'],
    title: 'Criação de Comitê de Participação na Definição de Rotinas e Sequenciamento no Teleatendimento',
    actionDescription: 'Criar grupo quinzenal de escuta técnica com representantes dos operadores para sugerir melhorias no roteiro de atendimento e telas do sistema.',
    justification: 'Proposta sugerida pela IA para elevação da autonomia percebida e margem de controle sobre o trabalho.',
    implementationSteps: [
      'Eleger 3 representantes dos operadores por turno.',
      'Definir pauta quinzenal de 45 minutos para avaliação de usabilidade dos sistemas.',
      'Encaminhar sugestões aprovadas para a equipe de TI.'
    ],
    responsibleRole: 'Supervisão de Atendimento e Recursos Humanos',
    deadline: '2026-11-15',
    requiredResources: 'Sala de reunião e 45 minutos quinzenais por participante.',
    executionIndicator: 'Primeira reunião do comitê realizada com ata assinada.',
    efficacyIndicator: 'Elevação na pontuação da dimensão Autonomia na campanha subsequente.',
    verificationMethod: 'Atas de reunião e reavaliação anual do questionário de fatores psicossociais.',
    status: 'proposta', // SUGESTÃO DA IA AGUARDANDO REVISÃO E APROVAÇÃO HUMANA
    origin: 'ia_sugerida',
    aiAssumptions: 'Disponibilidade de tempo dos representantes sem prejuízo à operação.',
    aiMissingInfo: 'Confirmar se o sindicato local exige acordo coletivo para criação de comissões internas.',
    createdAt: '2026-09-19T14:00:00.000Z',
    updatedAt: '2026-09-19T14:00:00.000Z',
  },
];

export const DEMO_METHODOLOGY_SOURCES: MethodologySource[] = [
  {
    id: 'meth-nr1',
    name: 'NR-1 — Disposições Gerais e Gerenciamento de Riscos Ocupacionais (GRO/PGR)',
    instrumentEdition: 'Portaria SEPRT/ME nº 6.730/2020 e atualizações vigentes MTE',
    countryLanguage: 'Brasil (Português)',
    documentSource: 'Ministério do Trabalho e Emprego (MTE) — Normas Regulamentadoras Vigentes',
    sectionPage: 'Item 1.5 — Gerenciamento de Riscos Ocupacionais (GRO)',
    calculationRulesSummary: 'A NR-1 exige a identificação dos perigos, avaliação das vulnerabilidades e riscos ocupacionais com gradação de severidade e probabilidade para elaboração do Plano de Ação do PGR.',
    interpretationCriteria: 'Conforme critérios técnicos definidos pelo profissional qualificado responsável pelo GRO.',
    verificationStatus: 'Verificado documentalmente',
    limitations: 'A NR-1 estabelece diretrizes de gestão de riscos ocupacionais, mas não prescreve um questionário ou fórmula matemática específica de pontuação de fatores psicossociais.',
  },
  {
    id: 'meth-copsoq',
    name: 'COPSOQ — Copenhagen Psychosocial Questionnaire (Rede Internacional)',
    instrumentEdition: 'COPSOQ I, II e III',
    countryLanguage: 'Dinamarca (Original) / Adaptações Internacionais',
    documentSource: 'COPSOQ International Network — https://www.copsoq-network.org/',
    sectionPage: 'Licença, diretrizes e estudos de validação da rede internacional',
    calculationRulesSummary: 'Correção padronizada por dimensão com conversão para escala 0-100. Pede tratamento rigoroso de dados ausentes sem substituição por zero.',
    interpretationCriteria: 'Comparação com valores de referência populacionais ou benchmarks nacionais quando disponíveis e validados.',
    verificationStatus: 'Pendente de validação documental',
    limitations: 'As versões em Português do Brasil do COPSOQ demandam validação formal dos manuais e pontos de corte por pesquisas científicas de adaptação transcultural.',
  },
  {
    id: 'meth-demo',
    name: 'Questionário Demonstrativo PsicoGestão NR-1 (12 Itens)',
    instrumentEdition: 'Edição Demonstrativa do Protótipo 2026',
    countryLanguage: 'Brasil (Português)',
    documentSource: 'Manual do Protótipo PsicoGestão NR-1',
    sectionPage: 'Módulo de Cálculo e Regras Demonstrativas',
    calculationRulesSummary: 'Pontuação média por dimensão em escala 1-5, normalizada deterministicamente para escala 0-100. Inversão dos itens negativos e aplicação do limite K=5 para supressão por privacidade.',
    interpretationCriteria: 'Apenas estatísticas descritivas agregadas (Média, Frequências). Sem faixas automáticas de diagnóstico individual.',
    verificationStatus: 'Instrumento demonstrativo',
    limitations: 'Não possui validação psicométrica ou epidemiológica. Destinado exclusivamente ao teste de usabilidade e fluxos do software.',
  },
];
