import { Injectable } from '@nestjs/common';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { BusinessHealthService } from './business-health.service';
import { InsightEngine } from './insight.engine';
import { RecommendationEngine } from './recommendation.engine';
@Injectable()
export class ExecutiveSummaryService { constructor(private readonly context: TenantContextService, private readonly health: BusinessHealthService, private readonly insights: InsightEngine, private readonly recommendations: RecommendationEngine) {} async summary() { const tenantId = this.context.currentTenantId(); const workspaceId = this.context.currentWorkspaceId(); const health = await this.health.score(); const recommendations = await this.recommendations.generate(tenantId, workspaceId, health); const insight = await this.insights.generate({ tenantId, workspaceId, type: 'executive', context: { health, recommendations } }); return { health, recommendations, insight, departmentSummaries: { crm: health.values['crm.conversion_rate'], finance: health.values['finance.profit'], hr: health.values['hr.attendance_rate'], operations: health.values['operations.workflow_success_rate'] } }; } }
