import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {

  CreateManufacturingCopilotQueryDto,

} from '../dto/manufacturing.dto';
import { ManufacturingCommandService } from '../manufacturing-command.service';
import { ManufacturingQueryService } from '../manufacturing-query.service';
import { ManufacturingService } from '../manufacturing.service';

@ApiTags('AI Manufacturing Copilot')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'manufacturing-copilot', version: '1' })
export class ManufacturingCopilotController {
  constructor(private readonly commands: ManufacturingCommandService, private readonly queries: ManufacturingQueryService, private readonly manufacturing: ManufacturingService) {}

  @Get('queries') listQueries(@Query('status') status?: string, @Query('userId') userId?: string) { return this.queries.copilotQueries(status, userId); }
  @Post('queries') createQuery(@Body() dto: CreateManufacturingCopilotQueryDto) { return this.commands.createCopilotQuery(dto); }

}

