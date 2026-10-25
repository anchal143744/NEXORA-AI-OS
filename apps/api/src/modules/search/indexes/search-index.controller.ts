import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAccessPolicyDto, CreateEmbeddingDto, CreateSearchIndexDto, IndexDocumentDto, RebuildIndexDto } from '../dto/search.dto';
import { SearchIndexService } from './search-index.service';

@ApiTags('Enterprise Search Indexes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'search/indexes', version: '1' })
export class SearchIndexController {
  constructor(private readonly indexes: SearchIndexService) {}

  @Get() list(@Query('indexType') indexType?: string, @Query('moduleKey') moduleKey?: string) { return this.indexes.listIndexes(indexType, moduleKey); }
  @Post() create(@Body() dto: CreateSearchIndexDto) { return this.indexes.createIndex(dto); }
  @Get('policies') policies(@Query('indexId') indexId?: string) { return this.indexes.policies(indexId); }
  @Post('policies') createPolicy(@Body() dto: CreateAccessPolicyDto) { return this.indexes.createPolicy(dto); }
  @Post(':id/documents') indexDocument(@Param('id') id: string, @Body() dto: IndexDocumentDto) { return this.indexes.indexDocument(id, dto); }
  @Get(':id/documents') documents(@Param('id') id: string) { return this.indexes.documents(id); }
  @Post(':id/embeddings') embedding(@Param('id') id: string, @Body() dto: CreateEmbeddingDto) { return this.indexes.createEmbedding(id, dto); }
  @Get(':id/embeddings') embeddings(@Param('id') id: string) { return this.indexes.embeddings(id); }
  @Post(':id/rebuild') rebuild(@Param('id') id: string, @Body() dto: RebuildIndexDto) { return this.indexes.rebuildIndex(id, dto); }
}