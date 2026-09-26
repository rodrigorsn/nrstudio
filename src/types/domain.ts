/**
 * Domain types for PsicoGestão NR-1
 * All domain interfaces, standard enums, and data models.
 */

export type WorkRegime = 'presencial' | 'remoto' | 'hibrido';

export interface Department {
  id: string;
  name: string;
  activitiesDescription: string;
  workerCount: number;
  regime: WorkRegime;
  workOrganization: string;
  existingPreventiveMeasures: string;
}

export interface Company {
  id: string;
  name: string;
  establishmentName: string;
  cnpj?: string;
  economicActivityCnae: string;
  processDescription: string;
  totalWorkerCount: number;
  responsibleEvaluator: string;
  responsibleRole: string;
  departments: Department[];
}

export type CampaignStatus = 'rascunho' | 'aberta' | 'encerrada' | 'em_analise' | 'finalizada';

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  instrumentId: string;
  instrumentVersion: string;
  targetDepartmentIds: string[]; // Setores elegíveis
  eligibleWorkerCount: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
  responsibleEvaluator: string;
  participantInstructions: string;
  status: CampaignStatus;
  frozenAt?: string; // Data em que as regras do instrumento foram congeladas ao abrir
  createdAt: string;
  updatedAt: string;
}

export interface QuestionDefinition {
  id: string; // e.g. "Q1", "Q2"
  dimensionId: string;
  text: string;
  options: { label: string; value: number }[]; // Standard 1 to 5
  isReversed: boolean; // Se pontuação alta é positiva ou negativa
  helpText?: string;
}

export interface DimensionDefinition {
  id: string; // e.g. "DEMANDAS", "AUTONOMIA", "APOIO_SOCIAL", "CLAREZA_RECONHECIMENTO"
  name: string;
  description: string;
  desirableDirection: 'high' | 'low'; // 'high' = nota alta é bom; 'low' = nota alta é risco maior
  interpretationNote: string;
  questions: QuestionDefinition[];
}

export type InstrumentValidationStatus = 'validado' | 'pendente_validacao_documental' | 'demonstrativo';

export interface InstrumentVersion {
  id: string;
  code: string; // e.g. "COPSOQ_III_CURTO", "COPSOQ_III_MEDIO", "DEMO_PSICO_12"
  name: string;
  description: string;
  edition: string;
  adaptationLanguage: string;
  validationStatus: InstrumentValidationStatus;
  isPublishable: boolean; // COPSOQ não pode ser publicado sem validação
  dimensions: DimensionDefinition[];
  limitationsNotice: string;
  sourceReference: string;
}

export interface AnonymousResponse {
  id: string;
  campaignId: string;
  departmentId: string;
  submittedAt: string; // ISO Date
  answers: Record<string, number | null>; // questionId -> numeric option value or null if skipped
}

export interface DimensionScore {
  dimensionId: string;
  dimensionName: string;
  desirableDirection: 'high' | 'low';
  rawAverage: number; // 1-5 scale
  normalizedScore: number; // 0-100 scale
  validAnswersCount: number;
  totalQuestionsCount: number;
  missingPercentage: number;
  status: 'calculado' | 'dados_insuficientes' | 'suprimido_privacidade';
  interpretationNote: string;
}

export interface CalculationResult {
  campaignId: string;
  departmentId?: string; // Se undefined, indica resultado consolidado da campanha
  totalResponsesReceived: number;
  validResponsesForAnalysis: number;
  minimumThresholdK: number;
  isPrivacySuppressed: boolean;
  calculatedAt: string;
  dimensionScores: DimensionScore[];
  questionDistribution: Record<string, Record<number, number>>; // questionId -> { optionValue: count }
}

export type RiskSeverity = 1 | 2 | 3 | 4 | 5;
export type RiskProbability = 1 | 2 | 3 | 4 | 5;
export type RiskLevel = 'baixissimo' | 'baixo' | 'medio' | 'alto' | 'critico' | 'pendente_avaliacao';
export type RiskAssessmentStatus = 'em_analise' | 'aguardando_informacoes' | 'avaliado';

