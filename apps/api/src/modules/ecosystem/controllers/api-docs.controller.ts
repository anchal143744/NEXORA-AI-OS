import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateApiDocumentationDto } from '../dto/ecosystem.dto';
import { EcosystemCatalogService } from '../ecosystem-catalog.service';
import { EcosystemService } from '../ecosystem.service';

@ApiTags('API Documentation Hub')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'api-docs', version: '1' })
export class ApiDocsController {
  constructor(private readonly catalog: EcosystemCatalogService, private readonly center: EcosystemService) {}
  @Get('hub') hub() { return this.center.apiDocs(); }
  @Get() docs(@Query('status') status?: string, @Query('audience') audience?: string, @Query('apiProductId') apiProductId?: string) { return this.catalog.apiDocs(status, audience, apiProductId); }
  @Post() create(@Body() dto: CreateApiDocumentationDto) { return this.catalog.createApiDocumentation(dto); }
}
