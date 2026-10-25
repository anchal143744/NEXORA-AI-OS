import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RecordHealthSnapshotDto } from '../dto/enterprise-admin.dto';
import { ProductionOperationsService } from './production-operations.service';

@ApiTags('Production Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'production-operations', version: '1' })
export class ProductionOperationsController {
  constructor(private readonly operations: ProductionOperationsService) {}
  @Get('system-health') systemHealth() { return this.operations.systemHealth(); }
  @Get('api-health') apiHealth() { return this.operations.apiHealth(); }
  @Get('queue-health') queueHealth() { return this.operations.queueHealth(); }
  @Get('workflow-health') workflowHealth() { return this.operations.workflowHealth(); }
  @Get('ai-runtime-health') aiRuntimeHealth() { return this.operations.aiRuntimeHealth(); }
  @Post('health-snapshots') recordSnapshot(@Body() dto: RecordHealthSnapshotDto) { return this.operations.recordSnapshot(dto); }
}
