import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../rbac/decorators/require-permissions.decorator';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { CrmService } from './crm.service';
import {
  AiSalesCommandDto,
  CloseOpportunityDto,
  CreateCustomerDto,
  CreateLeadDto,
  CreateOpportunityDto,
  CreatePipelineDto,
  UpdateCustomerDto,
  UpdateLeadDto,
  UpdateOpportunityDto,
  UpdateOpportunityStageDto,
} from './dto/crm.dto';

@ApiTags('CRM')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller({ path: 'crm', version: '1' })
export class CrmController {
  constructor(private readonly crm: CrmService) {}

  @RequirePermissions('read')
  @Get('workspace') getWorkspace() { return this.crm.getWorkspace(); }

  @RequirePermissions('create')
  @Post('leads') createLead(@Body() dto: CreateLeadDto) { return this.crm.createLead(dto); }
  @RequirePermissions('read')
  @Get('leads') listLeads() { return this.crm.listLeads(); }
  @RequirePermissions('update')
  @Patch('leads/:id') updateLead(@Param('id') id: string, @Body() dto: UpdateLeadDto) { return this.crm.updateLead(id, dto); }
  @RequirePermissions('delete')
  @Delete('leads/:id') deleteLead(@Param('id') id: string) { return this.crm.deleteLead(id); }

  @RequirePermissions('create')
  @Post('customers') createCustomer(@Body() dto: CreateCustomerDto) { return this.crm.createCustomer(dto); }
  @RequirePermissions('read')
  @Get('customers') listCustomers() { return this.crm.listCustomers(); }
  @RequirePermissions('update')
  @Patch('customers/:id') updateCustomer(@Param('id') id: string, @Body() dto: UpdateCustomerDto) { return this.crm.updateCustomer(id, dto); }
  @RequirePermissions('delete')
  @Delete('customers/:id') deleteCustomer(@Param('id') id: string) { return this.crm.deleteCustomer(id); }

  @RequirePermissions('create')
  @Post('pipelines') createPipeline(@Body() dto: CreatePipelineDto) { return this.crm.createPipeline(dto); }

  @RequirePermissions('create')
  @Post('opportunities') createOpportunity(@Body() dto: CreateOpportunityDto) { return this.crm.createOpportunity(dto); }
  @RequirePermissions('update')
  @Patch('opportunities/:id') updateOpportunity(@Param('id') id: string, @Body() dto: UpdateOpportunityDto) { return this.crm.updateOpportunity(id, dto); }
  @RequirePermissions('update')
  @Patch('opportunities/:id/stage') updateOpportunityStage(@Param('id') id: string, @Body() dto: UpdateOpportunityStageDto) { return this.crm.updateOpportunityStage(id, dto); }
  @RequirePermissions('update')
  @Post('opportunities/:id/close') closeOpportunity(@Param('id') id: string, @Body() dto: CloseOpportunityDto) { return this.crm.closeOpportunity(id, dto); }

  @RequirePermissions('execute')
  @Post('ai-sales-copilot') runSalesCommand(@Body() dto: AiSalesCommandDto) { return this.crm.runSalesCommand(dto); }
  @RequirePermissions('execute')
  @Post('proposals/:id/export-pdf') exportProposalPdf(@Param('id') id: string) { return this.crm.exportProposalPdf(id); }
  @RequirePermissions('approve')
  @Post('proposals/:id/approval') requestProposalApproval(@Param('id') id: string) { return this.crm.requestProposalApproval(id); }
}
