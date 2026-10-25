import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
@Injectable()
export class RecoveryManager { constructor(private readonly prisma: PrismaService) {} start(input: { tenantId?: string; recoveryType: string; backupRunId?: string }) { return this.prisma.recoveryRun.create({ data: { tenantId: input.tenantId, recoveryType: input.recoveryType, backupRunId: input.backupRunId, status: 'RUNNING', strategy: { mode: input.recoveryType, startedAt: new Date().toISOString() } } }); } complete(id: string) { return this.prisma.recoveryRun.update({ where: { id }, data: { status: 'SUCCEEDED', completedAt: new Date() } }); } }
