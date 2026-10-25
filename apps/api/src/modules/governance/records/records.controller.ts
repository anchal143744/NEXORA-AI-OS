import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateArchiveJobDto, CreateLifecycleActionDto } from '../dto/governance.dto';
import { RecordsLifecycleService } from './records.service';

@ApiTags('Records Lifecycle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'records', version: '1' })
export class RecordsController {
  constructor(private readonly records: RecordsLifecycleService) {}

  @Get('actions') actions(@Query('status') status?: string, @Query('actionType') actionType?: string) { return this.records.actions(status, actionType); }
  @Post('actions') createAction(@Body() dto: CreateLifecycleActionDto) { return this.records.createAction(dto); }
  @Post('actions/:id/execute') executeAction(@Param('id') id: string) { return this.records.executeAction(id); }
  @Post('actions/:id/recover') recoverAction(@Param('id') id: string) { return this.records.recoverAction(id); }
  @Get('archives') archives(@Query('status') status?: string) { return this.records.archives(status); }
  @Post('archives') createArchive(@Body() dto: CreateArchiveJobDto) { return this.records.createArchive(dto); }
  @Post('archives/:id/complete') completeArchive(@Param('id') id: string) { return this.records.completeArchive(id); }
}