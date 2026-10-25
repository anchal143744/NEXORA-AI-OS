export interface QualityDimensions {
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  uniqueness: number;
}

export function calculateDataQualityScore(dimensions: QualityDimensions): number {
  const values = [dimensions.completeness, dimensions.accuracy, dimensions.consistency, dimensions.timeliness, dimensions.uniqueness];
  return Math.round((values.reduce((sum, value) => sum + Math.max(0, Math.min(100, value)), 0) / values.length) * 100) / 100;
}

export function calculateDuplicateConfidence(matchScore: number, identifierOverlap: number, sourceTrust: number): number {
  return Math.round((matchScore * 0.55 + identifierOverlap * 0.3 + sourceTrust * 0.15) * 100) / 100;
}

export function calculateGoldenRecordTrust(qualityScore: number, sourcePriority: number, survivorshipConfidence: number): number {
  const priorityScore = Math.min(100, sourcePriority * 10);
  return Math.round((qualityScore * 0.45 + priorityScore * 0.2 + survivorshipConfidence * 0.35) * 100) / 100;
}

export function calculateResolutionRate(resolvedCount: number, totalRecords: number): number {
  if (totalRecords <= 0) return 0;
  return Math.round((resolvedCount / totalRecords) * 10000) / 100;
}

export function classifyDataRisk(qualityScore: number, duplicateCount: number): 'low' | 'medium' | 'high' | 'critical' {
  if (qualityScore < 45 || duplicateCount >= 100) return 'critical';
  if (qualityScore < 65 || duplicateCount >= 25) return 'high';
  if (qualityScore < 85 || duplicateCount >= 5) return 'medium';
  return 'low';
}

export function isGoldenRecordEligible(qualityScore: number, matchScore: number, stewardApproved: boolean): boolean {
  return stewardApproved && qualityScore >= 80 && matchScore >= 75;
}
