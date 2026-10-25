import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAIModelDto, CreateAIModelRegistryDto, CreateAIModelVersionDto } from '../dto/ai-governance.dto';
import { ModelRegistryService } from '../model-registry.service';

@ApiTags('Model Registry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'model-registry', version: '1' })
export class ModelRegistryController {
  constructor(private readonly registry: ModelRegistryService) {}

  @Get('dashboard') dashboard() { return this.registry.dashboard(); }
  @Get('registries') registries(@Query('status') status?: string, @Query('registryType') registryType?: string) { return this.registry.registries(status, registryType); }
  @Post('registries') createRegistry(@Body() dto: CreateAIModelRegistryDto) { return this.registry.createRegistry(dto); }
  @Get('models') models(@Query('provider') provider?: string, @Query('modelType') modelType?: string, @Query('status') status?: string, @Query('riskTier') riskTier?: string) { return this.registry.models(provider, modelType, status, riskTier); }
  @Post('models') createModel(@Body() dto: CreateAIModelDto) { return this.registry.createModel(dto); }
  @Get('versions') versions(@Query('aiModelId') aiModelId?: string, @Query('status') status?: string, @Query('releaseStage') releaseStage?: string) { return this.registry.versions(aiModelId, status, releaseStage); }
  @Post('versions') createVersion(@Body() dto: CreateAIModelVersionDto) { return this.registry.createVersion(dto); }
}