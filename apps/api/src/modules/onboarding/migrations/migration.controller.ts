import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateMigrationConnectionDto, CreateMigrationMappingDto, CreateMigrationRunDto } from '../dto/onboarding.dto';
import { MigrationService } from './migration.service';

@ApiTags('Migrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'migrations', version: '1' })
export class MigrationController {
  constructor(private readonly migrations: MigrationService) {}
  @Get('adapters') adapters() { return this.migrations.adapters(); }
  @Get('connections') connections() { return this.migrations.connections(); }
  @Post('connections') createConnection(@Body() dto: CreateMigrationConnectionDto) { return this.migrations.createConnection(dto); }
  @Get('mappings') mappings() { return this.migrations.mappings(); }
  @Post('mappings') createMapping(@Body() dto: CreateMigrationMappingDto) { return this.migrations.createMapping(dto); }
  @Get('runs') runs(@Query('status') status?: string) { return this.migrations.runs(status); }
  @Post('runs') createRun(@Body() dto: CreateMigrationRunDto) { return this.migrations.createRun(dto); }
  @Post('runs/:id/execute') executeRun(@Param('id') id: string, @Body() dto: { records?: Array<Record<string, unknown>> }) { return this.migrations.executeRun(id, dto.records ?? []); }
}
