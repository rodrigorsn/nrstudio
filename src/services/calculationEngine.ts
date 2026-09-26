/**
 * Deterministic Calculation Engine for PsicoGestão NR-1
 * Pure calculation functions for scoring, missing data handling, and aggregation.
 */

import {
  AnonymousResponse,
  CalculationResult,
  DimensionDefinition,
  DimensionScore,
  InstrumentVersion,
} from '../types/domain';

/**
 * Normalizes a raw 1-5 score into a 0-100 scale.
 * 1 -> 0, 3 -> 50, 5 -> 100
 */
export function normalizeScore(rawAverage: number): number {
  if (isNaN(rawAverage) || rawAverage < 1 || rawAverage > 5) return 0;
  return Math.round(((rawAverage - 1) / 4) * 100 * 10) / 10;
}

/**
 * Calculates raw score for a single question response, considering reverse items.
 */
export function getAdjustedQuestionScore(
  val: number | null | undefined,
  isReversed: boolean
): number | null {
  if (val === null || val === undefined || isNaN(val)) return null;
  if (val < 1 || val > 5) return null;
  return isReversed ? 6 - val : val;
}

/**
 * Calculates calculation results for a set of responses against an instrument version.
 * Applies privacy threshold K (default 5).
 */
export function calculateCampaignResults(
  instrument: InstrumentVersion,
  responses: AnonymousResponse[],
  departmentId?: string,
  minimumThresholdK: number = 5
): CalculationResult {
  // Filter responses by department if specified
  const filteredResponses = departmentId
    ? responses.filter((r) => r.departmentId === departmentId)
    : responses;

  const totalResponses = filteredResponses.length;
  const isPrivacySuppressed = totalResponses < minimumThresholdK;

  const now = new Date().toISOString();

  // If privacy is suppressed or zero responses, return suppressed result shell
  if (isPrivacySuppressed || totalResponses === 0) {
    const emptyDimensionScores: DimensionScore[] = instrument.dimensions.map((dim) => ({
      dimensionId: dim.id,
      dimensionName: dim.name,
      desirableDirection: dim.desirableDirection,
      rawAverage: 0,
      normalizedScore: 0,
      validAnswersCount: 0,
      totalQuestionsCount: dim.questions.length,
      missingPercentage: 100,
      status: isPrivacySuppressed ? 'suprimido_privacidade' : 'dados_insuficientes',
      interpretationNote: isPrivacySuppressed
        ? `Dados suprimidos para proteção da privacidade (mínimo de ${minimumThresholdK} respostas exigidas; recebidas: ${totalResponses}).`
        : 'Nenhuma resposta registrada para esta análise.',
    }));

    return {
      campaignId: responses[0]?.campaignId || '',
      departmentId,
      totalResponsesReceived: totalResponses,
      validResponsesForAnalysis: totalResponses,
      minimumThresholdK,
      isPrivacySuppressed,
      calculatedAt: now,
      dimensionScores: emptyDimensionScores,
      questionDistribution: {},
    };
  }

  // Calculate question distributions
  const questionDistribution: Record<string, Record<number, number>> = {};
  instrument.dimensions.forEach((dim) => {
    dim.questions.forEach((q) => {
      questionDistribution[q.id] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    });
  });

  filteredResponses.forEach((resp) => {
    Object.entries(resp.answers).forEach(([qId, val]) => {
      if (val !== null && val !== undefined && questionDistribution[qId] && val >= 1 && val <= 5) {
        questionDistribution[qId][val] = (questionDistribution[qId][val] || 0) + 1;
      }
    });
  });

  // Calculate dimension scores across all valid responses
  const dimensionScores: DimensionScore[] = instrument.dimensions.map((dim) => {
    let sumAdjustedScores = 0;
    let totalValidAnswers = 0;
    const totalPossibleAnswers = totalResponses * dim.questions.length;

    filteredResponses.forEach((resp) => {
      // Per response, check how many questions in this dimension are valid
      dim.questions.forEach((q) => {
        const rawVal = resp.answers[q.id];
        const adjusted = getAdjustedQuestionScore(rawVal, q.isReversed);
        if (adjusted !== null) {
          sumAdjustedScores += adjusted;
          totalValidAnswers++;
        }
      });
    });

    const missingPercentage = totalPossibleAnswers > 0
      ? Math.round(((totalPossibleAnswers - totalValidAnswers) / totalPossibleAnswers) * 100 * 10) / 10
      : 100;

    // Rule: If > 50% of total possible dimension answers are missing, flag as insufficient data
    if (totalValidAnswers === 0 || missingPercentage > 50) {
      return {
        dimensionId: dim.id,
        dimensionName: dim.name,
        desirableDirection: dim.desirableDirection,
        rawAverage: 0,
        normalizedScore: 0,
        validAnswersCount: totalValidAnswers,
        totalQuestionsCount: dim.questions.length,
        missingPercentage,
        status: 'dados_insuficientes',
        interpretationNote: 'Dados insuficientes para cálculo confiável da dimensão (>50% de respostas ausentes).',
      };
    }

    const rawAverage = Math.round((sumAdjustedScores / totalValidAnswers) * 100) / 100;
    const normalizedScore = normalizeScore(rawAverage);

    return {
      dimensionId: dim.id,
      dimensionName: dim.name,
      desirableDirection: dim.desirableDirection,
      rawAverage,
      normalizedScore,
      validAnswersCount: totalValidAnswers,
      totalQuestionsCount: dim.questions.length,
      missingPercentage,
      status: 'calculado',
      interpretationNote: dim.interpretationNote,
    };
  });

  return {
    campaignId: responses[0]?.campaignId || '',
    departmentId,
    totalResponsesReceived: totalResponses,
    validResponsesForAnalysis: totalResponses,
    minimumThresholdK,
    isPrivacySuppressed: false,
    calculatedAt: now,
    dimensionScores,
    questionDistribution,
  };
}

/**
 * Calculates risk matrix resulting classification based on Severity (1-5) and Probability (1-5).
 * Explicitly marked as a demonstrative matrix rule.
 */
export function calculateRiskLevel(
  severity?: number,
  probability?: number
): { level: 'baixissimo' | 'baixo' | 'medio' | 'alto' | 'critico' | 'pendente_avaliacao'; score: number } {
  if (!severity || !probability) {
    return { level: 'pendente_avaliacao', score: 0 };
  }

  const score = severity * probability;

  if (score >= 20) return { level: 'critico', score };
  if (score >= 12) return { level: 'alto', score };
  if (score >= 6) return { level: 'medio', score };
  if (score >= 3) return { level: 'baixo', score };
  return { level: 'baixissimo', score };
}
