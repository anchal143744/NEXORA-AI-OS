import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {

  CreateBillOfMaterialDto,
  CreateBomComponentDto,

} from '../dto/manufacturing.dto';
import { ManufacturingCommandService } from '../manufacturing-command.service';
import { ManufacturingQueryService } from '../manufacturing-query.service';
import { ManufacturingService } from '../manufacturing.service';

@ApiTags('Bill Of Materials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'bill-of-materials', version: '1' })
export class BillOfMaterialsController {
  constructor(private readonly commands: ManufacturingCommandService, private readonly queries: ManufacturingQueryService, private readonly manufacturing: ManufacturingService) {}

  @Get() boms(@Query('status') status?: string) { return this.queries.boms(status); }
  @Post() createBom(@Body() dto: CreateBillOfMaterialDto) { return this.commands.createBom(dto); }
  @Get('components') components(@Query('bomId') bomId?: string) { return this.queries.bomComponents(bomId); }
  @Post('components') createComponent(@Body() dto: CreateBomComponentDto) { return this.commands.createBomComponent(dto); }

}

