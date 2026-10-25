import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class AdaptiveWorkspaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  createBlueprint(data: { tenantId: string; workspaceId: string; businessId?: string; industry: string; businessType: string; profile: Prisma.InputJsonObject; blueprint: Prisma.InputJsonObject; version?: number }) {
    return this.prisma.workspaceBlueprint.create({ data: { ...data, version: data.version ?? 1 } });
  }

  async latestBlueprint(tenantId: string, workspaceId?: string, blueprintId?: string) {
    const blueprint = await this.prisma.workspaceBlueprint.findFirst({ where: { tenantId, id: blueprintId, workspaceId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
    if (!blueprint) throw new NotFoundException('Workspace blueprint not found');
    return blueprint;
  }

  upsertIndustryTemplate(input: { industry: string; template: Prisma.InputJsonObject }) {
    return this.prisma.industryTemplate.upsert({ where: { industry: input.industry }, update: { template: input.template }, create: { industry: input.industry, template: input.template } });
  }

  createRecommendation(input: { tenantId: string; workspaceId?: string; businessId?: string; recommendationType: string; title: string; summary: string; payload: Prisma.InputJsonObject }) {
    return this.prisma.recommendationTemplate.create({ data: input });
  }
}
