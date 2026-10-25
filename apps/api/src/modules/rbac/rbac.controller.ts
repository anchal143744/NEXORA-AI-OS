import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignPermissionDto, AssignRoleDto, CreatePermissionDto, CreateRoleDto, PermissionCheckDto } from './dto';
import { RbacService } from './rbac.service';

@ApiTags('RBAC')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'rbac', version: '1' })
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Post('roles')
  @ApiOperation({ summary: 'Create tenant role' })
  createRole(@Body() dto: CreateRoleDto) {
    return this.rbacService.createRole(dto);
  }

  @Post('roles/assign')
  @ApiOperation({ summary: 'Assign role to organization or workspace membership' })
  assignRole(@Body() dto: AssignRoleDto) {
    return this.rbacService.assignRole(dto);
  }

  @Post('permissions')
  @ApiOperation({ summary: 'Create tenant permission' })
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.rbacService.createPermission(dto);
  }

  @Post('permissions/assign')
  @ApiOperation({ summary: 'Assign permission to role' })
  assignPermission(@Body() dto: AssignPermissionDto) {
    return this.rbacService.assignPermission(dto);
  }

  @Post('permissions/check')
  @ApiOperation({ summary: 'Check effective permissions' })
  check(@Body() dto: PermissionCheckDto) {
    return this.rbacService.check(dto);
  }
}
