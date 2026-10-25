import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RetrievalRequestDto } from '../dto/search.dto';
import { RetrievalService } from './retrieval.service';

@ApiTags('Secure Retrieval')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'search/retrieval', version: '1' })
export class RetrievalController {
  constructor(private readonly retrieval: RetrievalService) {}

  @Post() retrieve(@Body() dto: RetrievalRequestDto) { return this.retrieval.retrieve(dto); }
  @Post('copilot') copilot(@Body() dto: RetrievalRequestDto) { return this.retrieval.copilotRetrieval(dto); }
  @Post('agents') agents(@Body() dto: RetrievalRequestDto) { return this.retrieval.agentRetrieval(dto); }
  @Get('sessions') sessions() { return this.retrieval.sessions(); }
  @Get('sessions/:id/results') results(@Param('id') id: string) { return this.retrieval.results(id); }
}