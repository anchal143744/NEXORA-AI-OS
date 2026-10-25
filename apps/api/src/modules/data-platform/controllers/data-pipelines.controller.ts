import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DataPipelineService } from '../data-pipeline.service';
import { CreateDataPipelineDto, ExecuteDataPipelineDto } from '../dto/data-platform.dto';

@ApiTags('Data Pipelines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'data-pipelines', version: '1' })
export class DataPipelinesController {
  constructor(private readonly pipelines: DataPipelineService) {}

  @Get() list(@Query('status') status?: string, @Query('pipelineType') pipelineType?: string) { return this.pipelines.pipelines(status, pipelineType); }
  @Post() create(@Body() dto: CreateDataPipelineDto) { return this.pipelines.createPipeline(dto); }
  @Post(':id/execute') execute(@Param('id') id: string, @Body() dto: ExecuteDataPipelineDto) { return this.pipelines.executePipeline(id, dto); }
  @Get('health') health() { return this.pipelines.health(); }
  @Get('quality') quality() { return this.pipelines.quality(); }
}