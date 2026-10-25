import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthMonitoringService {
  status(results: Record<string, { status: string }>) {
    const degraded = Object.values(results).some((result) => !['ok', 'disabled'].includes(result.status));
    return { status: degraded ? 'degraded' : 'ok', checkedAt: new Date().toISOString(), checks: results };
  }
}