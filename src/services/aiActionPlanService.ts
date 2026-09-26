/**
 * AI Action Plan Service for PsicoGestão NR-1
 * Interface and mock provider for generating work-condition control measures.
 * Fully functional without API keys or backend connectivity.
 */

import { ActionSuggestion, RiskAssessment } from '../types/domain';

export interface AiActionPlanRequest {
  selectedRisks: RiskAssessment[];
  companyName: string;
  departmentName: string;
  workActivities: string;
  existingControlMeasures: string;
  additionalContext?: string;
}

export interface AiActionPlanResponse {
  suggestions: ActionSuggestion[];
  providerNote: string;
  generatedAt: string;
  disclaimer: string;
}

export interface IAiActionPlanService {
  generateActionSuggestions(request: AiActionPlanRequest): Promise<AiActionPlanResponse>;
}

/**
 * System Prompt instructions template for future Gemini Server integration.
 * Provided here as a clean contract for server-side implementation.
 */
export const GEMINI_SYSTEM_INSTRUCTION = `
Você é um especialista sênior em Engenharia de Segurança, Ergonomia e Organização do Trabalho.
Sua tarefa é propor medidas de controle preventivas de fatores de risco psicossociais ocupacionais (NR-1).

DIRETRIZES OBRIGATÓRIAS:
1. PRIORIDADE: Foque estritamente na modificação das condições e da ORGANIZAÇÃO DO TRABALHO (distribuição de carga, metas, pausamento, autonomia, clareza de papéis, liderança e apoio).
2. NUNCA restrinja propostas a "palestras de bem-estar", "mindfulness", "ginástica laboral" ou "gestão do estresse individual".
3. Considere as medidas preventivas já existentes no setor e proponha melhorias concretas.
4. NUNCA invente exigências legais inexistentes ou citações falsas.
5. NUNCA prometa eliminar 100% dos riscos psicossociais.
6. Apenas relacione propostas aos RISCOS EXPLICITAMENTE FORNECIDOS no contexto. Não invente novos riscos.
7. Responda em JSON estruturado com os campos solicitados.
`;

/**
 * Mock implementation of AI Action Plan Service.
 * Produces high-fidelity, contextualized suggestions based on risk factors.
 */
