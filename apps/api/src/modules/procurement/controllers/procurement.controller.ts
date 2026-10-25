
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateProcurementEventDto, CreateProcurementRequestDto, CreatePurchaseCategoryDto } from '../dto/procurement.dto';
import { ProcurementService } from '../procurement.service';
import { ProcurementWorkflowService } from '../procurement-workflow.service';
import { SpendIntelligenceService } from '../spend-intelligence.service';

@ApiTags('Procurement')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'procurement', version: '1' })
export class ProcurementController {
  constructor(private readonly procurement: ProcurementService, private readonly workflow: ProcurementWorkflowService, private readonly spend: SpendIntelligenceService) {}
  @Get('dashboard') dashboard() { return this.procurement.dashboard(); }
  @Get('requests') requests(@Query('status') status?: string, @Query('priority') priority?: string, @Query('vendorId') vendorId?: string) { return this.workflow.requests(status, priority, vendorId); }
  @Post('requests') createRequest(@Body() dto: CreateProcurementRequestDto) { return this.workflow.createRequest(dto); }
  @Get('categories') categories(@Query('status') status?: string) { return this.workflow.categories(status); }
  @Post('categories') createCategory(@Body() dto: CreatePurchaseCategoryDto) { return this.workflow.createCategory(dto); }
  @Get('events') events(@Query('eventType') eventType?: string, @Query('severity') severity?: string, @Query('vendorId') vendorId?: string) { return this.spend.procurementEvents(eventType, severity, vendorId); }
  @Post('events') createEvent(@Body() dto: CreateProcurementEventDto) { return this.spend.createEvent(dto); }
}
