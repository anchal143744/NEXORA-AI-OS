export function calculateSlaRemainingMinutes(slaMinutes: number, elapsedMinutes: number): number {
  return Math.max(0, Math.round(slaMinutes - elapsedMinutes));
}

export function isSlaBreached(slaMinutes: number, elapsedMinutes: number): boolean {
  return elapsedMinutes > slaMinutes;
}

export function calculateTechnicianUtilization(workMinutes: number, availableMinutes: number): number {
  if (availableMinutes <= 0) return 0;
  return Math.round((workMinutes / availableMinutes) * 10000) / 100;
}

export function calculateFirstTimeFixRate(fixedFirstVisit: number, totalCompleted: number): number {
  if (totalCompleted <= 0) return 0;
  return Math.round((fixedFirstVisit / totalCompleted) * 10000) / 100;
}

export function classifyDispatchRisk(slaRemainingMinutes: number, travelDelayMinutes: number): 'low' | 'medium' | 'high' | 'critical' {
  const pressure = travelDelayMinutes - slaRemainingMinutes;
  if (pressure >= 60) return 'critical';
  if (pressure >= 20) return 'high';
  if (pressure >= 0) return 'medium';
  return 'low';
}

