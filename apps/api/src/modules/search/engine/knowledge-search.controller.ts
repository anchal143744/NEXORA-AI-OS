import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SavedSearchDto, SearchQueryDto } from '../dto/search.dto';
import { KnowledgeSearchService } from './knowledge-search.service';

@ApiTags('Enterprise Knowledge Search')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'search', version: '1' })
export class KnowledgeSearchController {
  constructor(private readonly searchEngine: KnowledgeSearchService) {}

  @Get('global') global(@Query('query') query = '', @Query('limit') limit?: string) { return this.searchEngine.globalSearch(query, limit ? Number(limit) : undefined); }
  @Get('module') module(@Query('query') query = '', @Query('moduleKey') moduleKey = 'global', @Query('limit') limit?: string) { return this.searchEngine.moduleSearch(query, moduleKey, limit ? Number(limit) : undefined); }
  @Get('discovery') discovery(@Query('query') query = '') { return this.searchEngine.discovery(query); }
  @Post() search(@Body() dto: SearchQueryDto) { return this.searchEngine.search(dto); }
  @Get('saved') saved() { return this.searchEngine.savedSearches(); }
  @Post('saved') save(@Body() dto: SavedSearchDto) { return this.searchEngine.saveSearch(dto); }
  @Post('saved/:id/run') runSaved(@Param('id') id: string) { return this.searchEngine.runSavedSearch(id); }
}