
export interface ReorderInputs {
  quantityAvailable: number;
  reorderPoint: number;
  safetyStock: number;
  forecastDemand?: number;
}

export function calculateReplenishmentQuantity(input: ReorderInputs): number {
  const projectedNeed = Math.max(input.reorderPoint + input.safetyStock, input.forecastDemand ?? 0);
  return Math.max(0, projectedNeed - input.quantityAvailable);
}

export function classifyDelayRisk(delayRiskScore?: number | null): 'low' | 'medium' | 'high' | 'critical' {
  if (typeof delayRiskScore !== 'number') return 'low';
  if (delayRiskScore >= 90) return 'critical';
  if (delayRiskScore >= 70) return 'high';
  if (delayRiskScore >= 40) return 'medium';
  return 'low';
}
