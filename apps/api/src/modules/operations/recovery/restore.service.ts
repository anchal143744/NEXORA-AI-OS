import { Injectable } from '@nestjs/common';
import { RecoveryManager } from './recovery-manager.service';
@Injectable()
export class RestoreService { constructor(private readonly recovery: RecoveryManager) {} async restoreBackup(input: { tenantId?: string; backupRunId: string }) { const run = await this.recovery.start({ tenantId: input.tenantId, recoveryType: 'restore', backupRunId: input.backupRunId }); return this.recovery.complete(run.id); } }
