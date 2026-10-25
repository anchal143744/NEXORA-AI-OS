export function calculateReadinessScore(scores: { score: number; weight: number }[]): number {
  const totalWeight = scores.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) return 0;
  const weighted = scores.reduce((sum, item) => sum + Math.max(0, Math.min(100, item.score)) * item.weight, 0);
  return Math.round((weighted / totalWeight) * 100) / 100;
}

export function calculateCoverageScore(passedChecks: number, totalChecks: number): number {
  if (totalChecks <= 0) return 0;
  return Math.round((passedChecks / totalChecks) * 10000) / 100;
}

export function calculateErrorBudget(uptimePercent: number, targetUptimePercent: number): number {
  return Math.round((uptimePercent - targetUptimePercent) * 10000) / 10000;
}

export function classifyReleaseRisk(criticalFindings: number, highFindings: number, moderateFindings: number): 'low' | 'medium' | 'high' | 'critical' {
  if (criticalFindings > 0) return 'critical';
  if (highFindings > 0) return 'high';
  if (moderateFindings > 2) return 'medium';
  return 'low';
}

export function isReleaseCandidateEligible(readinessScore: number, criticalFindings: number, highFindings: number, buildPassed: boolean): boolean {
  return buildPassed && readinessScore >= 85 && criticalFindings === 0 && highFindings === 0;
}

export function calculateLoadTestPassRate(successCount: number, requestCount: number): number {
  if (requestCount <= 0) return 0;
  return Math.round((successCount / requestCount) * 10000) / 100;
}
