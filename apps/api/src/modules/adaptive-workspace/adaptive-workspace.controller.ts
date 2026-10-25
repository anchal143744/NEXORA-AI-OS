import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GenerateWorkspaceDto } from './dto/adaptive-workspace.dto';
import { WorkspaceBlueprintService } from './blueprints/workspace-blueprint.service';
import { IndustryRegistryService } from './registry/industry-registry.service';

@ApiTags('Adaptive Workspace Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'adaptive-workspace', version: '1' })
export class AdaptiveWorkspaceController {
  constructor(private readonly blueprints: WorkspaceBlueprintService, private readonly industries: IndustryRegistryService) {}

  @Get('industries') getIndustryRegistry() { return this.industries.list(); }
  @Post('generate-workspace') generateWorkspace(@Body() dto: GenerateWorkspaceDto) { return this.blueprints.generate(dto); }
  @Get('blueprint') getWorkspaceBlueprint(@Query('workspaceId') workspaceId?: string, @Query('blueprintId') blueprintId?: string) { return this.blueprints.getLatest(workspaceId, blueprintId); }
  @Get('dashboard-blueprint') getDashboardBlueprint(@Query('workspaceId') workspaceId?: string, @Query('blueprintId') blueprintId?: string) { return this.blueprints.getDashboardBlueprint(workspaceId, blueprintId); }
  @Get('navigation-blueprint') getNavigationBlueprint(@Query('workspaceId') workspaceId?: string, @Query('blueprintId') blueprintId?: string) { return this.blueprints.getNavigationBlueprint(workspaceId, blueprintId); }
  @Get('recommendations') getRecommendations(@Query('workspaceId') workspaceId?: string, @Query('blueprintId') blueprintId?: string) { return this.blueprints.getRecommendations(workspaceId, blueprintId); }
}
