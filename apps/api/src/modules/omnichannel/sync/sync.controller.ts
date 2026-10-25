import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { StartSyncDto, UpsertSyncCursorDto } from '../dto/omnichannel.dto';
import { SyncService } from './sync.service';

@ApiTags('Synchronization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'sync', version: '1' })
export class SyncController {
  constructor(private readonly sync: SyncService) {}

  @Get('status') status(@Query('deviceId') deviceId?: string) { return this.sync.status(deviceId); }
  @Post('start') start(@Body() dto: StartSyncDto) { return this.sync.start(dto); }
  @Post('runs/:id/complete') complete(@Param('id') id: string) { return this.sync.complete(id); }
  @Post('reconnect') reconnect(@Body() dto: StartSyncDto) { return this.sync.reconnect(dto); }
  @Get('cursors') cursors(@Query('deviceId') deviceId?: string, @Query('moduleKey') moduleKey?: string) { return this.sync.cursors(deviceId, moduleKey); }
  @Post('cursors') upsertCursor(@Body() dto: UpsertSyncCursorDto) { return this.sync.upsertCursor(dto); }
  @Get('changes') changes(@Query('moduleKey') moduleKey?: string) { return this.sync.changes(moduleKey); }
}