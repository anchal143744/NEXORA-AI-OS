export function calculateYieldRate(completedQuantity: number, scrappedQuantity: number): number {
  const total = completedQuantity + scrappedQuantity;
  if (total <= 0) return 0;
  return Math.round((completedQuantity / total) * 10000) / 100;
}

export function calculateOee(availability: number, performance: number, quality: number): number {
  const normalized = [availability, performance, quality].map((value) => Math.max(0, Math.min(1, value)));
  return Math.round(normalized[0] * normalized[1] * normalized[2] * 10000) / 100;
}

export function classifyManufacturingRisk(probability: number, impactScore: number): 'low' | 'medium' | 'high' | 'critical' {
  const riskScore = Math.max(0, Math.min(1, probability)) * Math.max(0, impactScore);
  if (riskScore >= 80) return 'critical';
  if (riskScore >= 55) return 'high';
  if (riskScore >= 25) return 'medium';
  return 'low';
}

export function calculateUnitProductionCost(materialCost: number, laborCost: number, overheadCost: number, completedQuantity: number): number {
  if (completedQuantity <= 0) return 0;
  return Math.round(((materialCost + laborCost + overheadCost) / completedQuantity) * 100) / 100;
}

