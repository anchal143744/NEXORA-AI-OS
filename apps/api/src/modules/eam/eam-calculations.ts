export function calculateAssetHealthScore(conditionScore: number, reliabilityScore: number, utilizationRate: number): number {
  const condition = Math.max(0, Math.min(100, conditionScore));
  const reliability = Math.max(0, Math.min(100, reliabilityScore));
  const utilizationPenalty = Math.max(0, Math.min(100, utilizationRate)) > 90 ? 8 : 0;
  return Math.max(0, Math.min(100, Math.round(((condition * 0.45) + (reliability * 0.45) + ((100 - utilizationPenalty) * 0.1)) * 100) / 100));
}

export function classifyAssetRisk(healthScore: number, failureProbability: number): 'low' | 'medium' | 'high' | 'critical' {
  const riskScore = (100 - Math.max(0, Math.min(100, healthScore))) + (Math.max(0, Math.min(1, failureProbability)) * 100);
  if (riskScore >= 130) return 'critical';
  if (riskScore >= 95) return 'high';
  if (riskScore >= 55) return 'medium';
  return 'low';
}

export function calculateTotalCostOfOwnership(acquisitionCost: number, maintenanceCost: number, downtimeCost: number, disposalCost = 0): number {
  return Math.round((acquisitionCost + maintenanceCost + downtimeCost + disposalCost) * 100) / 100;
}

export function calculateMaintenanceBacklog(openWorkOrders: number, technicianCapacity: number): number {
  if (technicianCapacity <= 0) return openWorkOrders;
  return Math.max(0, Math.ceil(openWorkOrders - technicianCapacity));
}

