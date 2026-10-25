import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CustomerPortalService } from '../customer-portal.service';
import { CreateCustomerWorkspaceDto } from '../dto/customer-portal.dto';

@ApiTags('Customer Workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'customer-workspaces', version: '1' })
export class CustomerWorkspacesController {
  constructor(private readonly portal: CustomerPortalService) {}
  @Get() workspaces(@Query('customerAccountId') customerAccountId?: string, @Query('status') status?: string, @Query('accessLevel') accessLevel?: string) { return this.portal.workspaces(customerAccountId, status, accessLevel); }
  @Post() createWorkspace(@Body() dto: CreateCustomerWorkspaceDto) { return this.portal.createWorkspace(dto); }
}
