import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModuleActivationDto } from './dto/module-activation.dto';
import { ModuleActivationService } from './module-activation.service';
import { ModuleRegistryService } from './module-registry.service';

@ApiTags('Module Registry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'modules', version: '1' })
export class ModuleRegistryController {
  constructor(private readonly registry: ModuleRegistryService, private readonly activation: ModuleActivationService) {}

  @Get('discover')
  @ApiOperation({ summary: 'Discover available adaptive business modules' })
  discover() { return this.registry.discover(); }

  @Get(':moduleKey/metadata')
  @ApiOperation({ summary: 'Get module metadata' })
  metadata(@Param('moduleKey') moduleKey: string) { return this.registry.metadataFor(moduleKey); }

  @Get('businesses/:businessId')
  @ApiOperation({ summary: 'List module activations for a business' })
  activations(@Param('businessId') businessId: string) { return this.registry.activations(businessId); }

  @Post('activate')
  @ApiOperation({ summary: 'Enable or disable module for a business' })
  activate(@Body() dto: ModuleActivationDto) { return this.activation.setActivation(dto); }
}
