import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateOfflineStoreDto, QueueOfflineOperationDto, ResolveOfflineConflictDto, UpsertCachePolicyDto, UpsertOfflineModulePolicyDto } from '../dto/omnichannel.dto';
import { OfflineService } from './offline.service';

@ApiTags('Offline Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'offline', version: '1' })
export class OfflineController {
  constructor(private readonly offline: OfflineService) {}

  @Get('policies') policies() { return this.offline.policies(); }
  @Post('policies/cache') upsertCachePolicy(@Body() dto: UpsertCachePolicyDto) { return this.offline.upsertCachePolicy(dto); }
  @Post('policies/modules') upsertModulePolicy(@Body() dto: UpsertOfflineModulePolicyDto) { return this.offline.upsertModulePolicy(dto); }
  @Get('stores') stores(@Query('moduleKey') moduleKey?: string) { return this.offline.stores(moduleKey); }
  @Post('stores') createStore(@Body() dto: CreateOfflineStoreDto) { return this.offline.createStore(dto); }
  @Get('queue') queue(@Query('status') status?: string, @Query('moduleKey') moduleKey?: string) { return this.offline.queue(status, moduleKey); }
  @Post('queue') queueOperation(@Body() dto: QueueOfflineOperationDto) { return this.offline.queueOperation(dto); }
  @Post('queue/:id/execute') execute(@Param('id') id: string) { return this.offline.executeQueueItem(id); }
  @Get('conflicts') conflicts(@Query('status') status?: string) { return this.offline.conflicts(status); }
  @Post('conflicts/:id/resolve') resolve(@Param('id') id: string, @Body() dto: ResolveOfflineConflictDto) { return this.offline.resolveConflict(id, dto); }
}