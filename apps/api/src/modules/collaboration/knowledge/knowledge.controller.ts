import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateKnowledgeArticleDto, PublishKnowledgeArticleDto } from '../dto/collaboration.dto';
import { KnowledgeSpacesService } from './knowledge-spaces.service';

@ApiTags('Knowledge')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'knowledge', version: '1' })
export class KnowledgeController {
  constructor(private readonly knowledge: KnowledgeSpacesService) {}

  @Get('articles') articles(@Query('spaceId') spaceId?: string, @Query('status') status?: string) { return this.knowledge.articles(spaceId, status); }
  @Post('articles') createArticle(@Body() dto: CreateKnowledgeArticleDto) { return this.knowledge.createArticle(dto); }
  @Get('articles/:id') getArticle(@Param('id') id: string) { return this.knowledge.getArticle(id); }
  @Patch('articles/:id/publish') publishArticle(@Param('id') id: string, @Body() dto: PublishKnowledgeArticleDto) { return this.knowledge.publishArticle(id, dto); }
  @Get('search') search(@Query('query') query = '') { return this.knowledge.searchKnowledge(query); }
}