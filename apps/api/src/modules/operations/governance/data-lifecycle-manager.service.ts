import { Injectable } from '@nestjs/common';
import { DataRetentionService } from './data-retention.service';
@Injectable()
export class DataLifecycleManager { constructor(private readonly retention: DataRetentionService) {} async evaluate(tenantId: string) { const policies = await this.retention.list(tenantId); return { tenantId, policies, evaluatedAt: new Date().toISOString(), actions: policies.map((p: any) => ({ resourceType: p.resourceType, action: p.action, eligibleBefore: new Date(Date.now() - p.retentionDays * 86400000).toISOString() })) }; } }
