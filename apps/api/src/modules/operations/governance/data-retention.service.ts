import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
@Injectable()
export class DataRetentionService { constructor(private readonly prisma: PrismaService) {} createPolicy(input: { tenantId: string; resourceType: string; retentionDays: number; action?: string }) { return this.prisma.dataRetentionPolicy.create({ data: { tenantId: input.tenantId, resourceType: input.resourceType, retentionDays: input.retentionDays, action: input.action ?? 'ARCHIVE' } }); } list(tenantId: string) { return this.prisma.dataRetentionPolicy.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: 'desc' } }); } }
