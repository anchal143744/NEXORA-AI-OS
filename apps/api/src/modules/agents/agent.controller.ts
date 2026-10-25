import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AgentRuntimeService } from './agent-runtime.service';
import { RunAgentDto, UpsertMemoryDto } from './dto/agent.dto';
import { AgentMemoryService } from './memory/agent-memory.service';
import { AgentRegistryService } from './registry/agent-registry.service';
@ApiTags('AI Agents') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller({ path: 'agents', version: '1' })
export class AgentController { constructor(private readonly runtime: AgentRuntimeService, private readonly registry: AgentRegistryService, private readonly memory: AgentMemoryService) {} @Get('registry') listAgents() { return this.registry.list(); } @Post('run') run(@Body() dto: RunAgentDto) { return this.runtime.run(dto.agentKey, dto.objective, dto.input ?? {}); } @Post('memory') upsertMemory(@Body() dto: UpsertMemoryDto) { return this.memory.upsert(dto); } @Get('memory') listMemory(@Query('scope') scope?: string, @Query('agentKey') agentKey?: string) { return this.memory.list(scope, agentKey); } }
