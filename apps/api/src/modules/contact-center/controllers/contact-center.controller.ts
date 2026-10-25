import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ContactCenterService } from '../contact-center.service';
import { CreateAgentAssignmentDto, CreateContactCenterQueueDto, CreateEscalationDto, UpdateAssignmentStatusDto } from '../dto/contact-center.dto';

@ApiTags('Contact Center')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'contact-center', version: '1' })
export class ContactCenterController {
  constructor(private readonly contactCenter: ContactCenterService) {}

  @Get('queues') queues(@Query('status') status?: string) { return this.contactCenter.queues(status); }
  @Post('queues') createQueue(@Body() dto: CreateContactCenterQueueDto) { return this.contactCenter.createQueue(dto); }
  @Get('queues/:id') queue(@Param('id') id: string) { return this.contactCenter.getQueue(id); }
  @Get('unified-inbox') unifiedInbox(@Query('queueId') queueId?: string) { return this.contactCenter.unifiedInbox(queueId); }
  @Get('assignments') assignments(@Query('status') status?: string, @Query('queueId') queueId?: string) { return this.contactCenter.assignments(status, queueId); }
  @Post('assignments') createAssignment(@Body() dto: CreateAgentAssignmentDto) { return this.contactCenter.createAssignment(dto); }
  @Patch('assignments/:id/status') updateAssignmentStatus(@Param('id') id: string, @Body() dto: UpdateAssignmentStatusDto) { return this.contactCenter.updateAssignmentStatus(id, dto); }
  @Get('escalations') escalations(@Query('status') status?: string) { return this.contactCenter.escalations(status); }
  @Post('escalations') escalate(@Body() dto: CreateEscalationDto) { return this.contactCenter.escalate(dto); }
  @Get('service-levels') serviceLevels(@Query('queueId') queueId?: string) { return this.contactCenter.serviceLevels(queueId); }
  @Get('agents/workspace') agentWorkspace(@Query('userId') userId?: string) { return this.contactCenter.agentWorkspace(userId); }
}
