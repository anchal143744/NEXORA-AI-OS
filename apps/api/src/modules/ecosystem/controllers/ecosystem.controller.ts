import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateEcosystemEventDto } from '../dto/ecosystem.dto';
import { EcosystemCatalogService } from '../ecosystem-catalog.service';
import { EcosystemService } from '../ecosystem.service';

@ApiTags('External Ecosystem')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'ecosystem', version: '1' })
export class EcosystemController {
  constructor(private readonly center: EcosystemService, private readonly catalog: EcosystemCatalogService) {}
  @Get('center') ecosystemCenter() { return this.center.center(); }
  @Get('events') events(@Query('eventType') eventType?: string, @Query('severity') severity?: string, @Query('source') source?: string) { return this.catalog.ecosystemEvents(eventType, severity, source); }
  @Post('events') createEvent(@Body() dto: CreateEcosystemEventDto) { return this.catalog.createEcosystemEvent(dto); }
}
