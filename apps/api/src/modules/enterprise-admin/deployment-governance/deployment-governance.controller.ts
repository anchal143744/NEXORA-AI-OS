import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateChangeRequestDto, CreateEnvironmentDto, CreateFeatureFlagDto, CreateReleaseDto, UpdateFeatureFlagDto } from '../dto/enterprise-admin.dto';
import { DeploymentGovernanceService } from './deployment-governance.service';

@ApiTags('Deployment Governance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'deployment-governance', version: '1' })
export class DeploymentGovernanceController {
  constructor(private readonly governance: DeploymentGovernanceService) {}
  @Get('environments') environments() { return this.governance.environments(); }
  @Post('environments') createEnvironment(@Body() dto: CreateEnvironmentDto) { return this.governance.createEnvironment(dto); }
  @Get('releases') releases(@Query('status') status?: string) { return this.governance.releases(status); }
  @Post('releases') createRelease(@Body() dto: CreateReleaseDto) { return this.governance.createRelease(dto); }
  @Post('releases/:id/approve') approveRelease(@Param('id') id: string) { return this.governance.approveRelease(id); }
  @Post('releases/:id/rollback') rollbackRelease(@Param('id') id: string, @Body() dto: { targetVersion?: string }) { return this.governance.rollbackRelease(id, dto.targetVersion); }
  @Get('feature-flags') featureFlags() { return this.governance.featureFlags(); }
  @Post('feature-flags') createFeatureFlag(@Body() dto: CreateFeatureFlagDto) { return this.governance.createFeatureFlag(dto); }
  @Patch('feature-flags/:id') updateFeatureFlag(@Param('id') id: string, @Body() dto: UpdateFeatureFlagDto) { return this.governance.updateFeatureFlag(id, dto); }
  @Get('change-requests') changeRequests(@Query('status') status?: string) { return this.governance.changeRequests(status); }
  @Post('change-requests') createChangeRequest(@Body() dto: CreateChangeRequestDto) { return this.governance.createChangeRequest(dto); }
}
