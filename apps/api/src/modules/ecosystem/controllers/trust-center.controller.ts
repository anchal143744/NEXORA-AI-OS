import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateComplianceArtifactDto, CreateSecurityCertificationDto, CreateTrustReportDto } from '../dto/ecosystem.dto';
import { TrustCenterService } from '../trust-center.service';

@ApiTags('Trust Center')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'trust-center', version: '1' })
export class TrustCenterController {
  constructor(private readonly trust: TrustCenterService) {}
  @Get('dashboard') dashboard() { return this.trust.dashboard(); }
  @Get('reports') reports(@Query('reportType') reportType?: string, @Query('status') status?: string, @Query('visibility') visibility?: string) { return this.trust.reports(reportType, status, visibility); }
  @Post('reports') createReport(@Body() dto: CreateTrustReportDto) { return this.trust.createReport(dto); }
  @Get('certifications') certifications(@Query('certificationType') certificationType?: string, @Query('status') status?: string, @Query('authority') authority?: string) { return this.trust.certifications(certificationType, status, authority); }
  @Post('certifications') createCertification(@Body() dto: CreateSecurityCertificationDto) { return this.trust.createCertification(dto); }
  @Get('artifacts') artifacts(@Query('artifactType') artifactType?: string, @Query('framework') framework?: string, @Query('status') status?: string) { return this.trust.artifacts(artifactType, framework, status); }
  @Post('artifacts') createArtifact(@Body() dto: CreateComplianceArtifactDto) { return this.trust.createArtifact(dto); }
}
