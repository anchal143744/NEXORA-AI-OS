import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { BusinessHealthService } from './business-health.service';
import { ExecutiveSummaryService } from './executive-summary.service';
import { InsightEngine } from './insight.engine';
@ApiTags('Executive Intelligence') @ApiBearerAuth() @UseGuards(JwtAuthGuard)
@Controller({ version: '1' })
export class ExecutiveController { constructor(private readonly summarySvc: ExecutiveSummaryService, private readonly healthSvc: BusinessHealthService, private readonly insights: InsightEngine, private readonly context: TenantContextService) {} @Get('executive-summary') summary() { return this.summarySvc.summary(); } @Get('business-health') health() { return this.healthSvc.score(); } @Post('insights') generateInsight(@Query('type') type = 'executive') { return this.insights.generate({ tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId(), type, context: {} }); } }
