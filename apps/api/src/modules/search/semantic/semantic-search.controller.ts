import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SemanticSearchDto } from '../dto/search.dto';
import { SemanticSearchService } from './semantic-search.service';

@ApiTags('Semantic Search')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'search/semantic', version: '1' })
export class SemanticSearchController {
  constructor(private readonly semantic: SemanticSearchService) {}

  @Post() search(@Body() dto: SemanticSearchDto) { return this.semantic.semanticSearch(dto); }
  @Get('entities') entities(@Query('query') query = '', @Query('entityType') entityType?: string) { return this.semantic.entitySearch(query, entityType); }
  @Get('modules') modules(@Query('query') query = '', @Query('moduleKey') moduleKey = 'global') { return this.semantic.moduleSemantic(query, moduleKey); }
}