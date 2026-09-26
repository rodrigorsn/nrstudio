/**
 * Privacy and Data Protection Policy Service for PsicoGestão NR-1
 * Enforces K-anonymity, group suppression, and AI context sanitization.
 */

import { CalculationResult, PrivacyConfig } from '../types/domain';

export const DEFAULT_PRIVACY_CONFIG: PrivacyConfig = {
  minimumGroupSizeK: 5,
  suppressSmallGroupsInReports: true,
  preventMicroFiltering: true,
};

/**
 * Checks if a sample size complies with privacy threshold K.
 */
export function isSamplePrivacyCompliant(sampleSize: number, k: number = DEFAULT_PRIVACY_CONFIG.minimumGroupSizeK): boolean {
  return sampleSize >= k;
}

/**
 * Sanitizes calculation results, replacing dimension scores with privacy placeholders if sample size < K.
 */
export function enforcePrivacyOnCalculationResult(
  result: CalculationResult,
  config: PrivacyConfig = DEFAULT_PRIVACY_CONFIG
): CalculationResult {
  if (result.totalResponsesReceived < config.minimumGroupSizeK) {
    return {
      ...result,
      isPrivacySuppressed: true,
      dimensionScores: result.dimensionScores.map((score) => ({
        ...score,
        status: 'suprimido_privacidade',
        rawAverage: 0,
        normalizedScore: 0,
        interpretationNote: `Dados suprimidos para proteção do sigilo do grupo (mínimo exigido: ${config.minimumGroupSizeK} respostas; recebidas: ${result.totalResponsesReceived}).`,
      })),
      questionDistribution: {}, // Remove distribution detail
    };
  }

  return result;
}

/**
 * Prepares aggregated context for AI suggestions.
 * Ensures NO individual response text or sub-threshold groups are ever transmitted.
 */
export function prepareAiContextData(
  companyName: string,
  departmentName: string,
  workerCount: number,
  calculationResult: CalculationResult,
  existingMeasures: string,
  privacyConfig: PrivacyConfig = DEFAULT_PRIVACY_CONFIG
): { safe: boolean; reason?: string; contextPayload?: any } {
  if (calculationResult.totalResponsesReceived < privacyConfig.minimumGroupSizeK) {
    return {
      safe: false,
      reason: `Tamanho do grupo (${calculationResult.totalResponsesReceived}) abaixo do limite mínimo de privacidade (K=${privacyConfig.minimumGroupSizeK}). Nenhuma informação agregada pode ser processada.`,
    };
  }

  const safeDimensionScores = calculationResult.dimensionScores
    .filter((d) => d.status === 'calculado')
    .map((d) => ({
      dimensao: d.dimensionName,
      pontuacaoNormalizada0a100: d.normalizedScore,
      direcaoDesejavel: d.desirableDirection === 'high' ? 'Pontuação alta é favorável' : 'Pontuação alta indica maior exigência/risco',
    }));

  return {
    safe: true,
    contextPayload: {
      empresa: companyName,
      setor: departmentName,
      trabalhadoresExpostos: workerCount,
      totalRespostasAnonimasAgregadas: calculationResult.totalResponsesReceived,
      medidasPreventivasAtuais: existingMeasures,
      escoresPorDimensao: safeDimensionScores,
    },
  };
}
