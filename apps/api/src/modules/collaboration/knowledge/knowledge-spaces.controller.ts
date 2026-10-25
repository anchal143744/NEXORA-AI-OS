import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateKnowledgeCategoryDto, CreateKnowledgeSpaceDto, UpdateKnowledgeSpaceDto } from '../dto/collaboration.dto';
import { KnowledgeSpacesService } from './knowledge-spaces.service';

@ApiTags('Knowledge Spaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'knowledge-spaces', version: '1' })
export class KnowledgeSpacesController {
  constructor(private readonly spaces: KnowledgeSpacesService) {}

  @Get() list(@Query('spaceType') spaceType?: string) { return this.spaces.spaces(spaceType); }
  @Post() create(@Body() dto: CreateKnowledgeSpaceDto) { return this.spaces.createSpace(dto); }
  @Get(':id') get(@Param('id') id: string) { return this.spaces.getSpace(id); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateKnowledgeSpaceDto) { return this.spaces.updateSpace(id, dto); }
  @Get(':id/categories') categories(@Param('id') id: string) { return this.spaces.categories(id); }
  @Post(':id/categories') createCategory(@Param('id') id: string, @Body() dto: CreateKnowledgeCategoryDto) { return this.spaces.createCategory(id, dto); }
  @Get(':id/articles') articles(@Param('id') id: string, @Query('status') status?: string) { return this.spaces.articles(id, status); }
  @Get(':id/activity') activity(@Param('id') id: string) { return this.spaces.spaceActivity(id); }
}