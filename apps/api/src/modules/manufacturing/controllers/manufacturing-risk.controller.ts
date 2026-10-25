import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {

  CreateManufacturingRiskDto,

} from '../dto/manufacturing.dto';
import { ManufacturingCommandService } from '../manufacturing-command.service';
import { ManufacturingQueryService } from '../manufacturing-query.service';
import { ManufacturingService } from '../manufacturing.service';

@ApiTags('Manufacturing Risk Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'manufacturing-risk', version: '1' })
export class ManufacturingRiskController {
  constructor(private readonly commands: ManufacturingCommandService, private readonly queries: ManufacturingQueryService, private readonly manufacturing: ManufacturingService) {}

  @Get('risks') risks(@Query('severity') severity?: string, @Query('status') status?: string, @Query('riskType') riskType?: string) { return this.queries.risks(severity, status, riskType); }
  @Post('risks') createRisk(@Body() dto: CreateManufacturingRiskDto) { return this.commands.createRisk(dto); }
  @Get('summary') summary(@Query('severity') severity?: string) { return this.queries.risks(severity); }

}

