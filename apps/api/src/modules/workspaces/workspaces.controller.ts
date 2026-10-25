import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenerateWorkspaceDto } from '../adaptive-workspace/dto/adaptive-workspace.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../rbac/decorators/require-permissions.decorator';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@ApiTags('Workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller({ path: 'workspaces', version: '1' })
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @RequirePermissions('create')
  @Post()
  @ApiOperation({ summary: 'Create workspace in current tenant' })
  create(@Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.create(dto);
  }

  @RequirePermissions('execute')
  @Post('generate')
  @ApiOperation({ summary: 'Generate an adaptive workspace blueprint for the current organization context' })
  generate(@Body() dto: GenerateWorkspaceDto) {
    return this.workspacesService.generate(dto);
  }

  @RequirePermissions('read')
  @Get('current')
  @ApiOperation({ summary: 'Get current workspace from request context' })
  current() {
    return this.workspacesService.current();
  }

  @RequirePermissions('update')
  @Patch(':workspaceId')
  @ApiOperation({ summary: 'Update workspace in current tenant' })
  update(@Param('workspaceId') workspaceId: string, @Body() dto: UpdateWorkspaceDto) {
    return this.workspacesService.update(workspaceId, dto);
  }
}
