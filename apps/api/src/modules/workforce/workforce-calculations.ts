export function calculateRetentionRiskScore(engagementScore: number, performanceScore: number, tenureMonths: number): number {
  const engagementRisk = 100 - Math.max(0, Math.min(100, engagementScore));
  const performancePressure = Math.max(0, Math.min(100, performanceScore)) > 85 ? 10 : 0;
  const tenureRisk = tenureMonths < 12 ? 15 : tenureMonths > 60 ? -8 : 0;
  return Math.max(0, Math.min(100, Math.round(engagementRisk + performancePressure + tenureRisk)));
}

export function classifyTalentScore(score: number): 'emerging' | 'solid' | 'high_performer' | 'leadership_ready' {
  if (score >= 90) return 'leadership_ready';
  if (score >= 78) return 'high_performer';
  if (score >= 55) return 'solid';
  return 'emerging';
}

export function calculateHeadcountGap(plannedHeadcount: number, actualHeadcount: number): number {
  return Math.max(0, plannedHeadcount - actualHeadcount);
}

export function calculateEngagementIndex(feedbackScore: number, growthScore: number, managerScore: number): number {
  return Math.round(((feedbackScore + growthScore + managerScore) / 3) * 100) / 100;
}

