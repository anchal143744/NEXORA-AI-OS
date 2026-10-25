
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ContractLifecycleService } from '../contract-lifecycle.service';
import { CreateContractAmendmentDto, CreateRevenueContractDto } from '../dto/revenue-operations.dto';

@ApiTags('Contracts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'contracts', version: '1' })
export class ContractsController {
  constructor(private readonly contracts: ContractLifecycleService) {}
  @Get() list(@Query('status') status?: string, @Query('contractType') contractType?: string, @Query('revenueAccountId') revenueAccountId?: string) { return this.contracts.contracts(status, contractType, revenueAccountId); }
  @Post() create(@Body() dto: CreateRevenueContractDto) { return this.contracts.createContract(dto); }
  @Get('dashboard') dashboard() { return this.contracts.dashboard(); }
  @Get('amendments') amendments(@Query('revenueContractId') revenueContractId?: string, @Query('status') status?: string) { return this.contracts.amendments(revenueContractId, status); }
  @Post('amendments') createAmendment(@Body() dto: CreateContractAmendmentDto) { return this.contracts.createAmendment(dto); }
}
