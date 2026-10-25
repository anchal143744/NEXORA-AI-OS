import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DataLakeService } from '../data-lake.service';
import { CreateDataLakeDto } from '../dto/data-platform.dto';

@ApiTags('Data Lake')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'data-lake', version: '1' })
export class DataLakeController {
  constructor(private readonly dataLake: DataLakeService) {}

  @Get() list(@Query('status') status?: string, @Query('lakeType') lakeType?: string) { return this.dataLake.lakes(status, lakeType); }
  @Post() create(@Body() dto: CreateDataLakeDto) { return this.dataLake.createLake(dto); }
  @Get('overview') overview() { return this.dataLake.overview(); }
  @Get('zones') zones() { return this.dataLake.zones(); }
  @Get('governance') governance() { return this.dataLake.governance(); }
}