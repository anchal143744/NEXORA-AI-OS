
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateVendorContractDto } from '../dto/procurement.dto';
import { VendorManagementService } from '../vendor-management.service';

@ApiTags('Vendor Contracts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'vendor-contracts', version: '1' })
export class VendorContractsController {
  constructor(private readonly vendors: VendorManagementService) {}
  @Get('dashboard') dashboard() { return this.vendors.dashboard(); }
  @Get() list(@Query('status') status?: string, @Query('contractType') contractType?: string, @Query('vendorId') vendorId?: string) { return this.vendors.contracts(status, contractType, vendorId); }
  @Post() create(@Body() dto: CreateVendorContractDto) { return this.vendors.createContract(dto); }
}
