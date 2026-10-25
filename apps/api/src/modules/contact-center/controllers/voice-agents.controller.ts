import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CompleteVoiceAgentExecutionDto, HumanHandoffDto, StartVoiceAgentExecutionDto } from '../dto/contact-center.dto';
import { VoiceAgentsService } from '../voice-agents.service';

@ApiTags('Voice Agents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'voice-agents', version: '1' })
export class VoiceAgentsController {
  constructor(private readonly agents: VoiceAgentsService) {}

  @Get() listAgents() { return this.agents.listAgents(); }
  @Get('capabilities') capabilities(@Query('agentKey') agentKey?: string) { return this.agents.capabilities(agentKey); }
  @Get('executions') executions(@Query('status') status?: string) { return this.agents.executions(status); }
  @Post('executions') startExecution(@Body() dto: StartVoiceAgentExecutionDto) { return this.agents.startExecution(dto); }
  @Get('executions/:id') execution(@Param('id') id: string) { return this.agents.getExecution(id); }
  @Post('executions/:id/complete') complete(@Param('id') id: string, @Body() dto: CompleteVoiceAgentExecutionDto) { return this.agents.completeExecution(id, dto); }
  @Post('executions/:id/handoff') handoff(@Param('id') id: string, @Body() dto: HumanHandoffDto) { return this.agents.requestHandoff(id, dto); }
}
