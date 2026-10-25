import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateIndustryTemplatePackDto, InstallIndustryTemplateDto } from '../dto/marketplace.dto';
import { IndustryTemplatePackService } from './industry-template-pack.service';

@ApiTags('Industry Template Packs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'industry-templates', version: '1' })
export class IndustryTemplatePackController {
  constructor(private readonly templates: IndustryTemplatePackService) {}

  @Get() list(@Query('industry') industry?: string, @Query('status') status?: string) { return this.templates.templates(industry, status); }
  @Post() createTemplate(@Body() dto: CreateIndustryTemplatePackDto) { return this.templates.createTemplate(dto); }
  @Post('bootstrap') bootstrapDefaults() { return this.templates.bootstrapDefaults(); }
  @Post(':id/install') install(@Param('id') id: string, @Body() dto: InstallIndustryTemplateDto) { return this.templates.installTemplate(id, dto); }
}