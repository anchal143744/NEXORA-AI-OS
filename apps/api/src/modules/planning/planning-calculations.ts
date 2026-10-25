export interface WeightedProgressInput {
  targetValue: number;
  actualValue: number;
  weight?: number;
}

export function calculateOkrProgress(results: WeightedProgressInput[]): number {
  if (results.length === 0) return 0;
  const totalWeight = results.reduce((sum, result) => sum + (result.weight ?? 1), 0);
  if (totalWeight <= 0) return 0;
  const weighted = results.reduce((sum, result) => {
    const target = result.targetValue <= 0 ? 0 : Math.min(100, (result.actualValue / result.targetValue) * 100);
    return sum + target * (result.weight ?? 1);
  }, 0);
  return Math.round((weighted / totalWeight) * 100) / 100;
}

export function calculateBudgetVariance(plannedBudget: number, actualSpend: number): number {
  return Math.round((actualSpend - plannedBudget) * 100) / 100;
}

export function calculateCapacityUtilization(allocatedHours: number, capacityHours: number): number {
  if (capacityHours <= 0) return 0;
  return Math.round((allocatedHours / capacityHours) * 10000) / 100;
}

export function classifyPortfolioHealth(score: number, openRiskCount: number): 'healthy' | 'watch' | 'at_risk' | 'critical' {
  if (score < 45 || openRiskCount >= 10) return 'critical';
  if (score < 65 || openRiskCount >= 5) return 'at_risk';
  if (score < 80 || openRiskCount >= 2) return 'watch';
  return 'healthy';
}

export function calculateScenarioWeightedOutcome(outcomes: { value: number; probability: number }[]): number {
  return Math.round(outcomes.reduce((sum, outcome) => sum + outcome.value * outcome.probability, 0) * 100) / 100;
}

export function classifyStrategyRisk(impactScore: number, confidence: number): 'low' | 'medium' | 'high' | 'critical' {
  const exposure = impactScore * (1 - Math.min(Math.max(confidence, 0), 100) / 100);
  if (exposure >= 75) return 'critical';
  if (exposure >= 50) return 'high';
  if (exposure >= 25) return 'medium';
  return 'low';
}
