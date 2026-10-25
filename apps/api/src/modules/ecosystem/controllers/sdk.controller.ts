import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSdkPackageDto } from '../dto/ecosystem.dto';
import { EcosystemCatalogService } from '../ecosystem-catalog.service';
import { EcosystemService } from '../ecosystem.service';

@ApiTags('SDK Distribution Center')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'sdk', version: '1' })
export class SdkController {
  constructor(private readonly catalog: EcosystemCatalogService, private readonly center: EcosystemService) {}
  @Get('center') centerView() { return this.center.sdkCenter(); }
  @Get() packages(@Query('language') language?: string, @Query('status') status?: string, @Query('packageManager') packageManager?: string) { return this.catalog.sdkPackages(language, status, packageManager); }
  @Post() create(@Body() dto: CreateSdkPackageDto) { return this.catalog.createSdkPackage(dto); }
}
