import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DataContractService } from '../data-contract.service';
import { CreateContractVersionDto, CreateDataContractDto } from '../dto/platform-governance.dto';

@ApiTags('Data Contracts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'data-contracts', version: '1' })
export class DataContractsController {
  constructor(private readonly contracts: DataContractService) {}

  @Get('dashboard') dashboard() { return this.contracts.dashboard(); }
  @Get() list(@Query('domain') domain?: string, @Query('status') status?: string, @Query('contractType') contractType?: string) { return this.contracts.contracts(domain, status, contractType); }
  @Post() create(@Body() dto: CreateDataContractDto) { return this.contracts.createContract(dto); }
  @Get('versions') versions(@Query('dataContractId') dataContractId?: string, @Query('status') status?: string) { return this.contracts.versions(dataContractId, status); }
  @Post('versions') createVersion(@Body() dto: CreateContractVersionDto) { return this.contracts.createVersion(dto); }
}
