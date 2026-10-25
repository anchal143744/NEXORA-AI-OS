import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAssetWarrantyDto, CreateAssetServiceContractDto, CreateAssetVendorAgreementDto, CreateAssetRenewalReminderDto } from '../dto/eam.dto';
import { EamAnalyticsService } from '../eam-analytics.service';
import { EamCommandService } from '../eam-command.service';
import { EamQueryService } from '../eam-query.service';

@ApiTags('Warranty and Contract Tracking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'warranty-contracts', version: '1' })
export class WarrantyContractsController {
  constructor(private readonly commands: EamCommandService, private readonly queries: EamQueryService, private readonly analytics: EamAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Warranty and Contract Tracking');
  }

  @Get('warranties') listAssetWarranty(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetWarranty', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('warranties') createAssetWarranty(@Body() dto: CreateAssetWarrantyDto) {
    return this.commands.create('assetWarranty', dto);
  }

  @Get('service-contracts') listAssetServiceContract(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetServiceContract', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('service-contracts') createAssetServiceContract(@Body() dto: CreateAssetServiceContractDto) {
    return this.commands.create('assetServiceContract', dto);
  }

  @Get('vendor-agreements') listAssetVendorAgreement(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetVendorAgreement', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('vendor-agreements') createAssetVendorAgreement(@Body() dto: CreateAssetVendorAgreementDto) {
    return this.commands.create('assetVendorAgreement', dto);
  }

  @Get('renewal-reminders') listAssetRenewalReminder(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetRenewalReminder', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('renewal-reminders') createAssetRenewalReminder(@Body() dto: CreateAssetRenewalReminderDto) {
    return this.commands.create('assetRenewalReminder', dto);
  }
}

