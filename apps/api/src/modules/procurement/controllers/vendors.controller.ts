
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateVendorDto, CreateVendorScorecardDto } from '../dto/procurement.dto';
import { VendorManagementService } from '../vendor-management.service';

@ApiTags('Vendors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'vendors', version: '1' })
export class VendorsController {
  constructor(private readonly vendors: VendorManagementService) {}
  @Get('dashboard') dashboard() { return this.vendors.dashboard(); }
  @Get() list(@Query('status') status?: string, @Query('riskLevel') riskLevel?: string, @Query('vendorType') vendorType?: string) { return this.vendors.vendors(status, riskLevel, vendorType); }
  @Post() create(@Body() dto: CreateVendorDto) { return this.vendors.createVendor(dto); }
  @Get('scorecards') scorecards(@Query('scoreBand') scoreBand?: string, @Query('vendorId') vendorId?: string) { return this.vendors.scorecards(scoreBand, vendorId); }
  @Post('scorecards') createScorecard(@Body() dto: CreateVendorScorecardDto) { return this.vendors.createScorecard(dto); }
}
