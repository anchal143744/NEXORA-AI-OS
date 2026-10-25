import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateExtensionDefinitionDto, CreateExtensionHookDto, CreateExtensionPointDto } from '../dto/marketplace.dto';
import { ExtensionFrameworkService } from './extension-framework.service';

@ApiTags('Extension Framework')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'extensions', version: '1' })
export class ExtensionFrameworkController {
  constructor(private readonly extensions: ExtensionFrameworkService) {}

  @Get('sdk') sdk() { return this.extensions.sdk(); }
  @Get('definitions') definitions(@Query('type') type?: string) { return this.extensions.definitions(type); }
  @Post('definitions') createDefinition(@Body() dto: CreateExtensionDefinitionDto) { return this.extensions.createDefinition(dto); }
  @Get('hooks') hooks(@Query('hookType') hookType?: string) { return this.extensions.hooks(hookType); }
  @Post('definitions/:id/hooks') registerHook(@Param('id') id: string, @Body() dto: CreateExtensionHookDto) { return this.extensions.registerHook(id, dto); }
  @Get('extension-points') extensionPoints(@Query('pointType') pointType?: string) { return this.extensions.extensionPoints(pointType); }
  @Post('definitions/:id/extension-points') registerExtensionPoint(@Param('id') id: string, @Body() dto: CreateExtensionPointDto) { return this.extensions.registerExtensionPoint(id, dto); }
}