export interface LinkedFinding {
  campaignId: string;
  dimensionId: string;
  normalizedScore: number;
  observation: string;
}

export interface RiskAssessment {
  id: string;
  code: string; // e.g. "R-001"
  riskFactor: string; // Fator de risco/perigo psicossocial
  workSituation: string; // Situação de trabalho
  departmentId: string;
  departmentName: string;
  exposedGroup: string; // Grupo de trabalhadores expostos
  exposedWorkerCount: number;
  sourcesAndCircumstances: string; // Fontes ou circunstâncias geradoras
  possibleConsequences: string; // Possíveis consequências identificadas
  exposureCharacterization: string; // Frequência, duração, intensidades
  existingControlMeasures: string; // Medidas preventivas vigentes
  linkedFindings: LinkedFinding[];
  complementaryEvidence: string; // Observações diretas, entrevistas coletivas
  evaluationCriteriaUsed: string; // Critério técnico adotado
  severity?: RiskSeverity;
  severityJustification?: string;
  probability?: RiskProbability;
  probabilityJustification?: string;
  resultingRiskLevel: RiskLevel;
  evaluatorName: string;
  evaluationDate: string;
  status: RiskAssessmentStatus;
  createdAt: string;
  updatedAt: string;
}

export type ActionOrigin = 'ia_sugerida' | 'manual';
export type ActionStatus = 'proposta' | 'aprovada' | 'em_andamento' | 'implementada' | 'em_verificacao_eficacia' | 'concluida' | 'cancelada';

export interface ActionPlanItem {
  id: string;
  code: string; // e.g. "ACT-001"
  linkedRiskIds: string[]; // IDs dos riscos associados
  linkedRiskCodes: string[];
  title: string;
  actionDescription: string; // Medida concreta sobre organização/condições
  justification: string; // Fundamentação baseada nas evidências
  implementationSteps: string[];
  responsibleRole: string; // Área ou função responsável
  responsiblePerson?: string; // Nome do responsável direto
  deadline: string; // YYYY-MM-DD
  requiredResources: string;
  executionIndicator: string; // Indicador de execução
  efficacyIndicator: string; // Indicador de eficácia
  verificationMethod: string; // Forma de verificação
  status: ActionStatus;
  executionEvidenceNotes?: string;
  efficacyVerificationNotes?: string;
  efficacyVerifiedAt?: string;
  origin: ActionOrigin;
  aiAssumptions?: string;
  aiMissingInfo?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActionSuggestion {
  tempId: string;
  linkedRiskId: string;
  linkedRiskCode: string;
  title: string;
  actionDescription: string;
  justification: string;
  implementationSteps: string[];
  suggestedResponsibleRole: string;
  estimatedTimeframe: string;
  requiredResources: string;
  executionIndicator: string;
  efficacyIndicator: string;
  verificationMethod: string;
  assumptions: string;
  missingInformation: string;
}

export interface MethodologySource {
  id: string;
  name: string;
  instrumentEdition: string;
  countryLanguage: string;
  documentSource: string;
  sectionPage?: string;
  calculationRulesSummary: string;
  interpretationCriteria: string;
  verificationStatus: 'Verificado documentalmente' | 'Pendente de validação documental' | 'Instrumento demonstrativo';
  limitations: string;
}

export interface PrivacyConfig {
  minimumGroupSizeK: number; // Padrão: 5
  suppressSmallGroupsInReports: boolean;
  preventMicroFiltering: boolean;
}

export interface ReportSnapshot {
  id: string;
  generatedAt: string;
  companyName: string;
  establishmentName: string;
  cnpj?: string;
  evaluatorName: string;
  evaluatorRole: string;
  campaignsIncluded: string[];
  totalResponsesAnalyzed: number;
  risksSummaryCount: Record<RiskLevel, number>;
  actionPlansSummaryCount: Record<ActionStatus, number>;
  immutableDataJSON: string;
}
