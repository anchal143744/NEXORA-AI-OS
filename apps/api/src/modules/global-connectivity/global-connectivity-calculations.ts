export function calculateIntegrationSuccessRate(successCount: number, requestCount: number): number {
  if (requestCount <= 0) return 0;
  return Math.round((successCount / requestCount) * 10000) / 100;
}

export function calculateErrorRate(errorCount: number, requestCount: number): number {
  if (requestCount <= 0) return 0;
  return Math.round((errorCount / requestCount) * 10000) / 100;
}

export function calculateGatewayRiskScore(latencyMs: number, errorRate: number, tokenExpiresInHours: number): number {
  const latencyPressure = Math.min(40, latencyMs / 25);
  const errorPressure = Math.min(40, errorRate * 1.5);
  const tokenPressure = tokenExpiresInHours <= 24 ? 20 : 0;
  return Math.round((latencyPressure + errorPressure + tokenPressure) * 100) / 100;
}

export function classifyIntegrationHealth(successRate: number, latencyMs: number, failureCount: number): 'healthy' | 'watch' | 'degraded' | 'critical' {
  if (successRate < 80 || failureCount >= 25) return 'critical';
  if (successRate < 92 || latencyMs >= 3000 || failureCount >= 10) return 'degraded';
  if (successRate < 98 || latencyMs >= 1000 || failureCount >= 3) return 'watch';
  return 'healthy';
}

export function shouldRotateOAuthToken(tokenExpiresInHours: number, authStatus: string): boolean {
  return authStatus !== 'revoked' && tokenExpiresInHours <= 48;
}

export function calculateWebhookRetryDelay(retryCount: number): number {
  return Math.min(3600, Math.round(2 ** Math.max(0, retryCount) * 30));
}
