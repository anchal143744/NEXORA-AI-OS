import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ContextSearchDto } from '../dto/search.dto';
import { ContextSearchService } from './context-search.service';

@ApiTags('Context Retrieval Search')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'search/context', version: '1' })
export class ContextSearchController {
  constructor(private readonly contextSearch: ContextSearchService) {}

  @Post() search(@Body() dto: ContextSearchDto) { return this.contextSearch.contextSearch(dto); }
  @Get('workspace') workspace(@Query('query') query = '') { return this.contextSearch.workspaceContext(query); }
  @Get('copilot') copilot(@Query('query') query = '') { return this.contextSearch.copilotContext(query); }
  @Get('agent') agent(@Query('query') query = '') { return this.contextSearch.agentContext(query); }
}