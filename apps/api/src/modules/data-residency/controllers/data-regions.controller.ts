import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DataRegionService } from '../data-region.service';
import { CreateDataLocationDto, CreateDataRegionDto } from '../dto/data-residency.dto';

@ApiTags('Data Regions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'data-regions', version: '1' })
export class DataRegionsController {
  constructor(private readonly regions: DataRegionService) {}

  @Get('dashboard') dashboard() { return this.regions.dashboard(); }
  @Get() regionsList(@Query('countryCode') countryCode?: string, @Query('jurisdiction') jurisdiction?: string, @Query('status') status?: string) { return this.regions.regions(countryCode, jurisdiction, status); }
  @Post() createRegion(@Body() dto: CreateDataRegionDto) { return this.regions.createRegion(dto); }
  @Get('locations') locations(@Query('dataObjectType') dataObjectType?: string, @Query('residencyState') residencyState?: string, @Query('countryCode') countryCode?: string) { return this.regions.dataLocations(dataObjectType, residencyState, countryCode); }
  @Post('locations') createLocation(@Body() dto: CreateDataLocationDto) { return this.regions.createDataLocation(dto); }
}