export class MockAiActionPlanProvider implements IAiActionPlanService {
  async generateActionSuggestions(request: AiActionPlanRequest): Promise<AiActionPlanResponse> {
    // Simulate short network latency for smooth UI state testing
    await new Promise((resolve) => setTimeout(resolve, 800));

    const suggestions: ActionSuggestion[] = request.selectedRisks.map((risk) => {
      const factorLower = risk.riskFactor.toLowerCase();

      if (factorLower.includes('sobrecarga') || factorLower.includes('ritmo') || factorLower.includes('demanda')) {
        return {
          tempId: `sug-${Math.random().toString(36).substring(2, 9)}`,
          linkedRiskId: risk.id,
          linkedRiskCode: risk.code,
          title: `Revisão do dimensionamento de equipes e regras de repactuação de metas no setor ${risk.departmentName}`,
          actionDescription: `Mapear a volatilidade das demandas diárias no setor de ${risk.departmentName}, estabelecendo um teto máximo diário de chamados/atendimentos por trabalhador e instituindo pausas reguladas de 10 minutos a cada 50 minutos de trabalho contínuo.`,
          justification: `Evidências do inventário indicam sobrecarga quantitativa de trabalho e pressão por tempo (${risk.exposureCharacterization}). Ajustes organizacionais atuam diretamente na causa raiz da fadiga psicofisiológica.`,
          implementationSteps: [
            'Realizar cronoanálise amostral das atividades com participação dos trabalhadores.',
            'Ajustar o sistema de distribuição automatizada de tarefas para respeitar capacidade máxima.',
            'Definir protocolo formal de escalonamento para picos atípicos de demanda.',
            'Capacitar a supervisão imediata na repactuação transparente de prazos.'
          ],
          suggestedResponsibleRole: 'Gestão de Operações e Engenharia de Processos',
          estimatedTimeframe: '60 dias',
          requiredResources: 'Software de gestão de fluxo de trabalho e tempo de equipe para reuniões técnicas.',
          executionIndicator: 'Percentual de adequação da carga diária distribuída por colaborador (Meta: >= 90%).',
          efficacyIndicator: 'Redução na percepção de pressão temporal nas reavaliações agregadas e redução de afastamentos por sobrecarga.',
          verificationMethod: 'Análise trimestral dos relatórios de volume de trabalho e escuta coletiva em reuniões de acompanhamento.',
          assumptions: 'Considerou-se que a infraestrutura de sistemas atual permite configuração de cotas e distribuição automatizada.',
          missingInformation: 'Necessário confirmar se existem sazonabilidades no volume de demandas que exijam contratação temporária suplementar.'
        };
      }

      if (factorLower.includes('comunicação') || factorLower.includes('clareza') || factorLower.includes('papel')) {
        return {
          tempId: `sug-${Math.random().toString(36).substring(2, 9)}`,
          linkedRiskId: risk.id,
          linkedRiskCode: risk.code,
          title: `Matriz de responsabilidades (RACI) e diretrizes para alinhamento de papéis em ${risk.departmentName}`,
          actionDescription: `Elaborar e divulgar a matriz RACI clara para todas as entregas do setor, eliminar sobreposição de comandos diretos e instituir reunião semanal de alinhamento operacional de no máximo 30 minutos.`,
          justification: `A indefinição de atribuições e o conflito de comandos foram registrados como fontes geradoras de ansiedade operacional e retrabalho.`,
          implementationSteps: [
            'Mapear todos os processos-chave do setor e papéis vigentes.',
            'Validar matriz de responsabilidade com as lideranças diretas e equipe.',
            'Formalizar o fluxo oficial de solicitação de demandas e aprovações.',
            'Publicar a matriz em local acessível a todos os integrantes do setor.'
          ],
          suggestedResponsibleRole: 'Liderança do Setor e Recursos Humanos',
          estimatedTimeframe: '30 dias',
          requiredResources: 'Documentação do processo e apoio da consultoria interna de RH.',
          executionIndicator: 'Matriz RACI publicada e 100% da equipe orientada formalmente.',
          efficacyIndicator: 'Elevação da pontuação na dimensão Clareza de Papéis na próxima reavaliação.',
          verificationMethod: 'Verificação em reuniões 1:1 e aplicação de checagem amostral de compreensão do papel.',
          assumptions: 'Pressupõe disponibilidade das lideranças diretas para alinhar fluxos em conjunto.',
          missingInformation: 'Verificar se há divergências entre descrições de cargo oficiais e rotina praticada.'
        };
      }

      // Default contextual suggestion
      return {
        tempId: `sug-${Math.random().toString(36).substring(2, 9)}`,
        linkedRiskId: risk.id,
        linkedRiskCode: risk.code,
        title: `Aprimoramento do suporte da liderança e autonomia operacional em ${risk.departmentName}`,
        actionDescription: `Implementar canal formal de escuta das dificuldades operacionais diárias e descentralizar decisões de menor complexidade para aumentar a autonomia técnica dos trabalhadores.`,
        justification: `A intervenção atua na melhoria do clima de apoio social e fortalecimento da margem de manobra dos colaboradores frente aos imprevistos do trabalho.`,
        implementationSteps: [
          'Identificar decisões rotineiras que podem ser delegadas com segurança.',
          'Elaborar guia de autonomia e tomada de decisão para a equipe.',
          'Realizar oficinas de liderança empática e feedback construtivo.',
          'Avaliar mensalmente os principais gargalos relatados pela equipe.'
        ],
        suggestedResponsibleRole: 'Coordenação do Setor e Comitê de Saúde Ocupacional',
        estimatedTimeframe: '45 dias',
        requiredResources: 'Tempo de liderança para mediação e apoio em treinamento interno.',
        executionIndicator: 'Número de processos com autonomia delegada formalmente.',
        efficacyIndicator: 'Aumento do índice de apoio social percebido e autonomia nos relatórios agregados.',
        verificationMethod: 'Pesquisa pulse trimestral e acompanhamento dos registros de resoluções pelo próprio setor.',
        assumptions: 'Assume-se que a equipe possui maturidade técnica para assumir maior margem de decisão.',
        missingInformation: 'Avaliar necessidades específicas de treinamento para suporte a novas responsabilidades.'
      };
    });

    return {
      suggestions,
      providerNote: 'Sugestões simuladas — Gemini ainda não conectado',
      generatedAt: new Date().toISOString(),
      disclaimer: 'As sugestões geradas por IA são propostas preliminares baseadas nas evidências agregadas e DEVEM ser analisadas, editadas e aprovadas pelo responsável técnico antes da integração ao PGR.',
    };
  }
}
