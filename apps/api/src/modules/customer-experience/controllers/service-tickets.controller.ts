import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateServiceEscalationDto, CreateServiceTicketDto, ResolveServiceTicketDto } from '../dto/customer-experience.dto';
import { ServiceAutomationService } from '../service-automation.service';

@ApiTags('Service Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'service-tickets', version: '1' })
export class ServiceTicketsController {
  constructor(private readonly service: ServiceAutomationService) {}

  @Get() tickets(@Query('status') status?: string, @Query('customerIdentityId') customerIdentityId?: string) { return this.service.tickets(status, customerIdentityId); }
  @Post() createTicket(@Body() dto: CreateServiceTicketDto) { return this.service.createTicket(dto); }
  @Get(':id') ticket(@Param('id') id: string) { return this.service.getTicket(id); }
  @Post(':id/escalate') escalate(@Param('id') id: string, @Body() dto: CreateServiceEscalationDto) { return this.service.escalateTicket(id, dto); }
  @Post(':id/resolve') resolve(@Param('id') id: string, @Body() dto: ResolveServiceTicketDto) { return this.service.resolveTicket(id, dto); }
  @Get(':id/resolutions') resolutions(@Param('id') id: string) { return this.service.resolutions(id); }
}
